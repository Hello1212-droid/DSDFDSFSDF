/**
 * Text-to-speech read-aloud using the Web Speech API.
 * Picks an Indian voice when available (e.g., hi-IN), else the default.
 */

let current: SpeechSynthesisUtterance | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const preferred = [
    "hi-IN", "mr-IN", "bn-IN", "ta-IN", "te-IN", "kn-IN", "ml-IN", "gu-IN", "pa-IN",
    "en-IN", "en-GB", "en-US",
  ];
  for (const tag of preferred) {
    const v = voices.find((v) => v.lang.replace("_", "-") === tag);
    if (v) return v;
  }
  return voices[0];
}

export function isSpeechSupported(): boolean {
  return "speechSynthesis" in window;
}

export function speak(text: string, langHint?: string) {
  if (!isSpeechSupported() || !text.trim()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  } else if (langHint) {
    u.lang = langHint;
  }
  u.rate = 0.95;
  current = u;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
  current = null;
}

export function toggleSpeak(text: string, langHint?: string) {
  if (current && window.speechSynthesis?.speaking) {
    stopSpeaking();
  } else {
    speak(text, langHint);
  }
}
