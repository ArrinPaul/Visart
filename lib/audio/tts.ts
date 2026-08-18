/**
 * Text-to-Speech (TTS) Platform Module
 * Member C — Platform / Data Engineer (V2 Accessibility)
 */

export type TTSLanguage = 'en' | 'hi' | 'kn';

export interface TTSOptions {
  language?: TTSLanguage;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakText(text: string, options: TTSOptions = {}): boolean {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis is not supported on this platform.');
    return false;
  }

  const {
    language = 'en',
    rate = 0.95,
    pitch = 1.0,
    onStart,
    onEnd,
    onError,
  } = options;

  try {
    // Cancel any active utterance first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map language code to standard locale
    if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (language === 'kn') {
      utterance.lang = 'kn-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = rate;
    utterance.pitch = pitch;

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    if (onError) utterance.onerror = onError;

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('TTS error:', err);
    if (onError) onError(err);
    return false;
  }
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}
