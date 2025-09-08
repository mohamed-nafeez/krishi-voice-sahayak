import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

console.log('Testing Gemini API...');
console.log('API Key exists:', GEMINI_API_KEY ? 'Yes' : 'No');

async function testGemini() {
  try {
    const prompt = `You are Uzhav, an expert agricultural AI assistant. Provide farming advice in English for this query: "How to grow tomatoes?"`;
    
    console.log('\nMaking API call to Gemini...');
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
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

    console.log('\n✅ Gemini API Response:');
    console.log('Status:', response.status);
    console.log('Response:', response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response text');
    
  } catch (error) {
    console.log('\n❌ Gemini API Error:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data || error.message);
  }
}

testGemini();
