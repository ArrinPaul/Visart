# Feature: Heritage Storytelling & Audio Narration

## Overview
Two distinct pieces bundled under one "storytelling" umbrella:
1. **Story text generation** — part of the single `/api/generate` AI call (`story: { title, body }` in `VisartGeneration`), a ~100–140 word narrative grounded in the artisan's stated facts.
2. **Audio narration** — entirely client-side, browser-native **Web Speech API `SpeechSynthesis`**. There is no server-side text-to-speech engine, no audio file generation, and no audio storage anywhere in this codebase. Every "audio player" in the UI is synthesizing speech live in the visitor's own browser at playback time.

## Story Generation
Prompted in `lib/ai/visart.ts`: *["A distinct evocative title and a polished artisan narrative of approximately 100–140 words grounded strictly on the input facts."](../../lib/ai/visart.ts#L277)* Grounding is explicitly instructed against fabrication (no invented lineages, awards, GI tags, or certifications) and against marketing clichés (the prompt lists banned phrases like "timeless beauty," "passed down through generations"). This is a prompt-level instruction only — there is no automated fact-checking or post-generation filter enforcing it; correctness depends entirely on the model following the instruction.

Demo-mode story text ([`getMockGeneration()`](../../lib/ai/visart.ts#L173)) is template-interpolated from the input fields, not AI-written, but follows a similar structure.

## Audio Narration (Text-to-Speech)
**Module**: `lib/audio/tts.ts`. **Not a server API** — confirm this before assuming any audio pipeline exists beyond the browser.

- [`isSpeechSupported()`](../../lib/audio/tts.ts#L24) — feature-detects `"speechSynthesis" in window`. If unsupported, `speakText()` returns `false` and logs a warning; the UI (`components/ui/AudioPlayerControl.tsx`) should be checked for how it surfaces this to the user, but there is no server-side fallback audio.
- [`getBestVoiceForLanguage(language: "en" | "hi" | "kn")`](../../lib/audio/tts.ts#L87) — searches `window.speechSynthesis.getVoices()` for the best-matching installed voice: exact locale match (e.g. `hi-IN`) → prefix match (`hi*`) → name-substring match (e.g. voice name contains "hindi", "swara", "hemant", "kalpana") → falls back to an Indian-English voice (`en-IN`) → falls back to the browser's first available voice.
- [`speakText(text, options)`](../../lib/audio/tts.ts#L154) — cancels any in-progress utterance, builds a `SpeechSynthesisUtterance`, sets `lang` (`hi-IN`/`kn-IN`/`en-IN`), assigns the matched voice if found, sets [`rate`](../../lib/audio/tts.ts#L162) (0.92 for English, 0.88 for Hindi/Kannada — "slightly more paced for non-English clarity," per the source comment) and `pitch` (1.0).
- [`useAudioPlayer()`](../../lib/audio/tts.ts#L215) — a React hook exposing `play(text, language)`, `pause()`, `resume()`, `stop()`, and `state` (`IDLE | PLAYING | PAUSED | STOPPED | ERROR`), consumed by [`components/ui/AudioPlayerControl.tsx`](../../components/ui/AudioPlayerControl.tsx#L1) (this is the actual player rendered on `/product/[id]` and `/workspace`; `components/product/ArtisanStory.tsx` also uses this hook but is currently unused/dead — no page imports it, see [artisan-workspace.md](artisan-workspace.md) sibling note and `docs/CODEBASE_MAP.md`).

**Browser compatibility caveat (from the code, not external knowledge)**: voice availability is entirely dependent on what speech voices are installed on the visitor's OS/browser — `getVoices()` can return an empty list until the browser fires [`onvoiceschanged`](../../lib/audio/tts.ts#L74) (handled: `tts.ts` re-caches voices on that event), and if no Hindi/Kannada voice is installed at all, playback silently falls back to an English-sounding voice reading non-English text, or to whatever `voices[0]` is. There is no bundled/downloaded voice asset — this is 100% dependent on the client OS's installed TTS voices.

## Voice Dictation (Speech-to-Text)
**Module**: `lib/audio/stt.ts`, used by `components/ui/VoiceInputButton.tsx` in `ProductForm`. Browser-native `SpeechRecognition`/`webkitSpeechRecognition`. [`isSpeechRecognitionSupported()`](../../lib/audio/stt.ts#L26) feature-detects this; if unsupported, [`useSpeechToText()`](../../lib/audio/stt.ts#L39) sets an error message ("Speech recognition is not supported in this browser") rather than silently failing. Handles [`no-speech` and `not-allowed`/`permission-denied`](../../lib/audio/stt.ts#L98) errors with user-facing messages. Default recognition language is `en-IN`; the hook accepts a `language` option but nothing in the current `ProductForm`/`VoiceInputButton` wiring was confirmed here to switch it dynamically per the artisan's language preference — verify in `components/ui/VoiceInputButton.tsx` before assuming multi-language dictation works end-to-end.

## Modification Guide
Adding a new narration language requires: adding the language code to `TTSLanguage` in `lib/audio/tts.ts`, adding a voice-matching branch in `getBestVoiceForLanguage`, adding a locale mapping in `speakText`, and — since the story is only ever generated in English by the AI (translations only cover `product.title`/`product.description`, not `story.body`; see [translation.md](translation.md)) — deciding whether/how a translated story would be produced at all, since no such translated-story field currently exists in `VisartGeneration`.

## Known Limitations
- [components/landing/VoiceAccessibilitySection.tsx](../../components/landing/VoiceAccessibilitySection.tsx#L1) (the marketing landing page's language demo) calls `window.speechSynthesis`/`SpeechSynthesisUtterance` directly instead of reusing `lib/audio/tts.ts` — a second, independent implementation of the same browser API with hardcoded sample text, not real generated content.
- No audio caching, no pre-generated/downloadable audio files — every playback re-synthesizes.
- No voice selection UI for the end user — voice choice is fully automatic.
- Story narration quality is entirely dependent on the visitor's device/browser voice quality, which VISART does not control.
