export type LanguageCode = 'hi-IN' | 'ta-IN' | 'te-IN' | 'en-IN' | 'bn-IN' | 'gu-IN' | 'kn-IN' | 'ml-IN' | 'mr-IN' | 'pa-IN' | 'or-IN' | 'as-IN' | 'auto';

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'auto', label: 'Auto Detect' },
  { code: 'hi-IN', label: 'हिंदी (Hindi)' },
  { code: 'en-IN', label: 'English' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)' },
  { code: 'mr-IN', label: 'मराठी (Marathi)' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'or-IN', label: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'as-IN', label: 'অসমীয়া (Assamese)' },
];

// Language detection patterns (simple keyword-based detection)
const LANGUAGE_PATTERNS: Record<string, LanguageCode> = {
  'hello': 'en-IN',
  'namaste': 'hi-IN',
  'namaskar': 'hi-IN',
  'vanakkam': 'ta-IN',
  'namaskaram': 'te-IN',
  'adaab': 'hi-IN',
  'salaam': 'hi-IN',
  'sat sri akal': 'pa-IN',
  'namasthe': 'kn-IN',
  'namaskara': 'ml-IN',
  'namashkar': 'mr-IN',
  'namaskar_gu': 'gu-IN',
  'namaskar_or': 'or-IN',
  'nomoshkar': 'bn-IN',
  'নমস্কার': 'bn-IN',
  'नमस्ते': 'hi-IN',
  'वणक्कम': 'ta-IN',
  'নমস্তে': 'bn-IN',
  'નમસ્તે': 'gu-IN',
  'ನಮಸ್ತೆ': 'kn-IN',
  'നമസ്തെ': 'ml-IN',
  'नमस्ते_mr': 'mr-IN',
  'ନମସ্ତେ': 'or-IN',
  'নমস্তে_as': 'as-IN',
};

export function detectLanguage(text: string): LanguageCode {
  const lowerText = text.toLowerCase().trim();
  
  // If the text is empty or too short, return English as fallback
  if (!lowerText || lowerText.length < 2) {
    return 'en-IN';
  }
  
  // Advanced multi-stage detection
  
  // Stage 1: Direct keyword matching with confidence scoring
  const languageScores: Record<LanguageCode, number> = {
    'en-IN': 0,
    'hi-IN': 0,
    'ta-IN': 0,
    'te-IN': 0,
    'bn-IN': 0,
    'gu-IN': 0,
    'kn-IN': 0,
    'ml-IN': 0,
    'mr-IN': 0,
    'pa-IN': 0,
    'or-IN': 0,
    'as-IN': 0,
    'auto': 0
  };
  
  // Enhanced keyword patterns with weights
  const enhancedPatterns: Record<string, { lang: LanguageCode; weight: number }> = {
    // English (high confidence keywords)
    'hello': { lang: 'en-IN', weight: 3 },
    'good morning': { lang: 'en-IN', weight: 3 },
    'good evening': { lang: 'en-IN', weight: 3 },
    'thank you': { lang: 'en-IN', weight: 3 },
    'please': { lang: 'en-IN', weight: 2 },
    'agriculture': { lang: 'en-IN', weight: 2 },
    'farming': { lang: 'en-IN', weight: 2 },
    'weather': { lang: 'en-IN', weight: 2 },
    'crop': { lang: 'en-IN', weight: 2 },
    'soil': { lang: 'en-IN', weight: 2 },
    'market': { lang: 'en-IN', weight: 2 },
    
    // Hindi
    'namaste': { lang: 'hi-IN', weight: 3 },
    'namaskar': { lang: 'hi-IN', weight: 3 },
    'krishi': { lang: 'hi-IN', weight: 2 },
    'kheti': { lang: 'hi-IN', weight: 2 },
    'fasal': { lang: 'hi-IN', weight: 2 },
    'mitti': { lang: 'hi-IN', weight: 2 },
    'mausam': { lang: 'hi-IN', weight: 2 },
    'kisan': { lang: 'hi-IN', weight: 2 },
    'dhanyawad': { lang: 'hi-IN', weight: 2 },
    
    // Tamil
    'vanakkam': { lang: 'ta-IN', weight: 3 },
    'nandri': { lang: 'ta-IN', weight: 2 },
    'vivasayam': { lang: 'ta-IN', weight: 2 },
    'sandhai': { lang: 'ta-IN', weight: 2 },
    
    // Telugu
    'namaskaram': { lang: 'te-IN', weight: 3 },
    'dhanyavadalu': { lang: 'te-IN', weight: 2 },
    'vyavasayam': { lang: 'te-IN', weight: 2 },
    
    // Bengali
    'nomoshkar': { lang: 'bn-IN', weight: 3 },
    'dhonnobad': { lang: 'bn-IN', weight: 2 },
    'abohaowa': { lang: 'bn-IN', weight: 2 },
    
    // Gujarati
    'namaste_gu': { lang: 'gu-IN', weight: 1 }, // Lower weight as it's common
    'aabhar': { lang: 'gu-IN', weight: 2 },
    
    // Kannada
    'namasthe': { lang: 'kn-IN', weight: 3 },
    'dhanyawada': { lang: 'kn-IN', weight: 2 },
    'havamana': { lang: 'kn-IN', weight: 2 },
    
    // Malayalam
    'namaskara': { lang: 'ml-IN', weight: 3 },
    'nanni': { lang: 'ml-IN', weight: 2 },
    'kalavasta': { lang: 'ml-IN', weight: 2 },
    
    // Marathi
    'namashkar': { lang: 'mr-IN', weight: 3 },
    'sheti': { lang: 'mr-IN', weight: 2 },
    
    // Punjabi
    'sat sri akal': { lang: 'pa-IN', weight: 3 },
    'shukriya': { lang: 'pa-IN', weight: 2 },
    
    // Odia
    'krushi': { lang: 'or-IN', weight: 2 },
    'rutu': { lang: 'or-IN', weight: 2 },
    
    // Assamese
    'batora': { lang: 'as-IN', weight: 2 },
  };
  
  // Check for keyword patterns
  for (const [pattern, { lang, weight }] of Object.entries(enhancedPatterns)) {
    if (lowerText.includes(pattern.toLowerCase())) {
      languageScores[lang] += weight;
    }
  }
  
  // Stage 2: Unicode script detection with weights
  const scriptWeights: Record<string, { lang: LanguageCode; weight: number }> = {
    // English/Latin
    '^[a-zA-Z\\s\\d.,!?]+$': { lang: 'en-IN', weight: 1 },
    
    // Devanagari (Hindi/Marathi) - need to distinguish
    '[\\u0900-\\u097F]': { lang: 'hi-IN', weight: 1.5 },
    
    // Tamil
    '[\\u0B80-\\u0BFF]': { lang: 'ta-IN', weight: 2 },
    
    // Telugu
    '[\\u0C00-\\u0C7F]': { lang: 'te-IN', weight: 2 },
    
    // Bengali
    '[\\u0980-\\u09FF]': { lang: 'bn-IN', weight: 2 },
    
    // Gujarati
    '[\\u0A80-\\u0AFF]': { lang: 'gu-IN', weight: 2 },
    
    // Kannada
    '[\\u0C80-\\u0CFF]': { lang: 'kn-IN', weight: 2 },
    
    // Malayalam
    '[\\u0D00-\\u0D7F]': { lang: 'ml-IN', weight: 2 },
    
    // Punjabi
    '[\\u0A00-\\u0A7F]': { lang: 'pa-IN', weight: 2 },
    
    // Odia
    '[\\u0B00-\\u0B7F]': { lang: 'or-IN', weight: 2 },
  };
  
  // Apply script detection
  for (const [pattern, { lang, weight }] of Object.entries(scriptWeights)) {
    if (new RegExp(pattern).test(text)) {
      languageScores[lang] += weight;
    }
  }
  
  // Stage 3: Character frequency analysis for better Devanagari distinction
  if (text.match(/[\\u0900-\\u097F]/)) {
    // Marathi specific characters
    if (text.includes('ळ') || text.includes('ऱ') || text.includes('झ')) {
      languageScores['mr-IN'] += 2;
    }
    // Hindi gets default Devanagari weight from above
  }
  
  // Stage 4: Length and complexity analysis
  const words = lowerText.split(/\\s+/).filter(word => word.length > 0);
  if (words.length > 0) {
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    // English tends to have shorter average word length
    if (avgWordLength <= 4.5 && /^[a-zA-Z\\s\\d.,!?]+$/.test(text)) {
      languageScores['en-IN'] += 1;
    }
  }
  
  // Stage 5: Find the language with highest score
  const sortedLanguages = Object.entries(languageScores)
    .filter(([lang]) => lang !== 'auto')
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
  
  const topLanguage = sortedLanguages[0];
  const secondLanguage = sortedLanguages[1];
  
  // If top score is 0, apply more sophisticated fallbacks
  if (topLanguage[1] === 0) {
    // Check for pure ASCII text
    if (/^[a-zA-Z\\s\\d.,!?-]+$/.test(text)) {
      return 'en-IN';
    }
    
    // Check for specific Unicode ranges as final fallback
    if (/[\\u0980-\\u09FF]/.test(text)) return 'bn-IN';
    if (/[\\u0B80-\\u0BFF]/.test(text)) return 'ta-IN';
    if (/[\\u0C00-\\u0C7F]/.test(text)) return 'te-IN';
    if (/[\\u0A80-\\u0AFF]/.test(text)) return 'gu-IN';
    if (/[\\u0C80-\\u0CFF]/.test(text)) return 'kn-IN';
    if (/[\\u0D00-\\u0D7F]/.test(text)) return 'ml-IN';
    if (/[\\u0A00-\\u0A7F]/.test(text)) return 'pa-IN';
    if (/[\\u0B00-\\u0B7F]/.test(text)) return 'or-IN';
    if (/[\\u0900-\\u097F]/.test(text)) return 'hi-IN'; // Devanagari fallback
    
    return 'en-IN'; // Ultimate fallback
  }
  
  // Ensure minimum confidence threshold
  if (topLanguage[1] >= 1.5 || topLanguage[1] > secondLanguage[1] * 1.5) {
    return topLanguage[0] as LanguageCode;
  }
  
  // If confidence is low, default to English for safety
  return 'en-IN';
}

