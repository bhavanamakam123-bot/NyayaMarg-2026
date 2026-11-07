export function speak(text: string, lang: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === "hi" ? "hi-IN" : lang === "te" ? "te-IN" : "en-IN";
  utterance.rate = 0.96;
  window.speechSynthesis.speak(utterance);
}

export function listen(onText: (value: string) => void, onError: (message: string) => void) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    onError("This browser does not support speech recognition. You can type instead.");
    return () => undefined;
  }
  const recognition = new Recognition();
  recognition.lang = document.documentElement.lang || "en-IN";
  recognition.interimResults = false;
  recognition.onresult = (event) => {
    const text = event.results[0]?.[0]?.transcript || "";
    if (text) onText(text);
  };
  recognition.onerror = () => onError("Speech recognition stopped. You can type the same words.");
  recognition.start();
  return () => recognition.stop();
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
  interface SpeechRecognitionConstructor {
    new (): SpeechRecognitionLike;
  }
  interface SpeechRecognitionLike {
    lang: string;
    interimResults: boolean;
    start: () => void;
    stop: () => void;
    onresult: ((event: { results: Array<Array<{ transcript: string }>> }) => void) | null;
    onerror: (() => void) | null;
  }
}
