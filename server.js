import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, param, validationResult } from 'express-validator';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com", "https://api.openweathermap.org"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// CORS configuration - restrict to specific origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com', 'https://www.your-domain.com'] // Replace with your actual domain
    : ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 API calls per windowMs
  message: {
    error: 'API rate limit exceeded, please try again later.',
    retryAfter: '15 minutes'
  },
});

// Middleware
app.use(limiter);
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Limit payload size

// OpenWeatherMap API key - you can get this free from openweathermap.org
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'your_api_key_here';
const WEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5';

// Google Gemini API configuration for agricultural AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your_gemini_api_key_here';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Input sanitization
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 1000); // Limit length and trim
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({ 
      error: 'Internal server error',
      details: err.message 
    });
  }
};

// Helper function to format prompts for Gemini agricultural AI
function formatPromptForGemini(query, language) {
  const languageMap = {
    'ta-IN': 'Tamil',
    'hi-IN': 'Hindi', 
    'en-IN': 'English',
    'te-IN': 'Telugu',
    'bn-IN': 'Bengali',
    'gu-IN': 'Gujarati',
    'kn-IN': 'Kannada',
    'ml-IN': 'Malayalam',
    'mr-IN': 'Marathi',
    'pa-IN': 'Punjabi',
    'or-IN': 'Odia',
    'as-IN': 'Assamese',
    'auto': 'English'
  };

  const responseLanguage = languageMap[language] || 'English';
  
  const systemPrompt = `You are Uzhav, an expert agricultural AI assistant specialized in Indian farming practices. You have deep knowledge of:

EXPERTISE AREAS:
- Crop cultivation (rice, wheat, sugarcane, cotton, pulses, vegetables, fruits)
- Soil management and testing
- Weather patterns and seasonal farming
- Pest and disease management
- Irrigation techniques and water management
- Fertilizers and nutrients
- Market prices and crop economics
- Sustainable and organic farming
- Regional farming practices across India
- Government schemes and subsidies

RESPONSE GUIDELINES:
1. Always respond in ${responseLanguage} language
2. Provide practical, actionable advice
3. Include specific recommendations with quantities/timings when relevant
4. Consider Indian climate, soil types, and farming conditions
5. Mention cost-effective solutions for small and medium farmers
6. Include traditional knowledge where applicable
7. Be encouraging and supportive
8. Keep responses concise but comprehensive (2-4 sentences)
9. If asked about non-farming topics, politely redirect to agricultural matters

SAFETY:
- Never recommend harmful chemicals without proper safety instructions
- Always mention consulting local agricultural experts for serious problems
- Emphasize sustainable practices

USER QUERY: "${query}"

Respond as Uzhav with expert agricultural advice in ${responseLanguage}:`;

  return systemPrompt;
}