type RecognitionHandlers = {
  onResult: (text: string, detectedLang?: LanguageCode) => void;
  onEnd?: () => void;
  onError?: (err: Error) => void;
};

export function startRecognition(lang: LanguageCode, handlers: RecognitionHandlers) {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    handlers.onError?.(new Error('Speech recognition not supported in this browser.'));
    return () => {};
  }

  const recognition = new SpeechRecognition();
  
  // For auto-detect, try multiple approaches
  if (lang === 'auto') {
    // Start with English as it has broader recognition support
    recognition.lang = 'en-IN';
    // Also try to set multiple languages if supported
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 5; // Get more alternatives for better detection
  } else {
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
  }

  let finalTranscript = '';
  let isProcessing = false;
  let hasReceivedFinalResult = false;

  recognition.onresult = (event: any) => {
    if (isProcessing) return;
    
    let interimTranscript = '';
    let confidenceSum = 0;
    let confidenceCount = 0;
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence || 0.5;
      
      if (result.isFinal) {
        finalTranscript += transcript;
        hasReceivedFinalResult = true;
        confidenceSum += confidence;
        confidenceCount++;
      } else {
        interimTranscript += transcript;
      }
    }
    
    const fullText = (finalTranscript + interimTranscript).trim();
    
    // Process when we have a final result and reasonable confidence
    if (fullText && hasReceivedFinalResult && !isProcessing) {
      isProcessing = true;
      
      let detectedLang: LanguageCode | undefined;
      let finalText = fullText;
      
      if (lang === 'auto') {
        // Advanced detection for auto mode
        detectedLang = detectLanguage(fullText);
        
        // If detected language is different and we have low confidence, try re-recognition
        const avgConfidence = confidenceCount > 0 ? confidenceSum / confidenceCount : 0;
        if (avgConfidence < 0.7 && detectedLang !== 'en-IN') {
          console.log(`Low confidence (${avgConfidence.toFixed(2)}), detected: ${detectedLang}`);
          
          // For low confidence non-English detection, try again with detected language
          const secondRecognition = new SpeechRecognition();
          secondRecognition.lang = detectedLang;
          secondRecognition.continuous = false;
          secondRecognition.interimResults = false;
          secondRecognition.maxAlternatives = 1;
          
          let secondTryCompleted = false;
          const timeoutId = setTimeout(() => {
            if (!secondTryCompleted) {
              secondTryCompleted = true;
              secondRecognition.stop();
              // Use original result if second try times out
              handlers.onResult(finalText, detectedLang);
            }
          }, 3000);
          
          secondRecognition.onresult = (secondEvent: any) => {
            if (secondTryCompleted) return;
            secondTryCompleted = true;
            clearTimeout(timeoutId);
            
            const secondTranscript = secondEvent.results[0][0].transcript.trim();
            const secondConfidence = secondEvent.results[0][0].confidence || 0.5;
            
            if (secondConfidence > avgConfidence && secondTranscript.length > 0) {
              console.log(`Improved result with ${detectedLang}: "${secondTranscript}" (confidence: ${secondConfidence.toFixed(2)})`);
              handlers.onResult(secondTranscript, detectedLang);
            } else {
              // Use original if second try wasn't better
              handlers.onResult(finalText, detectedLang);
            }
          };
          
          secondRecognition.onerror = () => {
            if (!secondTryCompleted) {
              secondTryCompleted = true;
              clearTimeout(timeoutId);
              handlers.onResult(finalText, detectedLang);
            }
          };
          
          try {
            secondRecognition.start();
          } catch (e) {
            clearTimeout(timeoutId);
            handlers.onResult(finalText, detectedLang);
          }
          return;
        }
        
        console.log(`Auto-detected language: ${detectedLang} (confidence: ${avgConfidence.toFixed(2)})`);
      }
      
      handlers.onResult(finalText, detectedLang);
    }
  };

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    if (event.error === 'no-speech') {
      handlers.onError?.(new Error('No speech detected. Please speak clearly and try again.'));
    } else if (event.error === 'audio-capture') {
      handlers.onError?.(new Error('No microphone detected. Please check your microphone connection.'));
    } else if (event.error === 'not-allowed') {
      handlers.onError?.(new Error('Microphone access denied. Please allow microphone permissions and try again.'));
    } else if (event.error === 'network') {
      handlers.onError?.(new Error('Network error. Please check your internet connection.'));
    } else if (event.error === 'service-not-allowed') {
      handlers.onError?.(new Error('Speech recognition service not available. Please try again later.'));
    } else {
      handlers.onError?.(new Error(`Speech recognition error: ${event.error}. Please try again.`));
    }
  };
  
  recognition.onend = () => {
    handlers.onEnd?.();
  };

  // Handle start event for better error handling
  recognition.onstart = () => {
    console.log(`Speech recognition started with language: ${recognition.lang}`);
  };

  try {
    recognition.start();
  } catch (error) {
    console.error('Failed to start recognition:', error);
    handlers.onError?.(new Error('Failed to start speech recognition. Please try again.'));
  }

  return () => {
    try {
      recognition.stop();
      recognition.abort();
    } catch (e) {
      console.warn('Error stopping recognition:', e);
    }
  };
}

