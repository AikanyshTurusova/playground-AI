'use client';

import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import ChatAssistant from '../components/ChatAssistant';
import Navigation from '../components/Navigation';

export default function ChatPage() {
  const { user, isLoaded } = useUser();

  // Redirect if not authenticated
  if (isLoaded && !user) {
    redirect('/');
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Navigation */}
      <Navigation />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-slate-800">AI Chat Assistant</h1>
            <p className="mt-2 text-slate-600">
              Chat with OpenAI&apos;s AI assistant to get help with your ideas, notes, and projects
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chat Assistant */}
        <ChatAssistant className="w-full" />
        
        {/* Features Info */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">What can I help you with?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-lg border border-slate-200">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="font-medium text-slate-800">Business Ideas</h4>
              </div>
              <p className="text-sm text-slate-600">
                Get feedback on business concepts, market analysis, and strategy planning
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-lg border border-slate-200">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-medium text-slate-800">Writing Help</h4>
              </div>
              <p className="text-sm text-slate-600">
                Improve your notes, get writing suggestions, and enhance your content
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-lg border border-slate-200">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h4 className="font-medium text-slate-800">Research</h4>
              </div>
              <p className="text-sm text-slate-600">
                Get insights on topics, find resources, and explore new areas of knowledge
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-lg border border-slate-200">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-medium text-slate-800">Problem Solving</h4>
              </div>
              <p className="text-sm text-slate-600">
                Work through challenges, brainstorm solutions, and get creative ideas
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-gradient-to-br from-slate-50 to-emerald-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-1">Chat Tips</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Be specific with your questions for better answers</li>
                <li>• Use the chat to brainstorm and refine your ideas</li>
                <li>• Ask for help with research and analysis</li>
                <li>• Get feedback on your business plans and strategies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