// Helper function to provide intelligent mock responses
function getMockAIResponse(query, language) {
  const lowerQuery = query.toLowerCase();
  
  // Tamil responses
  if (language === 'ta-IN') {
    if (lowerQuery.includes('weather') || lowerQuery.includes('காலநிலை')) {
      return 'இன்றைய காலநிலை விவசாயத்திற்கு ஏற்றது. 25-30°C வெப்பநிலையில் மிதமான ஈரப்பதம். நீர்ப்பாசனம் மற்றும் வயல் வேலைகளுக்கு நல்ல நேரம்.';
    } else if (lowerQuery.includes('soil') || lowerQuery.includes('மண்')) {
      return 'உங்கள் மண்ணின் pH 6.0-7.5 இடையே வைத்துக் கொள்ளுங்கள். கம்போஸ்ட் மற்றும் இயற்கை உரங்கள் சேர்க்கவும். மண் பரிசோதனை செய்து சத்துக்களை கண்டறியுங்கள்.';
    } else if (lowerQuery.includes('crop') || lowerQuery.includes('பயிர்')) {
      return 'இந்த பருவத்திற்கு நெல், சோளம், கரும்பு போன்ற பயிர்கள் ஏற்றது. சரியான விதை இடைவெளி மற்றும் நீர் நிர்வாகம் முக்கியம்.';
    } else if (lowerQuery.includes('disease') || lowerQuery.includes('நோய்')) {
      return 'இலை வாடல் மற்றும் பூஞ்சை நோய்களுக்கு வேப்ப எண்ணெய் தெளிப்பு பயன்படுத்துங்கள். நல்ல வடிகால் மற்றும் காற்றோட்டம் உறுதி செய்யுங்கள்.';
    }
    return `உங்கள் கேள்வி "${query}" பற்றி விவசாய ஆலோசனை அளிக்க நான் இங்கே இருக்கிறேன். மண், பயிர், காலநிலை, சந்தை விலை குறித்து கேளுங்கள்.`;
  }
  
  // Hindi responses  
  if (language === 'hi-IN') {
    if (lowerQuery.includes('weather') || lowerQuery.includes('मौसम')) {
      return 'आज का मौसम खेती के लिए अनुकूल है। 25-30°C तापमान में मध्यम नमी। सिंचाई और खेत के काम के लिए अच्छा समय है।';
    } else if (lowerQuery.includes('soil') || lowerQuery.includes('मिट्टी')) {
      return 'अपनी मिट्टी का pH 6.0-7.5 के बीच रखें। कंपोस्ट और जैविक खाद डालें। मिट्टी की जांच कराकर पोषक तत्वों की कमी पता करें।';
    } else if (lowerQuery.includes('crop') || lowerQuery.includes('फसल')) {
      return 'इस मौसम के लिए धान, मक्का, गन्ना जैसी फसलें उपयुक्त हैं। उचित बीज की दूरी और पानी का प्रबंधन जरूरी है।';
    } else if (lowerQuery.includes('disease') || lowerQuery.includes('बीमारी')) {
      return 'पत्ती झुलसा और फंगल रोगों के लिए नीम तेल का छिड़काव करें। अच्छी जल निकासी और हवा का प्रवाह सुनिश्चित करें।';
    }
    return `आपके प्रश्न "${query}" के बारे में कृषि सलाह देने के लिए मैं यहाँ हूँ। मिट्टी, फसल, मौसम, बाजार दर के बारे में पूछें।`;
  }
  
  // English responses
  if (lowerQuery.includes('weather')) {
    return 'Today\'s weather is suitable for farming. Temperature 25-30°C with moderate humidity. Good time for irrigation and field work.';
  } else if (lowerQuery.includes('soil')) {
    return 'Maintain soil pH between 6.0-7.5. Add compost and organic fertilizers. Test soil to identify nutrient deficiencies.';
  } else if (lowerQuery.includes('crop')) {
    return 'For this season, crops like rice, maize, sugarcane are suitable. Proper seed spacing and water management are important.';
  } else if (lowerQuery.includes('disease')) {
    return 'For leaf blight and fungal diseases, use neem oil spray. Ensure good drainage and air circulation.';
  }
  
  return `I understand your query about "${query}". I'm here to provide agricultural guidance on soil, crops, weather, and market prices. How can I help you further?`;
}

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint works' });
});