export function speak(text: string, lang: LanguageCode) {
  return new Promise<void>((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 1;
    utter.pitch = 1;

    const pickVoice = () => {
      const voices = synth.getVoices();
      const base = lang.split('-')[0];
      const exact = voices.find((v) => v.lang === lang);
      const similar = voices.find((v) => v.lang?.startsWith(base));
      utter.voice = exact || similar || voices[0] || null;
    };

    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = () => {
        pickVoice();
        synth.speak(utter);
      };
    } else {
      pickVoice();
      synth.speak(utter);
    }

    utter.onend = () => resolve();
    utter.onerror = () => reject(new Error('Speech synthesis error'));
  });
}

export async function postQuery(text: string, lang: LanguageCode): Promise<string> {
  // Use the new AI-powered query endpoint with fallback to mock responses
  try {
    // Try the AI endpoint first
    const res = await fetch('/api/ai/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: text, language: lang }),
    });
    
    if (res.ok) {
      const data = await res.json();
      return data.response || 'I understand your query. Let me help you with agricultural guidance.';
    }
    
    // Fallback to original query endpoint
    const fallbackRes = await fetch('/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: text, lang }),
    });
    
    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      return (data?.reply as string) || 'Okay';
    }
    
    throw new Error('Both endpoints unavailable');
  } catch (error) {
    console.warn('Backend unavailable, using fallback responses:', error);
    
    // Enhanced mock responses with agricultural intelligence per language
    return getIntelligentResponse(text, lang);
  }
}

// Helper function to provide intelligent agricultural responses based on query content
function getIntelligentResponse(query: string, lang: LanguageCode): string {
  const lowerQuery = query.toLowerCase();
  
  // Check for common agricultural topics
  if (lowerQuery.includes('weather') || lowerQuery.includes('मौसम') || lowerQuery.includes('காலநிலை')) {
    return getWeatherResponse(lang);
  } else if (lowerQuery.includes('soil') || lowerQuery.includes('मिट्टी') || lowerQuery.includes('மண்')) {
    return getSoilResponse(lang);
  } else if (lowerQuery.includes('crop') || lowerQuery.includes('फसल') || lowerQuery.includes('பயிர்')) {
    return getCropResponse(lang);
  } else if (lowerQuery.includes('price') || lowerQuery.includes('दाम') || lowerQuery.includes('விலை')) {
    return getPriceResponse(lang);
  } else if (lowerQuery.includes('disease') || lowerQuery.includes('बीमारी') || lowerQuery.includes('நோய்')) {
    return getDiseaseResponse(lang);
  } else {
    return getGeneralResponse(query, lang);
  }
}

