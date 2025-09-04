'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Audio generation states
  const [audioPrompt, setAudioPrompt] = useState('');
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioType, setAudioType] = useState('music'); // music, voice, sound
  
  // Text generation states
  const [textPrompt, setTextPrompt] = useState('');
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [textError, setTextError] = useState<string | null>(null);
  const [textType, setTextType] = useState('article'); // article, story, email, code

  // Image generation function
  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          size: '1024x1024',
          quality: 'standard',
          style: 'vivid'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
      setGeneratedImage(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  // Audio generation function
  const generateAudio = async () => {
    if (!audioPrompt.trim()) return;
    
    setIsGeneratingAudio(true);
    setAudioError(null);
    setGeneratedAudio(null);
    
    try {
      // For now, we'll simulate audio generation
      // In a real implementation, you'd call an audio generation API
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate 3 second delay
      
      // Simulate successful audio generation
      setGeneratedAudio('https://example.com/generated-audio.mp3');
      
      // In the future, you could integrate with:
      // - OpenAI's Audio API
      // - ElevenLabs for voice generation
      // - Mubert for music generation
      // - Soundraw for AI music
      
    } catch (err) {
      setAudioError(err instanceof Error ? err.message : 'Failed to generate audio');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Text generation function
  const generateText = async () => {
    if (!textPrompt.trim()) return;
    
    setIsGeneratingText(true);
    setTextError(null);
    setGeneratedText(null);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Generate ${textType}: ${textPrompt}`,
          context: `You are an expert ${textType} writer. Create high-quality, engaging content based on the user's request.`
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate text');
      }
      
      setGeneratedText(data.response);
    } catch (err) {
      setTextError(err instanceof Error ? err.message : 'Failed to generate text');
    } finally {
      setIsGeneratingText(false);
    }
  };

  const tabs = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      id: 'image-gen', 
      name: 'Image Generation', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'chat', 
      name: 'AI Chat', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    { 
      id: 'video', 
      name: 'Video Tools', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'audio', 
      name: 'Audio Tools', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    },
    { 
      id: 'text', 
      name: 'Text Tools', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            AI Tools Hub
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your all-in-one destination for AI-powered creativity, communication, and productivity
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 mb-8">
          <div className="flex flex-wrap justify-center p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 mx-1 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Actions Grid */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Link
                    href="/ai-tools?tab=image-gen"
                    onClick={() => setActiveTab('image-gen')}
                    className="group p-6 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-slate-600">
                      Generate Images
                    </h3>
                    <p className="text-slate-600">
                      Create stunning visuals with AI-powered image generation
                    </p>
                  </Link>

                  <Link
                    href="/ai-tools?tab=chat"
                    onClick={() => setActiveTab('chat')}
                    className="group p-6 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-slate-600">
                      AI Chat Assistant
                    </h3>
                    <p className="text-slate-600">
                      Get help, brainstorm ideas, and chat with AI
                    </p>
                  </Link>

                  <Link
                    href="/ai-tools?tab=video"
                    onClick={() => setActiveTab('video')}
                    className="group p-6 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-slate-600">
                      Video Tools
                    </h3>
                    <p className="text-slate-600">
                      Create and edit videos with AI assistance
                    </p>
                  </Link>

                  <Link
                    href="/ai-tools?tab=audio"
                    onClick={() => setActiveTab('audio')}
                    className="group p-6 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-slate-600">
                      Audio Generation
                    </h3>
                    <p className="text-slate-600">
                      Generate music, voice, and audio content
                    </p>
                  </Link>

                  <Link
                    href="/ai-tools?tab=text"
                    onClick={() => setActiveTab('text')}
                    className="group p-6 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-slate-600">
                      Text Tools
                    </h3>
                    <p className="text-slate-600">
                      Write, edit, and enhance text content
                    </p>
                  </Link>

                  <div className="p-6 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl border border-slate-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      Coming Soon
                    </h3>
                    <p className="text-slate-600">
                      More AI tools and features on the way
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">Image generated successfully</p>
                      <p className="text-sm text-slate-600">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">Chat session completed</p>
                      <p className="text-sm text-slate-600">15 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'image-gen' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">AI Image Generation</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Describe your image
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A futuristic cityscape with flying cars and neon lights..."
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={generateImage}
                      disabled={!prompt.trim() || isGenerating}
                      className="w-full bg-gradient-to-r from-slate-800 to-slate-700 text-white py-3 px-6 rounded-lg font-medium hover:from-slate-700 hover:to-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isGenerating ? 'Generating...' : 'Generate Image'}
                    </button>
                    
                    {generatedImage && (
                      <button
                        onClick={() => {
                          setGeneratedImage(null);
                          setError(null);
                          setPrompt('');
                        }}
                        className="w-full bg-slate-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-slate-600 transition-colors"
                      >
                        Generate New Image
                      </button>
                    )}
                  </div>
                </div>
                <div className="bg-slate-100 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                  {isGenerating ? (
                    <div className="text-center text-slate-500">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-600 mx-auto mb-4"></div>
                      <p>Generating your image...</p>
                      <p className="text-sm mt-2">This usually takes 10-30 seconds</p>
                    </div>
                  ) : generatedImage ? (
                    <div className="w-full">
                      <img 
                        src={generatedImage} 
                        alt="Generated image" 
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => window.open(generatedImage, '_blank')}
                          className="text-slate-600 hover:text-slate-700 text-sm font-medium"
                        >
                          Open in new tab
                        </button>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="text-center text-red-500">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="font-medium">Error generating image</p>
                      <p className="text-sm mt-2">{error}</p>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500">
                      <div className="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p>Your generated image will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">AI Chat Assistant</h2>
              <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
                <div className="text-center text-slate-500">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p>Chat interface coming soon...</p>
                  <p className="text-sm mt-2">You can use the main chat page for now</p>
                  <Link
                    href="/chat"
                    className="inline-block mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Go to Chat
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Video Tools</h2>
              <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
                <div className="text-center text-slate-500">
                  <div className="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p>Video tools coming soon...</p>
                  <p className="text-sm mt-2">You can use the video meetings page for now</p>
                  <Link
                    href="/video-meetings"
                    className="inline-block mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Go to Video Meetings
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">AI Audio Generation</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Audio Type
                    </label>
                    <select
                      value={audioType}
                      onChange={(e) => setAudioType(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="music">Music Generation</option>
                      <option value="voice">Voice Generation</option>
                      <option value="sound">Sound Effects</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Describe your audio
                    </label>
                    <textarea
                      value={audioPrompt}
                      onChange={(e) => setAudioPrompt(e.target.value)}
                      placeholder={
                        audioType === 'music' ? "An upbeat electronic dance track with synthesizers and drums..." :
                        audioType === 'voice' ? "A calm, professional voice saying 'Welcome to our platform'..." :
                        "Thunder and rain sounds for a nature scene..."
                      }
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={generateAudio}
                      disabled={!audioPrompt.trim() || isGeneratingAudio}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 px-6 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isGeneratingAudio ? 'Generating Audio...' : 'Generate Audio'}
                    </button>
                    
                    {generatedAudio && (
                      <button
                        onClick={() => {
                          setGeneratedAudio(null);
                          setAudioError(null);
                          setAudioPrompt('');
                        }}
                        className="w-full bg-slate-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-slate-600 transition-colors"
                      >
                        Generate New Audio
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <h4 className="font-medium text-slate-800 mb-2">Audio Generation Tips</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Be specific about genre, mood, and instruments</li>
                      <li>• Include tempo and style preferences</li>
                      <li>• For voice: specify tone, accent, and emotion</li>
                      <li>• For sounds: describe the environment and context</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-slate-100 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                  {isGeneratingAudio ? (
                    <div className="text-center text-slate-500">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                      <p>Generating your audio...</p>
                      <p className="text-sm mt-2">This usually takes 10-30 seconds</p>
                    </div>
                  ) : generatedAudio ? (
                    <div className="w-full text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                      <p className="font-medium text-slate-800 mb-4">Audio Generated Successfully!</p>
                      <div className="space-y-3">
                        <button
                          onClick={() => window.open(generatedAudio, '_blank')}
                          className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                        >
                          Download Audio
                        </button>
                        <button
                          onClick={() => {
                            const audio = new Audio(generatedAudio);
                            audio.play();
                          }}
                          className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                        >
                          Play Audio
                        </button>
                      </div>
                    </div>
                  ) : audioError ? (
                    <div className="text-center text-red-500">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="font-medium">Error generating audio</p>
                      <p className="text-sm mt-2">{audioError}</p>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                      <p>Your generated audio will appear here</p>
                      <p className="text-sm mt-2">Choose audio type and describe what you want</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">AI Text Generation</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Content Type
                    </label>
                    <select
                      value={textType}
                      onChange={(e) => setTextType(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="article">Article</option>
                      <option value="story">Story</option>
                      <option value="email">Email</option>
                      <option value="code">Code</option>
                      <option value="blog">Blog Post</option>
                      <option value="social">Social Media</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Describe what you want to create
                    </label>
                    <textarea
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                      placeholder={
                        textType === 'article' ? "Write an article about the benefits of AI in healthcare..." :
                        textType === 'story' ? "Create a short story about a time traveler..." :
                        textType === 'email' ? "Draft a professional email to a client about project updates..." :
                        textType === 'code' ? "Write a React component for a todo list..." :
                        textType === 'blog' ? "Create a blog post about sustainable living..." :
                        "Write a social media post about launching a new product..."
                      }
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={generateText}
                      disabled={!textPrompt.trim() || isGeneratingText}
                      className="w-full bg-gradient-to-r from-slate-800 to-slate-700 text-white py-3 px-6 rounded-lg font-medium hover:from-slate-700 hover:to-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isGeneratingText ? 'Generating Text...' : 'Generate Text'}
                    </button>
                    
                    {generatedText && (
                      <button
                        onClick={() => {
                          setGeneratedText(null);
                          setTextError(null);
                          setTextPrompt('');
                        }}
                        className="w-full bg-slate-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-slate-600 transition-colors"
                      >
                        Generate New Text
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <h4 className="font-medium text-slate-800 mb-2">Text Generation Tips</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Be specific about tone, style, and length</li>
                      <li>• Include target audience and purpose</li>
                      <li>• For code: specify language and requirements</li>
                      <li>• For emails: mention recipient and context</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-slate-100 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                  {isGeneratingText ? (
                    <div className="text-center text-slate-500">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-600 mx-auto mb-4"></div>
                      <p>Generating your text...</p>
                      <p className="text-sm mt-2">This usually takes 5-15 seconds</p>
                    </div>
                  ) : generatedText ? (
                    <div className="w-full">
                      <div className="bg-white p-4 rounded-lg border border-slate-200 max-h-[300px] overflow-y-auto">
                        <h4 className="font-medium text-slate-800 mb-2">Generated Content:</h4>
                        <div className="prose prose-sm max-w-none">
                          {generatedText.split('\n').map((line, index) => (
                            <p key={index} className="mb-2 last:mb-0">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => navigator.clipboard.writeText(generatedText)}
                          className="flex-1 bg-slate-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-slate-700 transition-colors"
                        >
                          Copy Text
                        </button>
                        <button
                          onClick={() => {
                            const blob = new Blob([generatedText], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${textType}-${Date.now()}.txt`;
                            a.click();
                          }}
                          className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ) : textError ? (
                    <div className="text-center text-red-500">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="font-medium">Error generating text</p>
                      <p className="text-sm mt-2">{textError}</p>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500">
                      <div className="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p>Your generated text will appear here</p>
                      <p className="text-sm mt-2">Choose content type and describe what you want</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

