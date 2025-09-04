import Link from "next/link";
import AuthSection from "./components/AuthSection";

function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            <img 
              src="/playground-logo.jpg" 
              alt="PlayGround AI" 
              className="h-56 w-auto mb-4"
            />
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800">
              Welcome to PlayGround AI
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Your personal platform for notes, business ideas, and knowledge management. 
            Build, organize, and grow your ideas in one beautiful space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white font-semibold rounded-xl hover:from-slate-700 hover:to-slate-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link
              href="/features"
              className="px-8 py-4 border-2 border-emerald-300 text-slate-700 font-semibold rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-slate-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-teal-400 rounded-full opacity-20 animate-pulse delay-2000"></div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Personal Notes",
      description: "Create, organize, and search through your personal notes with rich text editing and smart categorization."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Business Ideas",
      description: "Capture and develop your business ideas with structured templates and progress tracking."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Knowledge Library",
      description: "Build your personal knowledge base with articles, resources, and learning materials."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: "Video Browsing",
      description: "Discover and watch amazing YouTube videos with integrated search and playback functionality."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "AI Tools Hub",
      description: "Access all AI tools: chat, image generation, video tools, and more in one centralized location."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Secure & Private",
      description: "Your data is encrypted and secure, accessible only to you across all your devices."
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Everything you need to organize your ideas
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Playground provides powerful tools to capture, organize, and develop your thoughts into actionable insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  index % 2 === 0 
                    ? 'bg-gradient-to-r from-slate-800 to-slate-700' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthSectionWrapper() {
  return (
    <div className="absolute top-6 right-6 z-50">
      <AuthSection />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <AuthSectionWrapper />
      
      <HeroSection />
      <FeaturesSection />
      
      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Playground</h3>
          <p className="text-slate-300 mb-6">
            Your personal platform for ideas and knowledge
          </p>
          <div className="flex justify-center space-x-6 text-sm text-slate-300">
            <span>© 2024 Playground</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