function getWeatherResponse(lang: LanguageCode): string {
  const responses: Record<LanguageCode, string> = {
    'auto': 'Today\'s weather is suitable for farming. Expect partly cloudy skies with 25-30°C temperature. Good for irrigation and field work.',
    'hi-IN': 'आज का मौसम खेती के लिए अनुकूल है। 25-30°C तापमान के साथ आंशिक बादल। सिंचाई और खेत के काम के लिए अच्छा।',
    'ta-IN': 'இன்றைய காலநிலை விவசாயத்திற்கு ஏற்றது. 25-30°C வெப்பநிலையுடன் மேகமூட்டம். நீர்ப்பாசனம் மற்றும் வயல் வேலைகளுக்கு நல்லது.',
    'te-IN': 'నేటి వాతావరణం వ్యవసాయానికి అనుకూలం. 25-30°C ఉష్ణోగ్రతతో పాక్షిక మేఘాలు. నీటిపారుదల మరియు పొల పనులకు మంచిది.',
    'en-IN': 'Today\'s weather is suitable for farming. Expect partly cloudy skies with 25-30°C temperature. Good for irrigation and field work.',
    'bn-IN': 'আজকের আবহাওয়া কৃষিকাজের জন্য উপযুক্ত। ২৫-৩০°সে তাপমাত্রায় আংশিক মেঘাচ্ছন্ন। সেচ ও ক্ষেতের কাজের জন্য ভালো।',
    'gu-IN': 'આજનું હવામાન ખેતી માટે અનુકૂળ છે. ૨૫-૩૦°સે તાપમાન સાથે આંશિક વાદળછાયું. સિંચાઈ અને ખેતરના કામ માટે સારું.',
    'kn-IN': 'ಇಂದಿನ ಹವಾಮಾನ ಕೃಷಿಗೆ ಅನುಕೂಲ. ೨೫-೩೦°ಸೆ ಉಷ್ಣತೆಯೊಂದಿಗೆ ಆಂಶಿಕ ಮೇಘ. ನೀರಾವರಿ ಮತ್ತು ಹೊಲದ ಕೆಲಸಕ್ಕೆ ಒಳ್ಳೆಯದು.',
    'ml-IN': 'ഇന്നത്തെ കാലാവസ്ഥ കൃഷിക്ക് അനുകൂലം. 25-30°C താപനിലയിൽ ഭാഗിക മേഘാവൃതം. ജലസേചനത്തിനും വയൽ ജോലികൾക്കും നല്ലത്.',
    'mr-IN': 'आजचे हवामान शेतीसाठी अनुकूल आहे. २५-३०°से तापमानासह अंशतः ढगाळ. सिंचन आणि शेतातील कामासाठी चांगले.',
    'pa-IN': 'ਅੱਜ ਦਾ ਮੌਸਮ ਖੇਤੀ ਲਈ ਅਨੁਕੂਲ ਹੈ। ੨੫-੩੦°ਸੈ ਤਾਪਮਾਨ ਦੇ ਨਾਲ ਅੰਸ਼ਿਕ ਬੱਦਲ। ਸਿੰਚਾਈ ਅਤੇ ਖੇਤ ਦੇ ਕੰਮ ਲਈ ਚੰਗਾ।',
    'or-IN': 'ଆଜିର ପାଗ କୃଷି ପାଇଁ ଉପଯୁକ୍ତ। ୨୫-୩୦°ସେ ତାପମାତ୍ରା ସହ ଆଂଶିକ ମେଘ। ସେଚନ ଓ କ୍ଷେତ କାମ ପାଇଁ ଭଲ।',
    'as-IN': 'আজিৰ বতৰ কৃষিৰ বাবে উপযুক্ত। ২৫-৩০°চে তাপমাত্ৰাৰ সৈতে আংশিক মেঘ। জলসিঞ্চন আৰু পথাৰৰ কামৰ বাবে ভাল।',
  };
  return responses[lang] || responses['en-IN'];
}

function getSoilResponse(lang: LanguageCode): string {
  const responses: Record<LanguageCode, string> = {
    'auto': 'Your soil appears to have good organic content. For better yields, consider adding compost and checking pH levels. Ideal pH for most crops is 6.0-7.5.',
    'hi-IN': 'आपकी मिट्टी में अच्छी जैविक सामग्री है। बेहतर उत्पादन के लिए कम्पोस्ट डालें और pH जांचें। अधिकतर फसलों के लिए 6.0-7.5 pH उपयुक्त है।',
    'ta-IN': 'உங்கள் மண்ணில் நல்ல இயற்கை சத்து உள்ளது. நல்ல விளைச்சலுக்கு கம்போஸ்ட் சேர்க்கவும் மற்றும் pH சரிபார்க்கவும். பெரும்பாலான பயிர்களுக்கு 6.0-7.5 pH ஏற்றது.',
    'te-IN': 'మీ మట్టిలో మంచి సేంద్రీయ పదార్థం ఉంది. మెరుగైన దిగుబడి కోసం కంపోస్ట్ జోడించి pH స్థాయిలను తనిఖీ చేయండి. చాలా పంటలకు 6.0-7.5 pH అనుకూలం.',
    'en-IN': 'Your soil appears to have good organic content. For better yields, consider adding compost and checking pH levels. Ideal pH for most crops is 6.0-7.5.',
    'bn-IN': 'আপনার মাটিতে ভালো জৈব উপাদান রয়েছে। ভালো ফলনের জন্য কম্পোস্ট যোগ করুন এবং pH মাত্রা পরীক্ষা করুন। অধিকাংশ ফসলের জন্য ৬.০-৭.৫ pH উপযুক্ত।',
    'gu-IN': 'તમારી માટીમાં સારી કાર્બનિક સામગ્રી છે. વધુ સારી ઉપજ માટે કમ્પોસ્ટ ઉમેરો અને pH સ્તર તપાસો. મોટાભાગના પાકો માટે ૬.૦-૭.૫ pH આદર્શ છે.',
    'kn-IN': 'ನಿಮ್ಮ ಮಣ್ಣಿನಲ್ಲಿ ಉತ್ತಮ ಸಾವಯವ ವಿಷಯ ಇದೆ. ಉತ್ತಮ ಇಳುವರಿಗಾಗಿ ಕಾಂಪೋಸ್ಟ್ ಸೇರಿಸಿ ಮತ್ತು pH ಮಟ್ಟವನ್ನು ಪರಿಶೀಲಿಸಿ. ಹೆಚ್ಚಿನ ಬೆಳೆಗಳಿಗೆ ೬.೦-೭.೫ pH ಸೂಕ್ತ.',
    'ml-IN': 'നിങ്ങളുടെ മണ്ണിൽ നല്ല ജൈവിക ഉള്ളടക്കം ഉണ്ട്. മെച്ചപ്പെട്ട വിളവിനായി കമ്പോസ്റ്റ് ചേർക്കുകയും pH നില പരിശോധിക്കുകയും ചെയ്യുക. മിക്ക വിളകൾക്കും 6.0-7.5 pH അനുയോജ്യം.',
    'mr-IN': 'तुमच्या मातीत चांगली सेंद्रिय सामग्री आहे. चांगल्या उत्पादनासाठी कंपोस्ट घाला आणि pH पातळी तपासा. बहुतेक पिकांसाठी ६.०-७.५ pH योग्य आहे.',
    'pa-IN': 'ਤੁਹਾਡੀ ਮਿੱਟੀ ਵਿੱਚ ਚੰਗੀ ਜੈਵਿਕ ਸਮੱਗਰੀ ਹੈ। ਬਿਹਤਰ ਫਸਲ ਲਈ ਕੰਪੋਸਟ ਪਾਓ ਅਤੇ pH ਪੱਧਰ ਚੈੱਕ ਕਰੋ। ਜ਼ਿਆਦਾਤਰ ਫਸਲਾਂ ਲਈ ੬.੦-੭.੫ pH ਢੁਕਵਾਂ ਹੈ।',
    'or-IN': 'ଆପଣଙ୍କ ମାଟିରେ ଭଲ ଜୈବିକ ପଦାର୍ଥ ଅଛି। ଭଲ ଅମଳ ପାଇଁ କମ୍ପୋଷ୍ଟ ମିଶାନ୍ତୁ ଏବଂ pH ସ୍ତର ଯାଞ୍ଚ କରନ୍ତୁ। ଅଧିକାଂଶ ଫସଲ ପାଇଁ ୬.୦-୭.୫ pH ଉପଯୁକ୍ତ।',
    'as-IN': 'আপোনাৰ মাটিত ভাল জৈৱিক উপাদান আছে। ভাল শস্যৰ বাবে কম্পোষ্ট দিয়ক আৰু pH মাত্ৰা পৰীক্ষা কৰক। বেছিভাগ শস্যৰ বাবে ৬.০-৭.৫ pH উপযুক্ত।',
  };
  return responses[lang] || responses['en-IN'];
}

