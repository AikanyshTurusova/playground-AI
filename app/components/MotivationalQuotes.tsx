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
          prompt: "Generate a motivational quote that is inspiring, authentic, and suitable for a productivity dashboard. Include the quote text, a realistic author name, and a motivational category."
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
    }, 30000); // 30 seconds

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
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-lg relative">
      <div className="text-center">
        <div 
          className={`transition-opacity duration-300 ease-in-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <blockquote className="text-2xl md:text-3xl font-medium mb-4 leading-relaxed">
            "{currentQuote.text}"
          </blockquote>
          
          <cite className="text-lg font-semibold not-italic block mb-4">
            — {currentQuote.author}
          </cite>
          
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
              {currentQuote.category}
            </span>
          </div>
          
          {isLoading && (
            <div className="mt-2">
              <span className="text-sm text-white text-opacity-70">✨ AI Powered</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle Navigation Arrows */}
      <button
        onClick={goToPreviousQuote}
        disabled={isLoading}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-all duration-200 disabled:opacity-50"
        aria-label="Generate new quote"
      >
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goToNextQuote}
        disabled={isLoading}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-all duration-200 disabled:opacity-50"
        aria-label="Generate new quote"
      >
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