// AI Query endpoint using Aksara agricultural model
app.post('/api/ai/query', 
  apiLimiter,
  [
    body('query')
      .isString()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Query must be a string between 1 and 1000 characters')
      .custom((value) => {
        // Check for potentially malicious content
        const suspiciousPatterns = /<script|javascript:|data:/i;
        if (suspiciousPatterns.test(value)) {
          throw new Error('Query contains potentially malicious content');
        }
        return true;
      }),
    body('language')
      .isString()
      .isIn(['hi-IN', 'ta-IN', 'te-IN', 'en-IN', 'bn-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'mr-IN', 'pa-IN', 'or-IN', 'as-IN', 'auto'])
      .withMessage('Language must be a valid language code'),
  ],
  handleValidationErrors,
  async (req, res) => {
  try {
    const { query, language } = req.body;
    
    // Sanitize inputs
    const sanitizedQuery = sanitizeString(query);
    const sanitizedLanguage = sanitizeString(language);
    
    if (!sanitizedQuery) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Format the prompt for agricultural context with language awareness
    const formattedPrompt = formatPromptForGemini(sanitizedQuery, sanitizedLanguage);
    
    if (GEMINI_API_KEY === 'your_gemini_api_key_here') {
      // Demo mode - return intelligent mock response
      const mockResponse = getMockAIResponse(query, language);
      return res.json({ response: mockResponse, mode: 'demo' });
    }

    // Call Google Gemini API
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: formattedPrompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    if (response.data && response.data.candidates && response.data.candidates[0]) {
      const aiResponse = response.data.candidates[0].content.parts[0].text;
      res.json({ response: aiResponse, mode: 'ai', source: 'gemini' });
    } else {
      // Fallback to mock response
      const mockResponse = getMockAIResponse(query, language);
      res.json({ response: mockResponse, mode: 'fallback' });
    }

  } catch (error) {
    console.error('Gemini AI Query error:', error.response?.data || error.message);
    
    // If API quota exceeded or service unavailable
    if (error.response?.status === 429 || error.response?.status === 503) {
      return res.json({ 
        response: getMockAIResponse(req.body.query, req.body.language),
        mode: 'quota_exceeded',
        message: 'AI service temporarily unavailable, using intelligent fallback response'
      });
    }
    
    // Fallback to mock response for any error
    const mockResponse = getMockAIResponse(req.body.query, req.body.language);
    res.json({ response: mockResponse, mode: 'error_fallback' });
  }
});

// Weather endpoints
app.get('/api/weather/current/:city', 
  apiLimiter,
  [
    param('city')
      .isString()
      .isLength({ min: 1, max: 100 })
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage('City name must contain only letters, spaces, hyphens, and apostrophes'),
  ],
  handleValidationErrors,
  async (req, res) => {
  try {
    const { city } = req.params;
    const sanitizedCity = sanitizeString(city);
    const response = await axios.get(
      `${WEATHER_BASE_URL}/weather?q=${encodeURIComponent(sanitizedCity)}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      windSpeed: response.data.wind.speed,
      cloudiness: response.data.clouds.all,
      visibility: response.data.visibility,
      sunrise: response.data.sys.sunrise,
      sunset: response.data.sys.sunset,
      coordinates: {
        lat: response.data.coord.lat,
        lon: response.data.coord.lon
      }
    };
    
    res.json(weatherData);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.get('/api/weather/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(
      `${WEATHER_BASE_URL}/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    const forecastData = response.data.list.map(item => ({
      datetime: item.dt,
      temperature: Math.round(item.main.temp),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      cloudiness: item.clouds.all
    }));
    
    res.json({
      city: response.data.city.name,
      country: response.data.city.country,
      forecast: forecastData
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    console.error('Forecast API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

// Geocoding endpoint for city search suggestions
app.get('/api/weather/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${WEATHER_API_KEY}`
    );
    
    const cities = response.data.map(city => ({
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon
    }));
    
    res.json(cities);
  } catch (error) {
    console.error('Geocoding API error:', error.message);
    res.status(500).json({ error: 'Failed to search cities' });
  }
});

// Weather by coordinates endpoint
app.get('/api/weather/coordinates/:lat/:lon', 
  apiLimiter,
  [
    param('lat')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be a number between -90 and 90'),
    param('lon')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be a number between -180 and 180'),
  ],
  handleValidationErrors,
  async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const response = await axios.get(
      `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      windSpeed: response.data.wind.speed,
      cloudiness: response.data.clouds.all,
      visibility: response.data.visibility,
      sunrise: response.data.sys.sunrise,
      sunset: response.data.sys.sunset,
      coordinates: {
        lat: response.data.coord.lat,
        lon: response.data.coord.lon
      }
    };
    
    res.json(weatherData);
  } catch (error) {
    console.error('Weather by coordinates API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data for location' });
  }
});

// Reverse geocoding endpoint
app.get('/api/weather/reverse-geocode/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}`
    );
    
    if (response.data.length > 0) {
      const location = response.data[0];
      res.json({
        name: location.name,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon
      });
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    console.error('Reverse geocoding API error:', error.message);
    res.status(500).json({ error: 'Failed to get location details' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Weather API server is running' });
});

// Demo weather by coordinates (fallback when API key not configured) - MUST come before /demo/:city
app.get('/api/weather/demo/coordinates/:lat/:lon', async (req, res) => {
  const { lat, lon } = req.params;
  
  // Try to get real location name using reverse geocoding
  let cityName = 'Current Location';
  let countryName = 'Unknown';
  
  try {
    if (WEATHER_API_KEY !== 'your_api_key_here') {
      // Use real reverse geocoding if API key is available
      const geoResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}`
      );
      
      if (geoResponse.data && geoResponse.data.length > 0) {
        const location = geoResponse.data[0];
        cityName = location.name;
        countryName = location.country;
      }
    } else {
      // Simple mock location names based on coordinates for demo
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);
      
      // Basic geographic region detection for demo
      if (latitude >= 8 && latitude <= 37 && longitude >= 68 && longitude <= 97) {
        // India region
        countryName = 'IN';
        if (latitude >= 28 && latitude <= 29 && longitude >= 76 && longitude <= 78) {
          cityName = 'Delhi Region';
        } else if (latitude >= 18 && latitude <= 20 && longitude >= 72 && longitude <= 73) {
          cityName = 'Mumbai Region';
        } else if (latitude >= 12 && latitude <= 14 && longitude >= 77 && longitude <= 78) {
          cityName = 'Bangalore Region';
        } else if (latitude >= 17 && latitude <= 18 && longitude >= 78 && longitude <= 79) {
          cityName = 'Hyderabad Region';
        } else if (latitude >= 22 && latitude <= 23 && longitude >= 88 && longitude <= 89) {
          cityName = 'Kolkata Region';
        } else {
          cityName = 'India';
        }
      } else if (latitude >= 25 && latitude <= 49 && longitude >= -125 && longitude <= -66) {
        // USA region
        countryName = 'US';
        cityName = 'United States';
      } else if (latitude >= 49 && latitude <= 60 && longitude >= -141 && longitude <= -52) {
        // Canada region
        countryName = 'CA';
        cityName = 'Canada';
      } else if (latitude >= 36 && latitude <= 71 && longitude >= -9 && longitude <= 40) {
        // Europe region
        countryName = 'EU';
        cityName = 'Europe';
      } else {
        cityName = `Location (${parseFloat(lat).toFixed(2)}, ${parseFloat(lon).toFixed(2)})`;
      }
    }
  } catch (error) {
    console.log('Reverse geocoding failed, using default location name');
  }
  
  // Mock weather data based on coordinates
  const mockWeatherData = {
    city: cityName,
    country: countryName,
    temperature: Math.floor(Math.random() * 20) + 20, // 20-40°C
    description: 'partly cloudy',
    icon: '02d',
    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
    windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
    cloudiness: Math.floor(Math.random() * 50) + 20, // 20-70%
    visibility: 10000,
    sunrise: Math.floor(Date.now() / 1000) - 6 * 3600, // 6 hours ago
    sunset: Math.floor(Date.now() / 1000) + 6 * 3600, // 6 hours from now
    coordinates: {
      lat: parseFloat(lat),
      lon: parseFloat(lon)
    }
  };
  
  res.json(mockWeatherData);
});

// Fallback for weather demo (when API key is not configured)
app.get('/api/weather/demo/:city', (req, res) => {
  const { city } = req.params;
  
  // Mock weather data for demo purposes
  const mockWeatherData = {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: 'IN',
    temperature: Math.floor(Math.random() * 20) + 20, // 20-40°C
    description: 'partly cloudy',
    icon: '02d',
    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
    windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
    cloudiness: Math.floor(Math.random() * 50) + 20, // 20-70%
    visibility: 10000,
    sunrise: Math.floor(Date.now() / 1000) - 6 * 3600, // 6 hours ago
    sunset: Math.floor(Date.now() / 1000) + 6 * 3600, // 6 hours from now
    coordinates: {
      lat: 28.6139 + (Math.random() - 0.5) * 10,
      lon: 77.2090 + (Math.random() - 0.5) * 10
    }
  };
  
  res.json(mockWeatherData);
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Uzhav API server running on port ${PORT}`);
  console.log('🤖 AI Features: Aksara agricultural AI model integrated');
  if (WEATHER_API_KEY === 'your_api_key_here') {
    console.log('⚠️  Warning: Using weather demo mode. Get a free API key from openweathermap.org and set WEATHER_API_KEY environment variable for real data.');
  }
  if (GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.log('⚠️  Warning: Using AI demo mode. Get a Gemini API key from https://makersuite.google.com/app/apikey and set GEMINI_API_KEY environment variable for real AI responses.');
  }
});
