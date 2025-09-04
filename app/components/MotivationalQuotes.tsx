'use client';

import { useState, useEffect } from 'react';

interface Quote {
  text: string;
  author: string;
  category: string;
}

export default function MotivationalQuotes() {
  const [currentQuote, setCurrentQuote] = useState<Quote>({
    text: "Loading your daily inspiration...",
    author: "AI",
    category: "Loading"
  });
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const generateAIQuote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "Generate a motivational quote that is inspiring, authentic, and suitable for a productivity dashboard."
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentQuote({
          text: data.quote,
          author: data.author,
          category: data.category
        });
      } else {
        // Fallback to a default quote if AI fails
        setCurrentQuote({
          text: "The only way to do great work is to love what you do.",
          author: "Steve Jobs",
          category: "Passion"
        });
      }
    } catch (error) {
      console.error('Error generating AI quote:', error);
      // Fallback quote
      setCurrentQuote({
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
        category: "Perseverance"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Generate initial AI quote
    generateAIQuote();

    // Set up interval for new AI quotes
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        generateAIQuote();
        setIsVisible(true);
      }, 500);
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, []);

  const goToNextQuote = () => {
    setIsVisible(false);
    setTimeout(() => {
      generateAIQuote();
      setIsVisible(true);
    }, 300);
  };

  const goToPreviousQuote = () => {
    // For AI quotes, "previous" generates a new one
    setIsVisible(false);
    setTimeout(() => {
      generateAIQuote();
      setIsVisible(true);
    }, 300);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
      <div className="relative z-10 text-center">
        <div 
          className={`transition-all duration-500 ease-in-out ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
        >
          <blockquote className="text-2xl md:text-3xl font-semibold mb-6 leading-relaxed">
            &ldquo;{currentQuote.text}&rdquo;
          </blockquote>
          
          <cite className="text-lg font-medium not-italic block mb-6">
            — {currentQuote.author}
          </cite>
          
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30 text-white">
              {currentQuote.category}
            </span>
          </div>
          
          {isLoading && (
            <div className="mt-3">
              <span className="text-sm text-slate-200 bg-white/10 px-3 py-1 rounded-full">AI Powered</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Modern Navigation Arrows */}
      <button
        onClick={goToPreviousQuote}
        disabled={isLoading}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 disabled:opacity-50 border border-white/30"
        aria-label="Generate new quote"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goToNextQuote}
        disabled={isLoading}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 disabled:opacity-50 border border-white/30"
        aria-label="Generate new quote"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