function getCropResponse(lang: LanguageCode): string {
  const responses: Record<LanguageCode, string> = {
    'auto': 'For this season, consider rice, wheat, or maize depending on your region. Ensure proper seed spacing and timely irrigation for optimal growth.',
    'hi-IN': 'इस मौसम के लिए अपने क्षेत्र के अनुसार धान, गेहूं या मक्का की खेती करें। उचित बीज की दूरी और समय पर सिंचाई सुनिश्चित करें।',
    'ta-IN': 'இந்த பருவத்திற்கு உங்கள் பகுதிக்கு ஏற்ப அரிசி, கோதுமை அல்லது சோளம் பயிரிடுங்கள். சரியான விதை இடைவெளி மற்றும் சரியான நேரத்தில் நீர்ப்பாசனம் செய்யுங்கள்.',
    'te-IN': 'ఈ సీజన్‌కు మీ ప్రాంతానికి అనుగుణంగా వరి, గోధుమలు లేదా మొక్కజొన్న పండించండి. సరైన విత్తన అంతరం మరియు సమయానుకూల నీటిపారుదల నిర్ధారించండి.',
    'en-IN': 'For this season, consider rice, wheat, or maize depending on your region. Ensure proper seed spacing and timely irrigation for optimal growth.',
    'bn-IN': 'এই মৌসুমে আপনার অঞ্চল অনুযায়ী ধান, গম বা ভুট্টা চাষ করুন। উত্তম বৃদ্ধির জন্য সঠিক বীজের দূরত্ব এবং সময়মতো সেচ নিশ্চিত করুন।',
    'gu-IN': 'આ મોસમ માટે તમારા પ્રદેશ મુજબ ચોખા, ઘઉં અથવા મકાઈની ખેતી કરો. સર્વોત્તમ વૃદ્ધિ માટે યોગ્ય બીજની અંતર અને સમયસર સિંચાઈ કરો.',
    'kn-IN': 'ಈ ಋತುವಿಗೆ ನಿಮ್ಮ ಪ್ರದೇಶದ ಪ್ರಕಾರ ಅಕ್ಕಿ, ಗೋಧಿ ಅಥವಾ ಜೋಳದ ಕೃಷಿ ಮಾಡಿ. ಅತ್ಯುತ್ತಮ ಬೆಳವಣಿಗೆಗಾಗಿ ಸರಿಯಾದ ಬೀಜದ ಅಂತರ ಮತ್ತು ಸಮಯೋಚಿತ ನೀರಾವರಿ ಖಚಿತಪಡಿಸಿ.',
    'ml-IN': 'ഈ സീസണിൽ നിങ്ങളുടെ പ്രദേശമനുസരിച്ച് നെല്ല്, ഗോതമ്പ് അല്ലെങ്കിൽ ചോളം കൃഷി ചെയ്യുക. മികച്ച വളർച്ചയ്ക്കായി ശരിയായ വിത്ത് അകലവും സമയോചിതമായ ജലസേചനും ഉറപ്പാക്കുക.',
    'mr-IN': 'या हंगामासाठी तुमच्या प्रदेशानुसार तांदूळ, गहू किंवा मका पिकवा. इष्टतम वाढीसाठी योग्य बियाणे अंतर आणि वेळेवर पाणी देणे सुनिश्चित करा.',
    'pa-IN': 'ਇਸ ਸੀਜ਼ਨ ਲਈ ਆਪਣੇ ਖੇਤਰ ਅਨੁਸਾਰ ਚਾਵਲ, ਕਣਕ ਜਾਂ ਮੱਕੀ ਦੀ ਖੇਤੀ ਕਰੋ। ਵਧੀਆ ਵਿਕਾਸ ਲਈ ਸਹੀ ਬੀਜ ਦੀ ਦੂਰੀ ਅਤੇ ਸਮੇਂ ਸਿਰ ਸਿੰਚਾਈ ਯਕੀਨੀ ਬਣਾਓ।',
    'or-IN': 'ଏହି ମୌସୁମ ପାଇଁ ଆପଣଙ୍କ ଅଞ୍ଚଳ ଅନୁଯାୟୀ ଚାଉଳ, ଗହମ କିମ୍ବା ମକା ଚାଷ କରନ୍ତୁ। ସର୍ବୋତ୍କୃଷ୍ଟ ବୃଦ୍ଧି ପାଇଁ ଉଚିତ ବିହନ ବ୍ୟବଧାନ ଏବଂ ସମୟାନୁକୂଳ ଜଳସେଚନ ନିଶ୍ଚିତ କରନ୍ତୁ।',
    'as-IN': 'এই ঋতুৰ বাবে আপোনাৰ অঞ্চল অনুযায়ী চাউল, ঘেঁহু বা মৰাপাটৰ খেতি কৰক। সৰ্বোত্তম বৃদ্ধিৰ বাবে সঠিক বীজৰ দূৰত্ব আৰু সময়মতে জলসিঞ্চন নিশ্চিত কৰক।',
  };
  return responses[lang] || responses['en-IN'];
}

