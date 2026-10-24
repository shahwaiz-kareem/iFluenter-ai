# iFluenter

> Real-time, voice-first language learning platform engineered for conversational fluency.

iFluenter is a full-stack, AI-powered language practice application designed to bridge the gap between static vocabulary drills and dynamic spoken fluency. Built around a low-latency audio streaming pipeline, it allows users to practice natural spoken conversations with intelligent, context-aware personas.

---

## ⚡ Core Features

- **Low-Latency Voice Pipeline:** Real-time audio streaming powered by WebSocket connections and Voice Activity Detection (VAD) for natural turn-taking.
- **Context-Aware AI Conversations:** Conversational logic that dynamically adapts vocabulary, speaking speed, and grammar complexity based on user proficiency.
- **Instant Pronunciation & Grammar Analysis:** Granular post-session breakdowns highlighting fluency markers, grammar improvements, and mispronounced words.
- **Adaptive Learning Flow:** Dynamic session orchestration that tracks historical weak points and introduces targeted sentence patterns during practice.
- **Minimalist Interface:** Clean, distraction-free UI built around voice feedback and visual audio cues.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS / `shadcn/ui`
- **State & Audio Engine:** React Hooks, Web Audio API, `socket.io-client`

### Backend & Infrastructure
- **Runtime & Framework:** Node.js, Express.js
- **Database:** MongoDB / Mongoose
- **Authentication & Core Services:** Appwrite / JWT
- **Real-Time Communication:** Socket.io
- **Audio Processing:** Custom VAD integration, streaming Text-to-Speech (TTS), and speech-to-text engines

---

## 🏗️ Architecture Flow

```text
[ Browser / Web Audio API ]
            │
            │ (Duplex WebSockets / Audio Packets)
            ▼
 [ Node.js / Express Server ] ──► [ VAD & Speech Recognition ]
            │                                  │
            ▼                                  ▼
   [ Database (MongoDB) ]            [ Conversational AI Engine ]
                                               │
                                               ▼
                                       [ Streaming TTS Output ]
