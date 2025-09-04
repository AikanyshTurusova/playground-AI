'use client';

import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import ImageGenerator from '../../components/ImageGenerator';
import Navigation from '../../components/Navigation';

export default function ImagesPage() {
  const { user, isLoaded } = useUser();

  // Redirect if not authenticated
  if (isLoaded && !user) {
    redirect('/');
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Navigation */}
      <Navigation />
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-slate-800">AI Image Generator</h1>
            <p className="mt-2 text-slate-600">
              Create stunning images from text descriptions using OpenAI&apos;s DALL-E 3
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Generator */}
        <ImageGenerator className="w-full" />
        
        {/* Tips and Examples */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tips */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">💡 Image Generation Tips</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Be specific and descriptive in your prompts</li>
              <li>• Include details about style, mood, and composition</li>
              <li>• Mention artistic styles (e.g., &ldquo;oil painting&rdquo;, &ldquo;digital art&rdquo;)</li>
              <li>• Specify lighting and time of day</li>
              <li>• Include color preferences and themes</li>
              <li>• Use vivid style for more dramatic results</li>
              <li>• Use natural style for realistic images</li>
            </ul>
          </div>

          {/* Example Prompts */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">🎨 Example Prompts</h3>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-slate-700">
                  <strong>Landscape:</strong> &ldquo;A serene mountain landscape at sunset with a crystal clear lake reflecting the golden sky, digital art style&rdquo;
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-slate-700">
                  <strong>Portrait:</strong> &ldquo;A wise old wizard with a long white beard, wearing blue robes, sitting in a magical library, oil painting style&rdquo;
                </p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-slate-700">
                  <strong>Abstract:</strong> &ldquo;Futuristic cityscape with neon lights, flying cars, and glass skyscrapers, cyberpunk aesthetic, digital art&rdquo;
                </p>
              </div>
              
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-slate-700">
                  <strong>Still Life:</strong> &ldquo;A rustic wooden table with fresh bread, vintage wine bottle, and wildflowers in a clay pot, natural lighting&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">🚀 Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-slate-800 mb-2">Multiple Sizes</h4>
              <p className="text-sm text-slate-600">
                Choose from square, landscape, and portrait orientations
              </p>
            </div>
            
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <h4 className="font-medium text-slate-800 mb-2">Quality Options</h4>
              <p className="text-sm text-slate-600">
                Standard and HD quality for different use cases
              </p>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="font-medium text-slate-800 mb-2">Style Control</h4>
              <p className="text-sm text-slate-600">
                Vivid for dramatic effects, natural for realistic images
              </p>
            </div>
          </div>
        </div>

        {/* Usage Notes */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 text-lg">ℹ️</span>
            <div>
              <h4 className="font-medium text-slate-800 mb-1">Usage Information</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Images are generated using OpenAI&apos;s DALL-E 3 model</li>
                <li>• Each generation costs credits based on your OpenAI plan</li>
                <li>• Generated images are stored temporarily in your browser</li>
                <li>• Download images to save them permanently</li>
                <li>• Respect OpenAI&apos;s content policy when creating prompts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

