# GymTrackerAI v0.2.0

A minimalist, monochrome fitness & nutrition tracker with glassmorphism design and AI-powered meal analysis.

## Features

- **Home Dashboard**: Calendar with completion tracking, daily workout display, nutrition progress
- **Advanced Workout Manager**: Structured weekly routines with exercises (sets × reps)
- **AI Meal Analyzer**: Upload photos for Gemini AI to estimate nutrition content
- **Barcode Scanner**: Scan product codes to auto-populate nutrition from OpenFoodFacts
- **Glassmorphic UI**: Monochrome (grayscale only) with semi-transparent glass effects
- **Persistent Storage**: Zustand + localStorage for workouts, completions, and nutrition logs

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (custom glassmorphism utilities)
- **State**: Zustand with localStorage persistence
- **AI**: Google Generative AI (Gemini 1.5 Flash)
- **Barcode**: html5-qrcode + OpenFoodFacts API
- **Icons**: Lucide-React

## Setup

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   - Copy `.env.local.example` to `.env.local`
   - Add your Google Gemini API key from [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Pages

- `/` — Home dashboard
- `/workouts` — Workout Manager
- `/nutrition` — Nutrition tracker with manual entry, AI analyzer, and barcode scanner
- `/settings` — Configure nutrition goals and API keys

## Design System

- **Colors**: Pure grayscale (black, white, grays only)
- **Components**: Glassmorphic panels with `backdrop-blur-md` and `bg-white/10` styling
- **Typography**: Clean sans-serif (Inter/system-ui)
- **Aesthetic**: Futuristic, premium, minimalist

## Gemini AI Integration

When you upload a meal photo, the AI:
1. Analyzes the image using Gemini 1.5 Flash
2. Returns estimated food name, calories, and protein
3. Shows results for editing before saving

## Barcode Scanning

1. Click "Barcode" in Nutrition Tracker
2. Allow camera access
3. Scan any product barcode
4. Data auto-populates from OpenFoodFacts API
5. Edit and save

## Future Enhancements

- Weekly/monthly nutrition reports
- Exercise history and PR tracking
- Social sharing (completed workouts)
- Dark/light mode toggle
- Mobile app (React Native)

