import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = '1024x1024', quality = 'standard', style = 'vivid' } = await request.json();

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Image prompt is required' },
        { status: 400 }
      );
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Prompt too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found in environment variables');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Log API key status (only first few characters for security)
    const apiKeyPreview = process.env.OPENAI_API_KEY.substring(0, 10) + '...';
    console.log('OpenAI API key loaded for image generation:', apiKeyPreview);

    // Validate size parameter
    const validSizes = ['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792'];
    if (!validSizes.includes(size)) {
      return NextResponse.json(
        { error: 'Invalid size parameter' },
        { status: 400 }
      );
    }

    // Validate quality parameter
    const validQualities = ['standard', 'hd'];
    if (!validQualities.includes(quality)) {
      return NextResponse.json(
        { error: 'Invalid quality parameter' },
        { status: 400 }
      );
    }

    // Validate style parameter
    const validStyles = ['vivid', 'natural'];
    if (!validStyles.includes(style)) {
      return NextResponse.json(
        { error: 'Invalid style parameter' },
        { status: 400 }
      );
    }

    console.log('Generating image with prompt:', prompt);

    // Generate image using DALL-E 3
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: size as '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792',
      quality: quality as 'standard' | 'hd',
      style: style as 'vivid' | 'natural',
    });

    console.log('Image generated successfully');

    // Return the image data
    return NextResponse.json({
      imageUrl: response.data?.[0]?.url,
      revisedPrompt: response.data?.[0]?.revised_prompt,
      size: size,
      quality: quality,
      style: style,
      prompt: prompt,
    });

  } catch (error: unknown) {
    console.error('OpenAI Image Generation Error:', error);
    
    if (error && typeof error === 'object' && 'status' in error) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }
      
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
      if (error.message.includes('content_policy_violation')) {
        return NextResponse.json(
          { error: 'Image prompt violates content policy. Please try a different description.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    );
  }
}

