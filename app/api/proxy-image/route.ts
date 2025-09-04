import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return new Response('Missing URL parameter', { status: 400 });
    }
    
    // Validate that it's a YouTube image URL
    if (!imageUrl.includes('ytimg.com') && !imageUrl.includes('youtube.com')) {
      return new Response('Invalid image URL', { status: 400 });
    }
    
    console.log('🖼️ Proxying image:', imageUrl);
    
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    return new Response(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
    
  } catch (error) {
    console.error('❌ Error proxying image:', error);
    return new Response('Failed to load image', { status: 500 });
  }
}


