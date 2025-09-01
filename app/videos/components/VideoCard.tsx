'use client';

import { YouTubeVideo } from '../../utils/youtube';
import { useState } from 'react';

interface VideoCardProps {
  video: YouTubeVideo;
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const getThumbnailDisplay = () => {
    if (imageLoading) {
      return (
        <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      );
    }
    
    if (imageError || !video.thumbnail) {
      return (
        <div className="w-full h-32 bg-gradient-to-br from-red-100 to-red-200 flex flex-col items-center justify-center text-center p-4">
          <div className="text-4xl mb-2">🎥</div>
          <div className="text-red-700 text-sm font-medium">
            {video.title && video.title.length > 20 ? video.title.substring(0, 20) + '...' : video.title || 'Video'}
          </div>
          <div className="text-red-600 text-xs mt-1">
            Thumbnail unavailable
          </div>
        </div>
      );
    }
    
    return (
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
        onLoad={handleImageLoad}
        onError={(e) => {
          console.error('❌ Thumbnail failed to load:', video.thumbnail, e);
          handleImageError();
        }}
        loading="lazy"
      />
    );
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1 group"
    >
      {/* Thumbnail */}
      <div className="relative">
        {getThumbnailDisplay()}
        
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-2xl">▶️</span>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-red-600 transition-colors">
          {video.title}
        </h3>
        
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {video.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="font-medium text-gray-700">{video.channelTitle}</span>
          <span>{formatDate(video.publishedAt)}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>👁️ {video.viewCount} views</span>
          <span>👍 {video.likeCount}</span>
        </div>

        {/* Tags */}
        {video.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {video.tags.slice(0, 3).map((tag, index) => (
              <span
                key={`${video.id}-tag-${tag}-${index}`}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {video.tags.length > 3 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{video.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
