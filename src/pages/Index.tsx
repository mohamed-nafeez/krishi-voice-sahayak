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
import { toast } from "@/hooks/use-toast";

 type Message = { id: string; role: "user" | "assistant"; text: string; lang: LanguageCode };

const Index = () => {
  const [lang, setLang] = useState<LanguageCode>("hi-IN");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const stopRecognitionRef = useRef<() => void>(() => {});
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const handleMicToggle = () => {
    if (listening) {
      stopRecognitionRef.current?.();
      setListening(false);
      return;
    }

    setListening(true);
    stopRecognitionRef.current = startRecognition(lang, {
      onResult: async (text) => {
        setListening(false);
        const userMsg: Message = { id: crypto.randomUUID(), role: "user", text, lang };
        setMessages((m) => [...m, userMsg]);
        try {
          const reply = await postQuery(text, lang);
          const botMsg: Message = { id: crypto.randomUUID(), role: "assistant", text: reply, lang };
          setMessages((m) => [...m, botMsg]);
          setSpeaking(true);
          await speak(reply, lang);
        } catch (e) {
          toast({ title: "Audio error", description: "Unable to play the response" });
        } finally {
          setSpeaking(false);
        }
      },
      onError: () => {
        setListening(false);
        toast({ title: "Mic error", description: "Please allow microphone access" });
      },
      onEnd: () => setListening(false),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="container py-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">KrishiVoice: Voice Agriculture Assistant</h1>
        <nav className="flex items-center gap-4">
          <Select value={lang} onValueChange={(v) => setLang(v as LanguageCode)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Language" />
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
                  Tap the microphone and speak your question.
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
            {listening && <div className="mic-ring animate-pulse-ring" aria-hidden />}
            <Button
              variant="mic"
              size="xlRound"
              aria-pressed={listening}
              aria-label={listening ? "Stop listening" : "Start listening"}
              className="shadow-glow animate-float-soft"
              onClick={handleMicToggle}
            >
              {listening ? <MicOff className="opacity-90" /> : <Mic className="opacity-90" />}
            </Button>
          </div>
          <p className="text-center text-base md:text-lg text-muted-foreground">
            {listening ? "Listening..." : speaking ? "Speaking..." : "Speak in Hindi • Tamil • Telugu • English"}
          </p>
        </section>

        <section aria-label="Coming Soon" className="mx-auto w-full max-w-2xl">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[{icon: Sprout, label: 'Soil Health'}, {icon: CloudSun, label: 'Weather'}, {icon: Store, label: 'Market Prices'}].map((card) => (
              <article key={card.label} className="rounded-xl border bg-card p-4 flex flex-col items-center justify-center gap-2">
                <card.icon className="text-foreground/80" />
                <span className="text-sm md:text-base font-medium">{card.label}</span>
                <span className="text-xs text-muted-foreground">Coming soon</span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
