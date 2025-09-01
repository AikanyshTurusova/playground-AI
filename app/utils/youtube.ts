// YouTube API utility functions
const YOUTUBE_API_KEY = 'AIzaSyDwaAgTO_URGb3ZekOWn6_BXo1cJzzXm2o';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  likeCount: string;
  tags: string[];
}

export interface YouTubeSearchResult {
  items: YouTubeVideo[];
  nextPageToken?: string;
  totalResults: number;
}

// Helper function to get the best available thumbnail
const getBestThumbnail = (thumbnails: { 
  maxres?: { url: string }; 
  high?: { url: string }; 
  medium?: { url: string }; 
  default?: { url: string } 
}) => {
  // Try to get the highest quality thumbnail available
  let thumbnailUrl = null;
  if (thumbnails.maxres?.url) thumbnailUrl = thumbnails.maxres.url;
  else if (thumbnails.high?.url) thumbnailUrl = thumbnails.high.url;
  else if (thumbnails.medium?.url) thumbnailUrl = thumbnails.medium.url;
  else if (thumbnails.default?.url) thumbnailUrl = thumbnails.default.url;
  
  // If we have a thumbnail URL, proxy it through our API to avoid CORS issues
  if (thumbnailUrl) {
    return `/api/proxy-image?url=${encodeURIComponent(thumbnailUrl)}`;
  }
  
  return null;
};

// Search for YouTube videos
export const searchYouTubeVideos = async (
  query: string,
  maxResults: number = 20,
  pageToken?: string
): Promise<YouTubeSearchResult> => {
  try {
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: maxResults.toString(),
      key: YOUTUBE_API_KEY || '',
      ...(pageToken && { pageToken })
    });

    const response = await fetch(`${YOUTUBE_API_BASE}/search?${params}`);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Get video details for duration and statistics
    const videoIds = data.items.map((item: { id: { videoId: string } }) => item.id.videoId).join(',');
    const videoDetails = await getVideoDetails(videoIds);
    
    // Merge search results with video details
    const videos: YouTubeVideo[] = data.items.map((item: { 
      id: { videoId: string }; 
      snippet: { 
        title: string; 
        description: string; 
        thumbnails: { 
          high?: { url: string }; 
          medium?: { url: string }; 
          default?: { url: string } 
        }; 
        channelTitle: string; 
        publishedAt: string 
      } 
    }, index: number) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: videoDetails[index]?.duration || 'Unknown',
      viewCount: videoDetails[index]?.viewCount || 'Unknown',
      likeCount: videoDetails[index]?.likeCount || 'Unknown',
      tags: videoDetails[index]?.tags || []
    }));

    return {
      items: videos,
      nextPageToken: data.nextPageToken,
      totalResults: data.pageInfo.totalResults
    };
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    throw error;
  }
};

// Get detailed information about specific videos
const getVideoDetails = async (videoIds: string): Promise<Array<{
  duration: string;
  viewCount: string;
  likeCount: string;
  tags: string[];
}>> => {
  try {
    const params = new URLSearchParams({
      part: 'contentDetails,statistics,snippet',
      id: videoIds,
      key: YOUTUBE_API_KEY || ''
    });

    const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.items.map((item: { contentDetails: { duration: string }; statistics: { viewCount: string; likeCount: string }; snippet: { tags?: string[] } }) => ({
      duration: formatDuration(item.contentDetails.duration),
      viewCount: formatNumber(item.statistics.viewCount),
      likeCount: formatNumber(item.statistics.likeCount),
      tags: item.snippet.tags || []
    }));
  } catch (error) {
    console.error('Error getting video details:', error);
    return [];
  }
};

// Format duration from ISO 8601 format to readable format
const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  
  let result = '';
  if (hours) result += `${hours}:`;
  if (minutes) result += `${minutes.padStart(2, '0')}:`;
  if (seconds) result += seconds.padStart(2, '0');
  
  return result || '0:00';
};

// Format numbers with K, M, B suffixes
const formatNumber = (num: string): string => {
  const number = parseInt(num);
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + 'B';
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return number.toString();
};

// Get trending videos
export const getTrendingVideos = async (maxResults: number = 20): Promise<YouTubeSearchResult> => {
  try {
    const params = new URLSearchParams({
      part: 'snippet',
      chart: 'mostPopular',
      regionCode: 'US',
      maxResults: maxResults.toString(),
      key: YOUTUBE_API_KEY || ''
    });

    const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Get video details for duration and statistics
    const videoIds = data.items.map((item: { id: string }) => item.id).join(',');
    const videoDetails = await getVideoDetails(videoIds);
    
    // Merge trending results with video details
    const videos: YouTubeVideo[] = data.items.map((item: { 
      id: string; 
      snippet: { 
        title: string; 
        description: string; 
        thumbnails: { 
          maxres?: { url: string };
          high?: { url: string }; 
          medium?: { url: string }; 
          default?: { url: string } 
        }; 
        channelTitle: string; 
        publishedAt: string 
      } 
    }, index: number) => {
      const thumbnail = getBestThumbnail(item.snippet.thumbnails);
      
      // Log thumbnail information for debugging
      if (thumbnail) {
        console.log(`✅ Trending video ${item.id} thumbnail:`, thumbnail);
      } else {
        console.warn(`⚠️ No thumbnail found for trending video ${item.id}`);
        console.log('Available thumbnails:', item.snippet.thumbnails);
      }
      
      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: thumbnail || '',
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: videoDetails[index]?.duration || 'Unknown',
        viewCount: videoDetails[index]?.viewCount || 'Unknown',
        likeCount: videoDetails[index]?.likeCount || 'Unknown',
        tags: videoDetails[index]?.tags || []
      };
    });

    return {
      items: videos,
      totalResults: data.pageInfo.totalResults
    };
  } catch (error) {
    console.error('Error getting trending videos:', error);
    throw error;
  }
};