function getPriceResponse(lang: LanguageCode): string {
  const responses: Record<LanguageCode, string> = {
    'auto': 'Current market prices: Rice ₹25-30/kg, Wheat ₹22-25/kg, Tomato ₹40-50/kg. Prices may vary by location. Check local mandis for exact rates.',
    'hi-IN': 'वर्तमान बाजार भाव: चावल ₹25-30/किग्रा, गेहूं ₹22-25/किग्रा, टमाटर ₹40-50/किग्रा। कीमतें स्थान के अनुसार अलग हो सकती हैं। सटीक दरों के लिए स्थानीय मंडी देखें।',
    'ta-IN': 'தற்போதைய சந்தை விலைகள்: அரிசி ₹25-30/கிலோ, கோதுமை ₹22-25/கிலோ, தக்காளி ₹40-50/கிலோ. விலைகள் இடத்தைப் பொறுத்து மாறுபடும். சரியான விலைக்கு உள்ளூர் சந்தைகளைப் பார்க்கவும்.',
    'te-IN': 'ప్రస్తుత మార్కెట్ ధరలు: బియ్యం ₹25-30/కిలో, గోధుమలు ₹22-25/కిలో, టొమాటో ₹40-50/కిలో. ధరలు ప్రాంతాన్ని బట్టి మారవచ్చు. ఖచ్చితమైన రేట్లకు స్థానిక మార్కెట్లను చూడండి.',
    'en-IN': 'Current market prices: Rice ₹25-30/kg, Wheat ₹22-25/kg, Tomato ₹40-50/kg. Prices may vary by location. Check local mandis for exact rates.',
    'bn-IN': 'বর্তমান বাজারের দাম: চাল ₹২৫-৩০/কেজি, গম ₹২২-২৫/কেজি, টমেটো ₹৪০-৫০/কেজি। স্থান ভেদে দাম ভিন্ন হতে পারে। সঠিক দামের জন্য স্থানীয় মান্ডি দেখুন।',
    'gu-IN': 'વર્તમાન બજાર ભાવ: ચોખા ₹25-30/કિગ્રા, ઘઉં ₹22-25/કિગ્રા, ટમેટા ₹40-50/કિગ્રા. કિંમતો સ્થાન પ્રમાણે અલગ પડી શકે છે. ચોક્કસ ભાવ માટે સ્થાનિક મંડી જુઓ.',
    'kn-IN': 'ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು: ಅಕ್ಕಿ ₹25-30/ಕಿಲೋ, ಗೋಧಿ ₹22-25/ಕಿಲೋ, ಟೊಮೇಟೊ ₹40-50/ಕಿಲೋ. ಬೆಲೆಗಳು ಸ್ಥಳದ ಪ್ರಕಾರ ಬದಲಾಗಬಹುದು. ನಿಖರವಾದ ದರಗಳಿಗೆ ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    'ml-IN': 'നിലവിലെ വിപണി വിലകൾ: അരി ₹25-30/കിലോ, ഗോതമ്പ് ₹22-25/കിലോ, തക്കാളി ₹40-50/കിലോ. വിലകൾ സ്ഥലം അനുസരിച്ച് മാറാം. കൃത്യമായ നിരക്കുകൾക്ക് പ്രാദേശിക മാർക്കറ്റുകൾ പരിശോധിക്കുക.',
    'mr-IN': 'सध्याचे बाजार भाव: तांदूळ ₹२५-३०/किलो, गहू ₹२२-२५/किलो, टोमॅटो ₹४०-५०/किलो. किंमती ठिकाणानुसार वेगवेगळ्या असू शकतात. अचूक दरांसाठी स्थानिक मंडी पहा.',
    'pa-IN': 'ਮੌਜੂਦਾ ਮਾਰਕਿਟ ਰੇਟ: ਚਾਵਲ ₹25-30/ਕਿਲੋ, ਕਣਕ ₹22-25/ਕਿਲੋ, ਟਮਾਟਰ ₹40-50/ਕਿਲੋ. ਕੀਮਤਾਂ ਸਥਾਨ ਅਨੁਸਾਰ ਵੱਖ ਹੋ ਸਕਦੀਆਂ ਹਨ। ਸਹੀ ਰੇਟਾਂ ਲਈ ਸਥਾਨਕ ਮੰਡੀਆਂ ਵੇਖੋ।',
    'or-IN': 'ବର୍ତ୍ତମାନର ବଜାର ଦର: ଚାଉଳ ₹୨୫-୩୦/କିଲୋ, ଗହମ ₹୨୨-୨୫/କିଲୋ, ଟମାଟୋ ₹୪୦-୫୦/କିଲୋ। ଦାମ ସ୍ଥାନ ଅନୁଯାୟୀ ଭିନ୍ନ ହୋଇପାରେ। ସଠିକ ଦରରେ ସ୍ଥାନୀୟ ମଣ୍ଡି ଦେଖନ୍ତୁ।',
    'as-IN': 'বৰ্তমানৰ বজাৰৰ দাম: চাউল ₹২৫-৩০/কিলো, ঘেঁহু ₹২২-২৫/কিলো, বিলাহী ₹৪০-৫০/কিলো। দাম স্থান অনুযায়ী ভিন্ন হব পাৰে। সঠিক দামৰ বাবে স্থানীয় বজাৰ চাওক।',
  };
  return responses[lang] || responses['en-IN'];
}

