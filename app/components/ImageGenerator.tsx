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
    <div className={`bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-emerald-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">AI Image Generator</h3>
            <p className="text-sm text-slate-200">Powered by DALL-E 3</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-4 border-b border-slate-200">
        <div className="space-y-4">
          {/* Prompt Input */}
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-2">
              Describe the image you want to create
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="A serene mountain landscape at sunset with a crystal clear lake reflecting the sky..."
              className="w-full resize-none border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              rows={3}
              disabled={isGenerating}
            />
            <p className="text-xs text-slate-500 mt-1">
              Be descriptive and specific for better results. Press Enter to generate.
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-slate-700 mb-1">
                Size
              </label>
              <select
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                disabled={isGenerating}
              >
                <option value="1024x1024">Square (1024x1024)</option>
                <option value="1792x1024">Landscape (1792x1024)</option>
                <option value="1024x1792">Portrait (1024x1792)</option>
              </select>
            </div>

            <div>
              <label htmlFor="quality" className="block text-sm font-medium text-slate-700 mb-1">
                Quality
              </label>
              <select
                id="quality"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                disabled={isGenerating}
              >
                <option value="standard">Standard</option>
                <option value="hd">HD</option>
              </select>
            </div>

            <div>
              <label htmlFor="style" className="block text-sm font-medium text-slate-700 mb-1">
                Style
              </label>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
            className="w-full px-4 py-3 bg-gradient-to-r from-slate-800 to-emerald-600 text-white font-medium rounded-lg hover:from-slate-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Image...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Generate Image</span>
              </div>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
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
          <h4 className="font-medium text-slate-800 mb-4">Generated Images</h4>
          <div className="space-y-4">
            {generatedImages.map((image) => (
              <div key={image.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
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
                      <h5 className="font-medium text-slate-800">Original Prompt</h5>
                      <p className="text-sm text-slate-600">{image.prompt}</p>
                    </div>
                    
                    {image.revisedPrompt && (
                      <div>
                        <h5 className="font-medium text-slate-800">AI Refined Prompt</h5>
                        <p className="text-sm text-slate-600">{image.revisedPrompt}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                      <span>Size: {image.size}</span>
                      <span>Quality: {image.quality}</span>
                      <span>Style: {image.style}</span>
                      <span>Created: {image.timestamp.toLocaleString()}</span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadImage(image.imageUrl, `ai-generated-${image.id}.png`)}
                        className="px-3 py-1 bg-gradient-to-r from-slate-800 to-slate-700 text-white text-sm rounded hover:from-slate-700 hover:to-slate-600 transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Download</span>
                        </div>
                      </button>
                      <button
                        onClick={() => copyImageUrl(image.imageUrl)}
                        className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm rounded hover:from-emerald-600 hover:to-teal-600 transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Copy URL</span>
                        </div>
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

