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

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint works', status: 'success' });
});

// AI Query endpoint
app.post('/api/ai/query', async (req, res) => {
  try {
    const { query, language } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Simple response based on query content
    let response;
    const lowerQuery = query.toLowerCase();
    
    if (language === 'ta-IN') {
      if (lowerQuery.includes('weather') || lowerQuery.includes('காலநிலை')) {
        response = 'இன்றைய காலநிலை விவசாயத்திற்கு ஏற்றது. 25-30°C வெப்பநிலையில் மிதமான ஈரப்பதம்.';
      } else if (lowerQuery.includes('soil') || lowerQuery.includes('மண்')) {
        response = 'உங்கள் மண்ணின் pH 6.0-7.5 இடையே வைத்துக் கொள்ளுங்கள். கம்போஸ்ட் சேர்க்கவும்.';
      } else {
        response = `உங்கள் கேள்வி "${query}" பற்றி விவசாய ஆலோசனை அளிக்க நான் இங்கே இருக்கிறேன்.`;
      }
    } else if (language === 'hi-IN') {
      if (lowerQuery.includes('weather') || lowerQuery.includes('मौसम')) {
        response = 'आज का मौसम खेती के लिए अनुकूल है। 25-30°C तापमान में मध्यम नमी।';
      } else if (lowerQuery.includes('soil') || lowerQuery.includes('मिट्टी')) {
        response = 'अपनी मिट्टी का pH 6.0-7.5 के बीच रखें। कंपोस्ट डालें।';
      } else {
        response = `आपके प्रश्न "${query}" के बारे में कृषि सलाह देने के लिए मैं यहाँ हूँ।`;
      }
    } else {
      if (lowerQuery.includes('weather')) {
        response = 'Today\'s weather is suitable for farming. Temperature 25-30°C with moderate humidity.';
      } else if (lowerQuery.includes('soil')) {
        response = 'Maintain soil pH between 6.0-7.5. Add compost and organic fertilizers.';
      } else {
        response = `I understand your query about "${query}". I'm here to provide agricultural guidance.`;
      }
    }

    res.json({ response: response, mode: 'demo' });

  } catch (error) {
    console.error('AI Query error:', error.message);
    res.json({ 
      response: 'I apologize, but I encountered an error. Please try again.', 
      mode: 'error_fallback' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Krishi Voice Sahayak server running on port ${PORT}`);
  console.log('🤖 AI Features: Agricultural assistance enabled');
});
