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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <Navigation />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">AI Chat Assistant</h1>
            <p className="mt-2 text-gray-600">
              Chat with OpenAI&apos;s AI assistant to get help with your ideas, notes, and projects
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chat Assistant */}
        <ChatAssistant className="w-full" />
        
        {/* Features Info */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What can I help you with?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">💡 Business Ideas</h4>
              <p className="text-sm text-blue-700">
                Get feedback on business concepts, market analysis, and strategy planning
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">📝 Writing Help</h4>
              <p className="text-sm text-green-700">
                Improve your notes, get writing suggestions, and enhance your content
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">🔍 Research</h4>
              <p className="text-sm text-purple-700">
                Get insights on topics, find resources, and explore new areas of knowledge
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-900 mb-2">🚀 Problem Solving</h4>
              <p className="text-sm text-orange-700">
                Work through challenges, brainstorm solutions, and get creative ideas
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 text-lg">💡</span>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Chat Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
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

