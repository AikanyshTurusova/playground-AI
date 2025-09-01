'use client';

import { useState } from 'react';

interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  revisedPrompt?: string;
  size: string;
  quality: string;
  style: string;
  timestamp: Date;
}

interface ImageGeneratorProps {
  className?: string;
  onImageGenerated?: (image: GeneratedImage) => void;
  showHistory?: boolean;
}

export default function ImageGenerator({ 
  className = '', 
  onImageGenerated,
  showHistory = true 
}: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [size, setSize] = useState('1024x1024');
  const [quality, setQuality] = useState('standard');
  const [style, setStyle] = useState('vivid');

  const handleGenerateImage = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-image', {
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        imageUrl: data.imageUrl,
        prompt: data.prompt,
        revisedPrompt: data.revisedPrompt,
        size: data.size,
        quality: data.quality,
        style: data.style,
        timestamp: new Date(),
      };

      setGeneratedImages(prev => [newImage, ...prev]);
      
      // Call callback if provided
      if (onImageGenerated) {
        onImageGenerated(newImage);
      }

      // Clear prompt after successful generation
      setPrompt('');
      
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err && typeof err.message === 'string' 
        ? err.message 
        : 'Failed to generate image';
      setError(errorMessage);
      console.error('Image generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerateImage();
    }
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const copyImageUrl = async (imageUrl: string) => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      // You could add a toast notification here
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-lg">🎨</span>
          </div>
          <div>
            <h3 className="font-semibold">AI Image Generator</h3>
            <p className="text-sm text-purple-100">Powered by DALL-E 3</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-4">
          {/* Prompt Input */}
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Describe the image you want to create
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="A serene mountain landscape at sunset with a crystal clear lake reflecting the sky..."
              className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-500 mt-1">
              Be descriptive and specific for better results. Press Enter to generate.
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <select
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isGenerating}
              >
                <option value="1024x1024">Square (1024x1024)</option>
                <option value="1792x1024">Landscape (1792x1024)</option>
                <option value="1024x1792">Portrait (1024x1792)</option>
              </select>
            </div>

            <div>
              <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-1">
                Quality
              </label>
              <select
                id="quality"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isGenerating}
              >
                <option value="standard">Standard</option>
                <option value="hd">HD</option>
              </select>
            </div>

            <div>
              <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">
                Style
              </label>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isGenerating}
              >
                <option value="vivid">Vivid</option>
                <option value="natural">Natural</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateImage}
            disabled={!prompt.trim() || isGenerating}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Image...</span>
              </div>
            ) : (
              <span>🎨 Generate Image</span>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
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

      {/* Generated Images */}
      {showHistory && generatedImages.length > 0 && (
        <div className="p-4">
          <h4 className="font-medium text-gray-900 mb-4">Generated Images</h4>
          <div className="space-y-4">
            {generatedImages.map((image) => (
              <div key={image.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={image.imageUrl}
                      alt={image.prompt}
                      className="w-full max-w-xs rounded-lg shadow-sm"
                    />
                  </div>
                  
                  {/* Image Info */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-900">Original Prompt</h5>
                      <p className="text-sm text-gray-600">{image.prompt}</p>
                    </div>
                    
                    {image.revisedPrompt && (
                      <div>
                        <h5 className="font-medium text-gray-900">AI Refined Prompt</h5>
                        <p className="text-sm text-gray-600">{image.revisedPrompt}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>Size: {image.size}</span>
                      <span>Quality: {image.quality}</span>
                      <span>Style: {image.style}</span>
                      <span>Created: {image.timestamp.toLocaleString()}</span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadImage(image.imageUrl, `ai-generated-${image.id}.png`)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        📥 Download
                      </button>
                      <button
                        onClick={() => copyImageUrl(image.imageUrl)}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                      >
                        🔗 Copy URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

