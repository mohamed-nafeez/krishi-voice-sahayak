export type LanguageCode = 'hi-IN' | 'ta-IN' | 'te-IN' | 'en-IN';

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'en-IN', label: 'English' },
];

type RecognitionHandlers = {
  onResult: (text: string) => void;
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
  recognition.lang = lang;
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = (event: any) => {
    const transcript = Array.from(event.results as SpeechRecognitionResultList)
      .map((r: any) => r[0]?.transcript)
      .join(' ')
      .trim();
    if (transcript) handlers.onResult(transcript);
  };

  recognition.onerror = () => {
    handlers.onError?.(new Error('Speech recognition error'));
  };
  recognition.onend = () => handlers.onEnd?.();

  recognition.start();

  return () => {
    try {
      recognition.stop();
      recognition.abort();
    } catch {}
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
      'hi-IN': 'मैंने सुना: ' + text + '। जल्द ही मैं मिट्टी, मौसम और मंडी भाव भी बताऊँगा।',
      'ta-IN': 'நான் கேட்டது: ' + text + '. விரைவில் மண், காலநிலை, சந்தை விலை தகவல்கள் வரும்.',
      'te-IN': 'నేను విన్నది: ' + text + '. త్వరలో నేల, వాతావరణం, మార్కెట్ ధరలు ఇస్తాను.',
      'en-IN': 'You said: ' + text + '. Soon I will share soil, weather and market price info.',
    };
    return defaults[lang];
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
