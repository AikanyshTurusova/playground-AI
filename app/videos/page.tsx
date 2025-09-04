'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { searchYouTubeVideos, getTrendingVideos, YouTubeVideo, YouTubeSearchResult } from '../utils/youtube';
import VideoCard from './components/VideoCard';
import VideoPlayer from './components/VideoPlayer';
import SearchBar from './components/SearchBar';
import Navigation from '../components/Navigation';

export default function VideosPage() {
  const { user, isLoaded } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeSearchResult | null>(null);
  const [trendingVideos, setTrendingVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  if (isLoaded && !user) {
    redirect('/');
  }

  // Load trending videos on component mount
  useEffect(() => {
    loadTrendingVideos();
  }, []);

  const loadTrendingVideos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getTrendingVideos(12);
      
      // Ensure unique videos by ID and add logging
      const uniqueVideos = result.items.filter((video, index, self) => 
        index === self.findIndex(v => v.id === video.id)
      );
      
      console.log('Loaded trending videos:', uniqueVideos.length);
      setTrendingVideos(uniqueVideos);
    } catch (err) {
      setError('Failed to load trending videos');
      console.error('Error loading trending videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      setSearchQuery(query);
      console.log('🔍 Searching for videos:', query);
      
      const result = await searchYouTubeVideos(query, 20);
      
      console.log('📊 Search API result:', result);
      
      // Ensure unique videos by ID
      const uniqueVideos = result.items.filter((video, index, self) => 
        index === self.findIndex(v => v.id === video.id)
      );
      
      console.log('✅ Search results:', uniqueVideos.length);
      
      // Log thumbnail information for debugging
      uniqueVideos.forEach((video, index) => {
        console.log(`📹 Search Video ${index + 1}:`, {
          id: video.id,
          title: video.title,
          thumbnail: video.thumbnail,
          hasThumbnail: !!video.thumbnail
        });
        
        if (video.thumbnail) {
          console.log(`✅ Search video ${video.id} has thumbnail:`, video.thumbnail);
        } else {
          console.warn(`⚠️ Search video ${video.id} missing thumbnail`);
        }
      });
      
      setSearchResults({
        ...result,
        items: uniqueVideos
      });
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('💥 Error searching videos:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVideoSelect = (video: YouTubeVideo) => {
    if (!video || !video.id) {
      console.warn('Invalid video selected:', video);
      return;
    }
    console.log('Selected video:', video.id, video.title);
    setSelectedVideo(video);
    // Scroll to video player
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = async () => {
    if (!searchResults?.nextPageToken) return;

    try {
      setIsLoading(true);
      const result = await searchYouTubeVideos(searchQuery, 20, searchResults.nextPageToken);
      
      // Ensure no duplicate videos by filtering based on video ID
      const existingIds = new Set(searchResults.items.map(video => video.id));
      const newVideos = result.items.filter(video => !existingIds.has(video.id));
      
      setSearchResults({
        ...result,
        items: [...searchResults.items, ...newVideos]
      });
    } catch (err) {
      setError('Failed to load more videos');
      console.error('Error loading more videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-slate-800">Video Browsing</h1>
            <p className="mt-2 text-slate-600">
              Discover and watch amazing videos from YouTube
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Selected Video Player */}
        {selectedVideo && selectedVideo.id && (
          <div className="mb-8">
            <VideoPlayer video={selectedVideo} />
          </div>
        )}

        {/* Search Results */}
        {searchResults && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Search Results for &quot;{searchQuery}&quot;
              </h2>
              <p className="text-slate-600">
                {searchResults.totalResults.toLocaleString()} videos found
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.items.filter(video => video && video.id).map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => handleVideoSelect(video)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {searchResults.nextPageToken && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white font-medium rounded-lg hover:from-slate-700 hover:to-slate-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Loading...' : 'Load More Videos'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Trending Videos */}
        {!searchResults && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Trending Videos</h2>
              <button
                onClick={loadTrendingVideos}
                disabled={isLoading}
                className="text-slate-600 hover:text-slate-700 font-medium transition-colors"
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={`skeleton-${i}`} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden animate-pulse">
                    <div className="h-32 bg-slate-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {trendingVideos.filter(video => video && video.id).map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onClick={() => handleVideoSelect(video)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleSearch('technology')}
              className="p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg hover:from-slate-100 hover:to-emerald-100 transition-colors text-left border border-slate-200 hover:border-slate-300"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-medium text-slate-800">Technology</h4>
              <p className="text-sm text-slate-600">Latest tech videos</p>
            </button>
            
            <button
              onClick={() => handleSearch('business')}
              className="p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg hover:from-slate-100 hover:to-emerald-100 transition-colors text-left border border-slate-200 hover:border-slate-300"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h4 className="font-medium text-slate-800">Business</h4>
              <p className="text-sm text-slate-600">Business insights</p>
            </button>
            
            <button
              onClick={() => handleSearch('education')}
              className="p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg hover:from-slate-100 hover:to-emerald-100 transition-colors text-left border border-slate-200 hover:border-slate-300"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="font-medium text-slate-800">Education</h4>
              <p className="text-sm text-slate-600">Learn something new</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
