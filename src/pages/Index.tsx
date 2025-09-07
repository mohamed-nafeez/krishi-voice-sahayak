import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, MicOff, Sprout, CloudSun, Store } from "lucide-react";
import { LANGUAGES, LanguageCode, postQuery, speak, startRecognition } from "@/lib/speech";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type Message = { id: string; role: "user" | "assistant"; text: string; lang: LanguageCode };

const Index = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<LanguageCode | null>(null);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const stopRecognitionRef = useRef<() => void>(() => {});
  const chatRef = useRef<HTMLDivElement>(null);
  const micTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const handleMicToggle = () => {
    if (listening) {
      stopRecognitionRef.current?.();
      setListening(false);
      setIsAutoDetecting(false);
      if (micTimeoutRef.current) {
        clearTimeout(micTimeoutRef.current);
      }
      return;
    }

    setListening(true);
    setDetectedLanguage(null);
    setIsAutoDetecting(language === 'auto');
    
    // Auto-stop listening after 15 seconds to prevent endless sessions
    micTimeoutRef.current = setTimeout(() => {
      if (listening) {
        stopRecognitionRef.current?.();
        setListening(false);
        setIsAutoDetecting(false);
      }
    }, 15000);

    stopRecognitionRef.current = startRecognition(language, {
      onResult: async (text, autoDetectedLang) => {
        setListening(false);
        setIsAutoDetecting(false);
        if (micTimeoutRef.current) {
          clearTimeout(micTimeoutRef.current);
        }
        
        // Update language if auto-detected and different from current
        let responseLanguage = language;
        if (language === 'auto' && autoDetectedLang && autoDetectedLang !== 'auto') {
          setDetectedLanguage(autoDetectedLang);
          responseLanguage = autoDetectedLang;
        }
        
        const userMsg: Message = { 
          id: crypto.randomUUID(), 
          role: "user", 
          text, 
          lang: responseLanguage 
        };
        setMessages((m) => [...m, userMsg]);
        
        try {
          const reply = await postQuery(text, responseLanguage);
          const botMsg: Message = { 
            id: crypto.randomUUID(), 
            role: "assistant", 
            text: reply, 
            lang: responseLanguage 
          };
          setMessages((m) => [...m, botMsg]);
          setSpeaking(true);
          await speak(reply, responseLanguage);
        } catch (e) {
          console.error('Error processing query:', e);
          toast({ 
            title: t('errors.audio'), 
            description: t('errors.audioDescription'),
            variant: "destructive"
          });
        } finally {
          setSpeaking(false);
        }
      },
      onError: (error) => {
        setListening(false);
        setIsAutoDetecting(false);
        if (micTimeoutRef.current) {
          clearTimeout(micTimeoutRef.current);
        }
        console.error('Speech recognition error:', error);
        toast({ 
          title: t('errors.mic'), 
          description: error.message || t('errors.micDescription'),
          variant: "destructive"
        });
      },
      onEnd: () => {
        setListening(false);
        setIsAutoDetecting(false);
        if (micTimeoutRef.current) {
          clearTimeout(micTimeoutRef.current);
        }
      },
    });
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (micTimeoutRef.current) {
        clearTimeout(micTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="container py-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('app.title')}</h1>
        <nav className="flex items-center gap-4">
          <Select value={language} onValueChange={(v) => setLanguage(v as LanguageCode)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t('language.label')} />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </nav>
      </header>

      <main className="container grid gap-6 pb-10">
        <section aria-label="Chat" className="mx-auto w-full max-w-2xl">
          <div ref={chatRef} className="h-[48vh] md:h-[52vh] overflow-y-auto rounded-xl border bg-card p-4">
            <div className="flex flex-col gap-4">
              {messages.length === 0 && (
                <div className="text-center text-lg text-muted-foreground py-20">
                  {t('chat.empty')}
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <article className={`${m.role === 'user' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'} px-4 py-3 rounded-2xl max-w-[80%] text-lg leading-relaxed`}>
                    {m.text}
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-2xl">
          <div className="relative flex items-center justify-center py-6">
            {listening && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-2 border-primary/30 animate-ping" />
                <div className="absolute w-32 h-32 rounded-full border border-primary/20 animate-pulse" />
              </div>
            )}
            <Button
              variant="mic"
              size="xlRound"
              aria-pressed={listening}
              aria-label={listening ? t('mic.stop') : t('mic.start')}
              className={`
                relative z-10 shadow-xl transition-all duration-300 ease-in-out
                ${listening 
                  ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-red-500/25' 
                  : 'shadow-primary/25 hover:scale-105'
                }
                ${speaking ? 'animate-pulse' : ''}
              `}
              onClick={handleMicToggle}
              disabled={speaking}
            >
              {listening ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className={`w-6 h-6 ${speaking ? 'text-muted-foreground' : 'text-white'}`} />
              )}
            </Button>
          </div>
          <div className="text-center space-y-2">
            <p className="text-base md:text-lg text-muted-foreground">
              {listening 
                ? (isAutoDetecting ? '🔍 Detecting language...' : t('chat.listening'))
                : speaking 
                  ? t('chat.speaking') 
                  : t('chat.speakPrompt')
              }
            </p>
            {detectedLanguage && language === 'auto' && (
              <p className="text-sm text-primary font-medium animate-pulse">
                ✅ Detected: {LANGUAGES.find(l => l.code === detectedLanguage)?.label}
              </p>
            )}
          </div>
        </section>

        <section aria-label="Features" className="mx-auto w-full max-w-2xl">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[
              {icon: Sprout, label: t('features.plantTimeline'), isComingSoon: false, path: '/plants'}, 
              {icon: CloudSun, label: t('features.weather'), isComingSoon: false, path: '/weather'}, 
              {icon: Store, label: t('features.marketPrices'), isComingSoon: true}
            ].map((card) => (
              <article 
                key={card.label} 
                className={`rounded-xl border bg-card p-4 flex flex-col items-center justify-center gap-2 ${
                  !card.isComingSoon ? 'cursor-pointer hover:bg-accent transition-colors' : ''
                }`}
                onClick={() => !card.isComingSoon && card.path && navigate(card.path)}
              >
                <card.icon className="text-foreground/80" />
                <span className="text-sm md:text-base font-medium">{card.label}</span>
                {card.isComingSoon ? (
                  <span className="text-xs text-muted-foreground">{t('features.comingSoon')}</span>
                ) : (
                  <span className="text-xs text-primary">Available now</span>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
