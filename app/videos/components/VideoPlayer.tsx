'use client';

import { YouTubeVideo } from '../../utils/youtube';

interface VideoPlayerProps {
  video: YouTubeVideo;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Video Player */}
      <div className="relative bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${video.id}?autoplay=0&rel=0&modestbranding=1`}
          title={video.title}
          className="w-full h-96 md:h-[500px] lg:h-[600px]"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Video Information */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Left Column - Title and Description */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
              {video.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <span>👁️</span>
                {video.viewCount} views
              </span>
              <span className="flex items-center gap-1">
                <span>👍</span>
                {video.likeCount} likes
              </span>
              <span className="flex items-center gap-1">
                <span>⏱️</span>
                {video.duration}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {video.channelTitle.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{video.channelTitle}</h3>
                  <p className="text-sm text-gray-600">Published on {formatDate(video.publishedAt)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700 text-sm whitespace-pre-wrap line-clamp-6">
                {video.description}
              </p>
            </div>
          </div>

          {/* Right Column - Actions and Tags */}
          <div className="lg:w-80 space-y-4">
            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <span>📺</span>
                  Watch on YouTube
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <span>🔗</span>
                  Copy Link
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <span>💾</span>
                  Save to Library
                </button>
              </div>
            </div>

            {/* Tags */}
            {video.tags.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag, index) => (
                    <span
                      key={`${video.id}-tag-${tag}-${index}`}
                      className="bg-white text-gray-700 text-sm px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Video Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Video Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{video.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-medium">{video.viewCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Likes:</span>
                  <span className="font-medium">{video.likeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Published:</span>
                  <span className="font-medium">{formatDate(video.publishedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