function getDiseaseResponse(lang: LanguageCode): string {
  const responses: Record<LanguageCode, string> = {
    'auto': 'Common crop diseases this season include leaf blight and stem rot. Use organic neem oil spray and ensure proper drainage. Consult local agricultural officer for specific treatments.',
    'hi-IN': 'इस मौसम में आम फसल रोगों में पत्ती झुलसा और तना गलन शामिल हैं। जैविक नीम तेल का छिड़काव करें और उचित जल निकासी सुनिश्चित करें। विशिष्ट उपचार के लिए स्थानीय कृषि अधिकारी से सलाह लें।',
    'ta-IN': 'இந்த பருவத்தில் பொதுவான பயிர் நோய்கள் இலை உலர்வு மற்றும் தண்டு அழுகல். இயற்கை வேப்ப எண்ணெய் தெளிப்பு பயன்படுத்தி சரியான வடிகால் உறுதி செய்யுங்கள். குறிப்பிட்ட சிகிச்சைக்கு உள்ளூர் வேளாண் அதிகாரியை அணுகவும்.',
    'te-IN': 'ఈ సీజన్‌లో సాధారణ పంట వ్యాధులలో ఆకు వాడిపోవడం మరియు కాండం కుళ్ళిపోవడం ఉన్నాయి. సేంద్రీయ వేప నూనె స్ప్రే వాడండి మరియు సరైన నీటి వినియోగం నిర్ధారించండి. నిర్దిష్ట చికిత్సల కోసం స్థానిక వ్యవసాయ అధికారిని సంప్రదించండి.',
    'en-IN': 'Common crop diseases this season include leaf blight and stem rot. Use organic neem oil spray and ensure proper drainage. Consult local agricultural officer for specific treatments.',
    'bn-IN': 'এই মৌসুমে সাধারণ ফসলের রোগে পাতা ঝলসানো এবং কাণ্ড পচা রয়েছে। জৈব নিম তেল স্প্রে ব্যবহার করুন এবং সঠিক নিকাশ নিশ্চিত করুন। নির্দিষ্ট চিকিৎসার জন্য স্থানীয় কৃষি কর্মকর্তার সাথে পরামর্শ করুন।',
    'gu-IN': 'આ મોસમમાં સામાન્ય પાક રોગોમાં પાંદડાની બ્લાઇટ અને સ્ટેમ રોટ શામેલ છે. કાર્બનિક નીમ તેલનો છંટકાવ કરો અને યોગ્ય ડ્રેનેજ સુનિશ્ચિત કરો. ચોક્કસ સારવાર માટે સ્થાનિક કૃષિ અધિકારીની સલાહ લો.',
    'kn-IN': 'ಈ ಋತುವಿನಲ್ಲಿ ಸಾಮಾನ್ಯ ಬೆಳೆ ರೋಗಗಳಲ್ಲಿ ಎಲೆ ಬ್ಲೈಟ್ ಮತ್ತು ಕಾಂಡ ಕೊಳೆತ ಸೇರಿದೆ. ಸಾವಯವ ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ ಮತ್ತು ಸರಿಯಾದ ಒಳಚರಂಡಿ ಖಚಿತಪಡಿಸಿ. ನಿರ್ದಿಷ್ಟ ಚಿಕಿತ್ಸೆಗಳಿಗಾಗಿ ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    'ml-IN': 'ഈ സീസണിലെ പൊതുവായ വിള രോഗങ്ങളിൽ ഇല പൊള്ളലും തണ്ട് ചീത്തയും ഉൾപ്പെടുന്നു. ജൈവ വേപ്പെണ്ണ സ്പ്രേ ഉപയോഗിക്കുകയും ശരിയായ ഡ്രെയിനേജ് ഉറപ്പാക്കുകയും ചെയ്യുക. നിർദ്ദിഷ്ട ചികിത്സകൾക്കായി പ്രാദേശിക കൃഷി ഉദ്യോഗസ്ഥനെ സമീപിക്കുക.',
    'mr-IN': 'या हंगामात सामान्य पीक रोगांमध्ये पानांचा ब्लाइट आणि खोड कुजणे समाविष्ट आहे. सेंद्रिय कडुनिंबाच्या तेलाची फवारणी करा आणि योग्य ड्रेनेज सुनिश्चित करा. विशिष्ट उपचारांसाठी स्थानिक कृषी अधिकाऱ्याचा सल्ला घ्या.',
    'pa-IN': 'ਇਸ ਸੀਜ਼ਨ ਵਿੱਚ ਆਮ ਫਸਲ ਰੋਗਾਂ ਵਿੱਚ ਪੱਤਾ ਝੁਲਸਾ ਅਤੇ ਤਣਾ ਸੜਨ ਸ਼ਾਮਲ ਹਨ। ਜੈਵਿਕ ਨਿੰਮ ਤੇਲ ਦਾ ਛਿੜਕਾਅ ਕਰੋ ਅਤੇ ਸਹੀ ਨਿਕਾਸ ਯਕੀਨੀ ਬਣਾਓ। ਖਾਸ ਇਲਾਜ ਲਈ ਸਥਾਨਕ ਖੇਤੀ ਅਫਸਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।',
    'or-IN': 'ଏହି ମୌସୁମରେ ସାଧାରଣ ଫସଲ ରୋଗରେ ପତ୍ର ବ୍ଲାଇଟ ଏବଂ ଗଣ୍ଡି ପଚା ଅଛି। ଜୈବିକ ନିମ ତେଲ ସ୍ପ୍ରେ ବ୍ୟବହାର କରନ୍ତୁ ଏବଂ ଉଚିତ ଜଳ ନିଷ୍କାସନ ନିଶ୍ଚିତ କରନ୍ତୁ। ନିର୍ଦ୍ଦିଷ୍ଟ ଚିକିତ୍ସା ପାଇଁ ସ୍ଥାନୀୟ କୃଷି ଅଧିକାରୀଙ୍କ ସହ ପରାମର୍ଶ କରନ୍ତୁ।',
    'as-IN': 'এই ঋতুত সাধাৰণ শস্যৰ ৰোগত পাত জ্বলা আৰু কাণ্ড পচা আছে। জৈৱিক নিমতেল স্প্ৰে ব্যৱহাৰ কৰক আৰু উচিত নিষ্কাশন নিশ্চিত কৰক। নিৰ্দিষ্ট চিকিৎসাৰ বাবে স্থানীয় কৃষি বিষয়াৰ পৰামৰ্শ লওক।',
  };
  return responses[lang] || responses['en-IN'];
}

