import Link from "next/link";
import AuthSection from "./components/AuthSection";

function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Playground
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your personal platform for notes, business ideas, and knowledge management. 
            Build, organize, and grow your ideas in one beautiful space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link
              href="/features"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-300 rounded-full opacity-20 animate-pulse delay-2000"></div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: "📝",
      title: "Personal Notes",
      description: "Create, organize, and search through your personal notes with rich text editing and smart categorization."
    },
    {
      icon: "💡",
      title: "Business Ideas",
      description: "Capture and develop your business ideas with structured templates and progress tracking."
    },
    {
      icon: "📚",
      title: "Knowledge Library",
      description: "Build your personal knowledge base with articles, resources, and learning materials."
    },
    {
      icon: "🎥",
      title: "Video Browsing",
      description: "Discover and watch amazing YouTube videos with integrated search and playback functionality."
    },
    {
      icon: "🚀",
      title: "AI Tools Hub",
      description: "Access all AI tools: chat, image generation, video tools, and more in one centralized location."
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your data is encrypted and secure, accessible only to you across all your devices."
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything you need to organize your ideas
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Playground provides powerful tools to capture, organize, and develop your thoughts into actionable insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Playground</h3>
          <p className="text-gray-400 mb-6">
            Your personal platform for ideas and knowledge
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
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
