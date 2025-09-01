import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-your-api-key-here', // Replace with your actual API key
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = '1024x1024', quality = 'standard', style = 'natural' } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Image prompt is required' },
        { status: 400 }
      );
    }

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
    const validStyles = ['natural', 'vivid'];
    if (!validStyles.includes(style)) {
      return NextResponse.json(
        { error: 'Invalid style parameter' },
        { status: 400 }
      );
    }

    // Create the image using DALL-E 3
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: size as '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792',
      quality: quality as 'standard' | 'hd',
      style: style as 'natural' | 'vivid',
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt,
      size,
      quality,
      style,
      usage: response.usage
    });

  } catch (error) {
    console.error('AI Image Generation Error:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('content_policy_violation')) {
        return NextResponse.json(
          { error: 'The prompt violates OpenAI\'s content policy. Please try a different description.' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('billing')) {
        return NextResponse.json(
          { error: 'Billing issue with OpenAI account. Please check your account status.' },
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
