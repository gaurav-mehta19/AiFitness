# 💪 FitAI Coach - AI-Powered Fitness Assistant


An intelligent fitness assistant that generates **personalized workout and diet plans** using AI. Built with Next.js, powered by Google Gemini AI, with voice synthesis and AI-generated exercise images for an immersive fitness experience.

## 🌐 Live Demo

**🔗 [View Live App](https://ai-fitness-xi.vercel.app/)**

---

## ✨ Features

### 🎯 Personalized AI Plans

- **Custom Workout Plans** - Daily exercise routines with sets, reps, and rest times tailored to your fitness level

- **Personalized Diet Plans** - Meal breakdowns (breakfast, lunch, dinner, snacks) based on dietary preferences

- **AI Tips & Motivation** - Posture corrections, lifestyle advice, and motivational quotesThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

- **Smart Regeneration** - Provide feedback and regenerate plans instantly

## Learn More

### 👤 Comprehensive User Profiling

- Basic Information: Name, Age, GenderTo learn more about Next.js, take a look at the following resources:

- Body Metrics: Height, Weight

- Fitness Goals: Weight Loss, Muscle Gain, Maintenance- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- Fitness Level: Beginner, Intermediate, Advanced- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- Workout Location: Home, Gym, Outdoor

- Dietary Preferences: Vegetarian, Non-Vegetarian, Vegan, KetoYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

- Optional: Medical History, Stress Level

## Deploy on Vercel

### 🔊 Voice Features

- **Text-to-Speech** - Listen to your workout and diet plans using ElevenLabs TTSThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

- **Section-wise Playback** - Play specific sections (Workout, Diet, Motivation)

- **Audio Controls** - Play/Pause functionality for each sectionCheck out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


### 🖼️ AI Image Generation
- **Exercise Visualization** - AI-generated images for workout exercises
- **Smart Detection** - Automatically detects exercises in your plan
- **Zoom Modal** - Click to view images in full-screen
- **Persistent Storage** - Images saved locally using IndexedDB

### 📄 Export & Share
- **PDF Export** - Download your complete fitness plan
- **Copy to Clipboard** - Quick copy functionality
- **Persistent State** - Plans saved across page reloads

### 🎨 Modern UI/UX
- **Dark/Light Mode** - Seamless theme switching
- **Responsive Design** - Works perfectly on all devices
- **Loading States** - Smooth loading animations
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time validation with helpful feedback

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.0.1](https://nextjs.org/) - App Router, Turbopack, Server Components
- **UI Library**: [React 19.2.0](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

### State Management
- **Zustand** - Lightweight state management with persistence
- **localStorage** - Form data and response persistence
- **IndexedDB** - Large image storage

### AI & APIs
- **LLM**: [Google Gemini AI](https://ai.google.dev/) (gemini-1.5-flash)
- **Image Generation**: Gemini 2.5 Flash Image Model
- **Text-to-Speech**: [ElevenLabs API](https://elevenlabs.io/)

### Validation & Utils
- **Zod** - TypeScript-first schema validation
- **react-markdown** - Markdown rendering with GitHub Flavored Markdown
- **react-to-print** - PDF export functionality

---

## 📁 Project Structure

```
fitness-app/
├── app/
│   ├── globals.css                 # Global styles & theme configuration
│   ├── layout.tsx                  # Root layout with providers
│   ├── page.tsx                    # Landing page
│   ├── app/
│   │   └── page.tsx                # Main fitness app page
│   └── api/
│       ├── generate/route.ts       # AI plan generation endpoint
│       ├── generate-image/route.ts # Image generation endpoint
│       └── text-to-speech/route.ts # TTS endpoint
│
├── components/
│   ├── FitnessForm.tsx             # User input form with validation
│   ├── FitnessPlanDisplay.tsx      # AI response display with markdown
│   ├── ResponseActions.tsx         # Action buttons (Copy, PDF, Regenerate)
│   ├── FeedbackForm.tsx            # Feedback form for regeneration
│   ├── ErrorAlert.tsx              # Error display component
│   ├── theme-provider.tsx          # Theme context wrapper
│   ├── theme-toggle.tsx            # Dark/Light mode toggle
│   └── ui/                         # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── textarea.tsx
│       └── alert.tsx
│
├── lib/
│   ├── validation.ts               # Zod schemas for form validation
│   ├── imageStorage.ts             # IndexedDB utilities
│   └── utils.ts                    # Helper functions
│
├── store/
│   └── store.ts                    # Zustand store with persistence
│
├── types/
│   └── fitness.ts                  # TypeScript interfaces
│
└── public/                         # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **API Keys**:
  - Google Gemini API Key ([Get it here](https://ai.google.dev/))
  - ElevenLabs API Key ([Get it here](https://elevenlabs.io/))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/fitness-app.git
cd fitness-app
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# ElevenLabs Text-to-Speech
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI plan generation and image generation | ✅ Yes |
| `ELEVENLABS_API_KEY` | ElevenLabs API key for text-to-speech functionality | ✅ Yes |

---

## 📱 Features Breakdown

### 1. AI Plan Generation
- **Endpoint**: `/api/generate`
- **Model**: gemini-1.5-flash
- **Input**: User profile data (age, weight, goals, etc.)
- **Output**: Structured workout and diet plan with motivation

### 2. Image Generation
- **Endpoint**: `/api/generate-image`
- **Model**: gemini-2.5-flash-image
- **Input**: Exercise name
- **Output**: Base64 encoded image
- **Storage**: IndexedDB for persistence

### 3. Text-to-Speech
- **Endpoint**: `/api/text-to-speech`
- **Provider**: ElevenLabs
- **Input**: Text content (workout/diet section)
- **Output**: Audio stream

### 4. State Management
- **Store**: Zustand with persist middleware
- **Persisted Data**: 
  - Form data (user inputs)
  - Generated response
  - Feedback text
- **Non-persisted Data**:
  - Generated images (stored in IndexedDB)
  - Loading states
  - UI state

---

## 🎨 Theme & Styling

- **Color Scheme**: Emerald-600 to Teal-600 gradient
- **Dark Mode**: Full dark mode support with slate colors
- **Typography**: System font stack for optimal performance
- **Components**: shadcn/ui with custom theming
- **Responsive**: Mobile-first design approach

---

## 🧪 Key Technologies Explained

### Why Zustand?
- Lightweight (3KB)
- React 19 compatible
- Built-in persistence
- No boilerplate

### Why IndexedDB for Images?
- localStorage quota limit (5-10MB)
- Base64 images are large (100KB-1MB each)
- IndexedDB supports 50MB+ storage
- Async, non-blocking operations

### Why Gemini AI?
- Fast response times
- High-quality text generation
- Built-in image generation model
- Free tier available

---

## 📊 Performance Optimizations

- ✅ **Turbopack** for faster builds
- ✅ **System fonts** to avoid font loading delays
- ✅ **Code splitting** with Next.js App Router
- ✅ **Image lazy loading** with IntersectionObserver
- ✅ **Debounced validations** to reduce re-renders
- ✅ **IndexedDB** for efficient large data storage

---

## 🐛 Troubleshooting

### Common Issues

**1. Build fails with "Cannot find module"**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**2. Images not persisting**
- Check browser IndexedDB support
- Clear IndexedDB from browser DevTools > Application > IndexedDB

**3. API errors**
- Verify `.env.local` file exists
- Check API keys are valid
- Ensure no extra spaces in environment variables

**4. Dark mode not working**
- Clear localStorage
- Check ThemeProvider is wrapping the app

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Google Gemini](https://ai.google.dev/) - AI model
- [ElevenLabs](https://elevenlabs.io/) - Text-to-speech API
- [Vercel](https://vercel.com/) - Deployment platform






