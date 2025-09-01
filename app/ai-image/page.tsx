'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Navigation from '../components/Navigation';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  size: string;
  quality: string;
  style: string;
  timestamp: Date;
}

export default function AIImagePage() {
  const { user, isLoaded } = useUser();
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [quality, setQuality] = useState('standard');
  const [style, setStyle] = useState('natural');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  // Redirect if not authenticated
  if (isLoaded && !user) {
    redirect('/');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          size,
          quality,
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      // Add the new image to the list
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: data.imageUrl,
        prompt: data.prompt,
        size: data.size,
        quality: data.quality,
        style: data.style,
        timestamp: new Date(),
      };

      setGeneratedImages(prev => [newImage, ...prev]);
      setPrompt(''); // Clear the prompt after successful generation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-generated-${prompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const presetPrompts = [
    'A futuristic cityscape with flying cars and neon lights',
    'A serene mountain landscape at sunset with a lake',
    'A cute robot playing with a cat in a garden',
    'A magical forest with glowing mushrooms and fairy lights',
    'A steampunk airship flying over Victorian London',
    'A cozy coffee shop interior with warm lighting',
    'A space station orbiting Earth with stars in background',
    'A fantasy castle on a floating island in the clouds'
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      <Navigation />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">AI Image Generator</h1>
                          <p className="mt-2 text-gray-600">
                Create stunning images from your imagination using OpenAI&apos;s DALL-E
              </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Generation Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate New Image</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Prompt Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your image *
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A futuristic cityscape with flying cars and neon lights..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={4}
                    required
                  />
                </div>

                {/* Preset Prompts */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Try these examples:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {presetPrompts.map((presetPrompt, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setPrompt(presetPrompt)}
                        className="text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200"
                      >
                        {presetPrompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="1024x1024">Square (1024x1024)</option>
                      <option value="1792x1024">Landscape (1792x1024)</option>
                      <option value="1024x1792">Portrait (1024x1792)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                    <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="standard">Standard</option>
                      <option value="hd">HD</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="natural">Natural</option>
                      <option value="vivid">Vivid</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium py-3 px-6 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating Image...
                    </div>
                  ) : (
                    '🎨 Generate Image'
                  )}
                </button>
              </form>

              {/* Error Display */}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-red-400">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for better images:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific and descriptive in your prompts</li>
                <li>• Include details about style, mood, and composition</li>
                <li>• Mention lighting, colors, and artistic style</li>
                <li>• HD quality takes longer but produces better results</li>
              </ul>
            </div>
          </div>

          {/* Generated Images */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Generated Images ({generatedImages.length})
              </h2>
              
              {generatedImages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
                  <p className="text-gray-600">
                    Generate your first AI image using the form on the left
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedImages.map((image) => (
                    <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="relative">
                        <img
                          src={image.url}
                          alt={image.prompt}
                          className="w-full h-auto"
                        />
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => downloadImage(image.url, image.prompt)}
                            className="bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all duration-200"
                            title="Download image"
                          >
                            ⬇️
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-700 mb-2">{image.prompt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{image.size} • {image.quality} • {image.style}</span>
                          <span>{image.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
