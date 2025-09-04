'use client';

import { useState, useRef, useEffect } from 'react';
import ImageGenerator from './ImageGenerator';
import VoiceInput from './VoiceInput';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  className?: string;
}

export default function ChatAssistant({ className = '' }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you with text, ideas, and even generate images! What would you like to do today?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // Prepare messages for OpenAI API
      const apiMessages = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          model: 'gpt-3.5-turbo',
          maxTokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message.content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err && typeof err.message === 'string' 
        ? err.message 
        : 'Failed to send message';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputMessage(transcript);
    // Auto-send voice messages
    setTimeout(() => {
      if (transcript.trim()) {
        handleSendMessage();
      }
    }, 500);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your AI assistant. I can help you with text, ideas, and even generate images! What would you like to do today?',
        timestamp: new Date(),
      },
    ]);
    setError(null);
    setShowImageGenerator(false);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-emerald-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-sm text-slate-200">Powered by OpenAI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowImageGenerator(!showImageGenerator)}
              className="px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {showImageGenerator ? (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Chat Only</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Generate Images</span>
                </div>
              )}
            </button>
            <button
              onClick={clearChat}
              className="text-slate-200 hover:text-white transition-colors"
              title="Clear chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-white'
                  : 'bg-gradient-to-br from-slate-50 to-emerald-50 text-slate-800 border border-slate-200'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-slate-200' : 'text-slate-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-br from-slate-50 to-emerald-50 text-slate-800 px-4 py-2 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-4">
        {/* Voice/Text Mode Toggle */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsVoiceMode(false)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                !isVoiceMode
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Type
            </button>
            <button
              onClick={() => setIsVoiceMode(true)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                isVoiceMode
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Voice
            </button>
          </div>
          <div className="text-xs text-gray-500">
            {isVoiceMode ? 'Click microphone to speak' : 'Type your message below'}
          </div>
        </div>

        <div className="flex space-x-2">
          {isVoiceMode ? (
            <div className="flex-1 flex items-center justify-center">
              <VoiceInput
                onTranscript={handleVoiceTranscript}
                disabled={isLoading}
                className="scale-150"
              />
            </div>
          ) : (
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 resize-none border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              rows={2}
              disabled={isLoading}
            />
          )}
          <button
            onClick={handleSendMessage}
            disabled={(!inputMessage.trim() && !isVoiceMode) || isLoading}
            className="px-4 py-2 bg-gradient-to-r from-slate-800 to-emerald-600 text-white rounded-lg hover:from-slate-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <span>Send</span>
            )}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {isVoiceMode 
            ? 'Click the microphone to start speaking, then click again to stop' 
            : 'Press Enter to send, Shift+Enter for new line'
          }
        </p>
      </div>

      {/* Image Generator */}
      {showImageGenerator && (
        <div className="border-t border-slate-200">
          <ImageGenerator 
            showHistory={false}
            onImageGenerated={(image) => {
              // Add image generation message to chat
              const imageMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `I've generated an image for you: "${image.prompt}". You can download it or copy the URL.`,
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, imageMessage]);
            }}
          />
        </div>
      )}
    </div>
  );
}
