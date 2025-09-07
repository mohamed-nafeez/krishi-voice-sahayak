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
  // Placeholder backend integration. This POSTs to /query and falls back to a mock
  // response if the endpoint is unavailable. Replace the fetch below with your
  // actual backend URL.
  try {
    const res = await fetch('/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: text, lang }),
    });
    if (res.ok) {
      const data = await res.json();
      return (data?.reply as string) || 'Okay';
    }
    throw new Error('Bad response');
  } catch {
    // Mock responses per language (fallback only)
    const defaults: Record<LanguageCode, string> = {
      'auto': 'I heard: ' + text + '. Soon I will provide soil, weather and market price information.',
      'hi-IN': 'मैंने सुना: ' + text + '। जल्द ही मैं मिट्टी, मौसम और मंडी भाव की जानकारी दूंगा।',
      'ta-IN': 'நான் கேட்டது: ' + text + '. விரைவில் மண், காலநிலை, சந்தை விலை தகவல்கள் தருகிறேன்.',
      'te-IN': 'నేను విన్నది: ' + text + '. త్వరలో నేల, వాతావరణం, మార్కెట్ ధరల సమాచారం ఇస్తాను.',
      'en-IN': 'You said: ' + text + '. Soon I will share soil, weather and market price information.',
      'bn-IN': 'আমি শুনেছি: ' + text + '। শীঘ্রই আমি মাটি, আবহাওয়া এবং বাজারের দামের তথ্য দেব।',
      'gu-IN': 'મેં સાંભળ્યું: ' + text + '। ટૂંક સમયમાં હું માટી, હવામાન અને બજાર ભાવની માહિતી આપીશ।',
      'kn-IN': 'ನಾನು ಕೇಳಿದೆ: ' + text + '. ಶೀಘ್ರದಲ್ಲೇ ನಾನು ಮಣ್ಣು, ಹವಾಮಾನ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳ ಮಾಹಿತಿಯನ್ನು ಕೊಡುತ್ತೇನೆ.',
      'ml-IN': 'ഞാൻ കേട്ടത്: ' + text + '. ഉടൻ മണ്ണ്, കാലാവസ്ഥ, വിപണി വിലകളുടെ വിവരങ്ങൾ നൽകാം.',
      'mr-IN': 'मी ऐकले: ' + text + '। लवकरच मी माती, हवामान आणि बाजारभावाची माहिती देईन।',
      'pa-IN': 'ਮੈਂ ਸੁਣਿਆ: ' + text + '। ਜਲਦੀ ਹੀ ਮੈਂ ਮਿੱਟੀ, ਮੌਸਮ ਅਤੇ ਮਾਰਕੀਟ ਦੀਆਂ ਕੀਮਤਾਂ ਦੀ ਜਾਣਕਾਰੀ ਦੱਸਾਂਗਾ।',
      'or-IN': 'ମୁଁ ଶୁଣିଲି: ' + text + '। ଶୀଘ୍ର ମୁଁ ମାଟି, ପାଗ ଏବଂ ବଜାର ମୂଲ୍ୟର ସୂଚନା ଦେବି।',
      'as-IN': 'মই শুনিলোঁ: ' + text + '। অতি সোনকালে মই মাটি, বতৰ আৰু বজাৰৰ দামৰ তথ্য দিম।',
    };
    return defaults[lang] || defaults['en-IN'];
  }
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
