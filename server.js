import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// OpenWeatherMap API key - you can get this free from openweathermap.org
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'your_api_key_here';
const WEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5';

// Weather endpoints
app.get('/api/weather/current/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(
      `${WEATHER_BASE_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
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
app.get('/api/weather/coordinates/:lat/:lon', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Weather API server running on port ${PORT}`);
  if (WEATHER_API_KEY === 'your_api_key_here') {
    console.log('⚠️  Warning: Using demo mode. Get a free API key from openweathermap.org and set WEATHER_API_KEY environment variable for real data.');
  }
});
