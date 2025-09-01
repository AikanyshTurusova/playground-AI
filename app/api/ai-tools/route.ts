import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-your-api-key-here', // Replace with your actual API key
});

export async function POST(request: NextRequest) {
  try {
    const { tool, prompt, context, options } = await request.json();

    if (!tool || !prompt) {
      return NextResponse.json(
        { error: 'Tool type and prompt are required' },
        { status: 400 }
      );
    }

    let systemPrompt = '';
    let userPrompt = prompt;

    switch (tool) {
      case 'content-generator':
        systemPrompt = `You are an expert content creator and writer. Create high-quality, engaging content based on the user's request. 
        Focus on being informative, well-structured, and engaging. Use appropriate tone and style for the content type requested.`;
        break;

      case 'code-assistant':
        systemPrompt = `You are an expert software developer and programming tutor. Help users with code-related questions, 
        debugging, best practices, and explanations. Provide clear, well-commented code examples and explain your reasoning. 
        Always consider security, performance, and maintainability in your suggestions.`;
        break;

      case 'business-analyzer':
        systemPrompt = `You are a business consultant and market analyst with expertise in business strategy, market research, 
        and competitive analysis. Provide insightful analysis, identify opportunities and risks, and offer actionable recommendations. 
        Use data-driven insights and industry best practices.`;
        break;

      case 'document-processor':
        systemPrompt = `You are an expert at analyzing and extracting insights from documents and text. 
        Provide clear summaries, identify key points, extract actionable insights, and organize information logically. 
        Be thorough but concise in your analysis.`;
        break;

      case 'creative-writer':
        systemPrompt = `You are a creative writer and storyteller. Generate engaging, imaginative content including stories, 
        scenarios, creative ideas, and artistic descriptions. Be original, engaging, and adapt your style to the requested format.`;
        break;

      case 'language-translator':
        systemPrompt = `You are a professional translator and language expert. Provide accurate, contextually appropriate translations. 
        Maintain the tone, style, and cultural nuances of the original text. Explain any cultural or linguistic considerations when relevant.`;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid tool type specified' },
          { status: 400 }
        );
    }

    // Add context if provided
    if (context) {
      userPrompt = `Context: ${context}\n\nRequest: ${prompt}`;
    }

    // Add specific instructions based on tool type
    if (options?.format) {
      userPrompt += `\n\nPlease format the response as: ${options.format}`;
    }

    if (options?.tone) {
      userPrompt += `\n\nPlease use a ${options.tone} tone.`;
    }

    if (options?.length) {
      userPrompt += `\n\nPlease keep the response approximately ${options.length} words.`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: options?.maxTokens || 1000,
      temperature: options?.temperature || 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'No response generated';

    return NextResponse.json({
      success: true,
      tool,
      response,
      usage: completion.usage,
      model: completion.model
    });

  } catch (error) {
    console.error('AI Tools API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI tool request' },
      { status: 500 }
    );
  }
}
