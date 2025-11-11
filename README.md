# PARALLEL-X

A parallel life universe simulation application built with React, TypeScript, and Vite.

## Features

- Interactive decision logging and tracking
- AI-powered insights using Groq API
- Beautiful UI with Shadcn components
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8.10.0+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abhi3114-glitch/PARALLEL-X.git
cd PARALLEL-X
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your API keys to the `.env` file:
```
VITE_GROQ_API_KEY=your_actual_groq_api_key
```

5. Run the development server:
```bash
pnpm run dev
```

## Deployment on Vercel

### Method 1: Using Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - Add `VITE_GROQ_API_KEY` with your Groq API key
   - Add `VITE_APP_NAME` with value `Parallel Life Universe`
   - Add `VITE_APP_VERSION` with value `2.0.0`
6. Click "Deploy"

### Method 2: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add environment variables via CLI or dashboard:
```bash
vercel env add VITE_GROQ_API_KEY
```

### Important Notes for Vercel Deployment

- **Environment Variables**: Make sure to add all required environment variables in the Vercel dashboard under Project Settings → Environment Variables
- **Build Settings**: The `vercel.json` is already configured with the correct build settings
- **Framework**: Vite is automatically detected
- **Output Directory**: `dist` (already configured)

## Environment Variables

Required:
- `VITE_GROQ_API_KEY` - Your Groq API key for AI features

Optional:
- `VITE_SUPABASE_URL` - Supabase project URL (if using Supabase)
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key (if using Supabase)
- `VITE_APP_NAME` - Application name (default: "Parallel Life Universe")
- `VITE_APP_VERSION` - Application version (default: "2.0.0")

## Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Groq SDK
- React Router
- Zustand (State Management)
- React Query

## License

MIT