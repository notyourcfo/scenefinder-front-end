# SceneFinder 

SceneFinder is a web application that helps users identify movies, TV shows, and specific scenes from video clips or Instagram reels. 
Built with Next.js and UI powered by Tailwind CSS, it provides way to discover the source of your favorite video content.

## Features 

- **Video Upload Analysis**: Upload video files (up to 5MB, max 60 seconds) for scene identification
- **Instagram Reel Support**: Analyze scenes directly from Instagram reel links
- **Comprehensive Scene Details**: Get information about:
  - Movie or TV Show title
  - Season and Episode information (for TV shows)
  - Timestamp of the scene
  - Characters present in the scene
  - Detailed scene context
- **Waitlist System**: Join the waitlist for upcoming features
- **Modern UI**: Beautiful and responsive design using Tailwind CSS and shadcn/ui components

## Tech Stack 

- **Frontend Framework**: Next.js 15.3.2
- **UI Library**: React 19.0.0
- **Styling**: 
  - Tailwind CSS
  - shadcn/ui components
  - class-variance-authority
  - tailwind-merge
- **Icons**: Lucide React
- **Development Tools**:
  - ESLint
  - PostCSS
  - Tailwind CSS configuration

## Project Structure 

```
scenefinder/
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   ├── about/         # About page
│   ├── how-it-works/  # How it works page
│   └── login/         # Login page
├── components/        # Reusable UI components
├── lib/              # Utility functions and helpers
├── public/           # Static assets
└── ...config files   # Various configuration files
