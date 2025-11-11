# Parallel Life Universe 🌌

An AI-powered self-evolution simulator that compares your real decisions with an alternate self's choices across 6 life dimensions. Built with cutting-edge AI technology using Groq's Llama-3.1-8b-instant model.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![AI Powered](https://img.shields.io/badge/AI-Groq%20Llama--3.1-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Functionality
- **Decision Logging**: Track your daily choices across multiple life categories
- **AI-Powered Alternate Self**: Groq's Llama-3.1-8b-instant generates intelligent alternate decisions
- **6-Dimension Analysis**: Health, Skills, Discipline, Social, Finance, and Mood
- **Reality Sync Tasks**: AI-generated actionable tasks to bridge the gap
- **Progress Tracking**: Streaks, badges, and comprehensive analytics

### AI Enhancements
- **Intelligent Decision Analysis**: AI understands context and generates realistic alternatives
- **Personalized Insights**: Real-time AI coaching and recommendations
- **Comprehensive Life Analysis**: Strengths, weaknesses, and motivational guidance
- **Natural Language Explanations**: Clear rationale for every alternate decision

### Visualization
- **Radar Charts**: Compare performance across all dimensions
- **Bar Charts**: Visualize gaps between you and your alternate self
- **Progress Tracking**: Beautiful UI with real-time updates
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **AI Engine**: Groq SDK (Llama-3.1-8b-instant)
- **Charts**: Recharts
- **State Management**: Zustand
- **Routing**: React Router v6
- **Backend**: Supabase (optional)
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- Groq API Key ([Get one here](https://console.groq.com))

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/abhi3114-glitch/PARALLEL-X.git
cd PARALLEL-X
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Groq API key:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

4. **Start development server**
```bash
pnpm run dev
```

5. **Build for production**
```bash
pnpm run build
```

## 🔑 Getting Your Groq API Key

1. Visit [Groq Console](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env` file

## 🎯 Usage

### Logging Decisions
1. Click "Log New Decision"
2. Describe what you did
3. Select category and intensity
4. Rate how it felt
5. Add optional context for better AI analysis

### Viewing Insights
- Dashboard shows real-time comparison with alternate self
- AI insights appear automatically when enabled
- Click "Refresh Analysis" on profile for updated recommendations

### Completing Sync Tasks
- Navigate to "Sync Tasks"
- Complete tasks to close the gap with your alternate self
- Track progress and earn badges

## 🏗️ Project Structure

```
PARALLEL-X/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── DashboardLayout.tsx
│   ├── pages/
│   │   ├── Index.tsx        # Dashboard
│   │   ├── LogDecision.tsx  # Decision logging
│   │   ├── SyncTasks.tsx    # Task management
│   │   └── Profile.tsx      # User profile
│   ├── lib/
│   │   ├── groq.ts          # AI integration
│   │   ├── simulation.ts    # Decision simulation
│   │   ├── supabase.ts      # Backend client
│   │   └── utils.ts         # Utilities
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .env.example
├── vercel.json
└── package.json
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
pnpm add -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Add environment variables in Vercel dashboard**
- Go to Project Settings → Environment Variables
- Add `VITE_GROQ_API_KEY` with your API key

### Manual Deployment

1. Build the project:
```bash
pnpm run build
```

2. Deploy the `dist` folder to any static hosting service

## 🎨 Customization

### Themes
Edit `src/index.css` to customize colors and themes.

### Policy Matrix
Modify `src/lib/simulation.ts` to adjust how decisions impact dimensions.

### AI Prompts
Customize AI behavior in `src/lib/groq.ts` by editing the prompt templates.

## 🔒 Privacy & Security

- All data stored locally in browser by default
- API keys never exposed to frontend (use environment variables)
- Optional Supabase integration for cloud sync
- No personal data collected without consent

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com) for lightning-fast AI inference
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [Recharts](https://recharts.org) for data visualization
- [Supabase](https://supabase.com) for backend infrastructure

## 📧 Support

For support, email support@parallellifeuniverse.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Social features (compare with friends)
- [ ] Advanced AI models (GPT-4, Claude)
- [ ] Historical trend analysis
- [ ] Export data functionality
- [ ] Gamification enhancements

---

Made with ❤️ by the Parallel Life Universe Team

**Star ⭐ this repo if you find it helpful!**