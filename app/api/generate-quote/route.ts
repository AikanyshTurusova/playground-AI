import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found in environment variables');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Create a specific prompt for motivational quotes
    const quotePrompt = `Generate a short, powerful, and creative motivational quote. The quote should be:
- Inspiring and uplifting
- Short (1-2 sentences maximum)
- Creative and original
- Suitable for a productivity dashboard
- Include a realistic author name (famous person or motivational speaker)
- Include a motivational category (like "Success", "Perseverance", "Growth", "Courage", etc.)

Return your response in this exact JSON format:
{
  "quote": "The actual quote text here",
  "author": "Author Name",
  "category": "Category Name"
}

Make sure the quote is fresh, inspiring, and will motivate someone to take action.`;

    // Create chat completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a motivational quote generator. Create inspiring, short, and powerful quotes that motivate people to achieve their goals.'
        },
        {
          role: 'user',
          content: quotePrompt
        }
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Try to parse the JSON response
    try {
      const quoteData = JSON.parse(responseText);
      
      // Validate the response structure
      if (!quoteData.quote || !quoteData.author || !quoteData.category) {
        throw new Error('Invalid response structure');
      }

      return NextResponse.json({
        quote: quoteData.quote,
        author: quoteData.author,
        category: quoteData.category,
        success: true
      });
    } catch (parseError) {
      // If JSON parsing fails, return a fallback quote
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json({
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "Passion",
        success: false
      });
    }

  } catch (error: unknown) {
    console.error('OpenAI API Error:', error);
    
    if (error && typeof error === 'object' && 'status' in error) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }
      
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        );
      }
    }

    // Return a fallback quote on any error
    return NextResponse.json({
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      category: "Perseverance",
      success: false
    });
  }
}