function getGeneralResponse(query: string, lang: LanguageCode): string {
  const responses: Record<LanguageCode, string> = {
    'auto': `I understand your query: "${query}". I'm here to help with agricultural guidance including crop advice, weather information, soil management, and market prices. How can I assist you further?`,
    'hi-IN': `मैं आपका प्रश्न समझता हूं: "${query}"। मैं फसल सलाह, मौसम जानकारी, मिट्टी प्रबंधन और बाजार भाव सहित कृषि मार्गदर्शन में सहायता के लिए यहां हूं। मैं आपकी और कैसे सहायता कर सकता हूं?`,
    'ta-IN': `நான் உங்கள் கேள்வியை புரிந்துகொண்டேன்: "${query}". பயிர் ஆலோசனை, வானிலை தகவல், மண் நிர்வாகம் மற்றும் சந்தை விலைகள் உட்பட விவசாய வழிகாட்டுதலில் உதவ நான் இங்கே இருக்கிறேன். நான் உங்களுக்கு எப்படி மேலும் உதவ முடியும்?`,
    'te-IN': `నేను మీ ప్రశ్నను అర్థం చేసుకున్నాను: "${query}". పంట సలహాలు, వాతావరణ సమాచారం, మట్టి నిర్వహణ మరియు మార్కెట్ ధరలతో సహా వ్యవసాయ మార్గదర్శనంలో సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. నేను మీకు ఇంకా ఎలా సహాయం చేయగలను?`,
    'en-IN': `I understand your query: "${query}". I'm here to help with agricultural guidance including crop advice, weather information, soil management, and market prices. How can I assist you further?`,
    'bn-IN': `আমি আপনার প্রশ্ন বুঝতে পেরেছি: "${query}"। আমি ফসলের পরামর্শ, আবহাওয়ার তথ্য, মাটি ব্যবস্থাপনা এবং বাজারের দাম সহ কৃষি নির্দেশনায় সাহায্য করতে এখানে আছি। আমি আপনাকে আরও কীভাবে সাহায্য করতে পারি?`,
    'gu-IN': `હું તમારો પ્રશ્ન સમજી ગયો: "${query}"। હું પાક સલાહ, હવામાન માહિતી, માટી વ્યવસ્થાપન અને બજાર ભાવ સહિત કૃષિ માર્ગદર્શનમાં મદદ કરવા માટે અહીં છું. હું તમને વધુ કેવી રીતે સહાય કરી શકું?`,
    'kn-IN': `ನಾನು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ: "${query}". ಬೆಳೆ ಸಲಹೆ, ಹವಾಮಾನ ಮಾಹಿತಿ, ಮಣ್ಣಿನ ನಿರ್ವಹಣೆ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು ಒಳಗೊಂಡಂತೆ ಕೃಷಿ ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ ಸಹಾಯ ಮಾಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. ನಾನು ನಿಮಗೆ ಇನ್ನೂ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?`,
    'ml-IN': `ഞാൻ നിങ്ങളുടെ ചോദ്യം മനസ്സിലാക്കി: "${query}". വിള ഉപദേശം, കാലാവസ്ഥാ വിവരങ്ങൾ, മണ്ണ് പരിപാലനം, വിപണി വിലകൾ എന്നിവയുൾപ്പെടെ കാർഷിക മാർഗ്ഗനിർദ്ദേശത്തിൽ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്. ഞാൻ നിങ്ങളെ എങ്ങനെ കൂടുതൽ സഹായിക്കാം?`,
    'mr-IN': `मी तुमचा प्रश्न समजून घेतला: "${query}"। मी पीक सल्ला, हवामान माहिती, माती व्यवस्थापन आणि बाजार भावांसह शेतकी मार्गदर्शनात मदत करण्यासाठी येथे आहे. मी तुम्हाला आणखी कशी मदत करू शकतो?`,
    'pa-IN': `ਮੈਂ ਤੁਹਾਡਾ ਸਵਾਲ ਸਮਝ ਗਿਆ: "${query}"। ਮੈਂ ਫਸਲ ਸਲਾਹ, ਮੌਸਮ ਜਾਣਕਾਰੀ, ਮਿੱਟੀ ਪ੍ਰਬੰਧਨ ਅਤੇ ਮਾਰਕਿਟ ਰੇਟਾਂ ਸਮੇਤ ਖੇਤੀ ਮਾਰਗਦਰਸ਼ਨ ਵਿੱਚ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ਹੋਰ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?`,
    'or-IN': `ମୁଁ ଆପଣଙ୍କ ପ୍ରଶ୍ନ ବୁଝିଲି: "${query}"। ମୁଁ ଫସଲ ପରାମର୍ଶ, ପାଗ ସୂଚନା, ମାଟି ପରିଚାଳନା ଏବଂ ବଜାର ମୂଲ୍ୟ ସହିତ କୃଷି ମାର୍ଗଦର୍ଶନରେ ସାହାଯ୍ୟ କରିବାକୁ ଏଠାରେ ଅଛି। ମୁଁ ଆପଣଙ୍କୁ ଆଉ କେମିତି ସାହାଯ୍ୟ କରିପାରିବି?`,
    'as-IN': `মই আপোনাৰ প্ৰশ্ন বুজি পালোঁ: "${query}"। মই শস্যৰ পৰামৰ্শ, বতৰৰ তথ্য, মাটি পৰিচালনা আৰু বজাৰৰ দামৰ সৈতে কৃষি নিৰ্দেশনাত সহায় কৰিবলৈ ইয়াত আছোঁ। মই আপোনাক আৰু কেনেকৈ সহায় কৰিব পাৰোঁ?`,
  };
  return responses[lang] || responses['en-IN'];
}

/*
  Google Cloud Integration Notes:
  - Speech-to-Text: Send recorded audio (FLAC/LINEAR16) to Cloud STT with the selected
    languageCode (hi-IN, ta-IN, te-IN, en-IN). Perform this on a secure backend and
    return the recognized text to the client.

  - Text-to-Speech: Request Cloud TTS with matching languageCode and a suitable voice,
    return an audio URL or stream to the client to play. Alternatively, stream via
    a service worker for smoother playback. Keep credentials on the server only.
*/
