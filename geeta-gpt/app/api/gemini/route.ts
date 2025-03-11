import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS request for CORS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers });
  }

  try {
    // Get API key from environment or use fallback for testing
    const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyD5LTWZrdO7gDCADu4mwaELKPQsId4mbLo';
    
    // Check if API key is available
    if (!API_KEY) {
      console.error('No API key available');
      return NextResponse.json(
        { error: 'API configuration error. Please try again later.' },
        { status: 500, headers }
      );
    }

    // Parse the request body
    const { prompt } = await request.json();
    
    // Ensure prompt is provided
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Valid prompt is required' },
        { status: 400, headers }
      );
    }

    // Log debugging information
    console.log('API Key is present and length:', API_KEY.length);
    console.log('Prompt received, length:', prompt.length);

    // Create a new instance of the Gemini API for each request
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Prepare the prompt for the Gemini API
    const enhancedPrompt = `
You are Lord Krishna providing divine wisdom based on the Bhagavad Gita.

Answer the following question with deep spiritual insight, compassion, and wisdom.
Include at least one relevant Sanskrit shloka (verse) from the Bhagavad Gita with its 
chapter and verse number, followed by its translation and explanation.

Format your response with the shloka in italics, clearly separated from the explanation.

Begin your response with a warm, divine greeting and end with a blessing.

Question: ${prompt}
`.trim();

    // Create a simple model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate content
    console.log("Generating content...");
    
    try {
      const result = await model.generateContent(enhancedPrompt);
      const text = result.response.text();
      
      if (!text) {
        console.error('Empty response received from Gemini API');
        return NextResponse.json(
          { error: 'Empty response from Gemini API. Please try again.' },
          { status: 500, headers }
        );
      }
      
      console.log("Successfully generated response, length:", text.length);
      return NextResponse.json({ response: text }, { headers });
    } catch (modelError: any) {
      console.error('Model error:', modelError.message);
      return NextResponse.json(
        { error: 'Error generating content: ' + modelError.message },
        { status: 500, headers }
      );
    }
    
  } catch (error: any) {
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { error: 'Could not generate response. Please try again.' },
      { status: 500, headers }
    );
  }
} 