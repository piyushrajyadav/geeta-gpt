import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// List of model names to try in order
const MODEL_NAMES = [
  "gemini-pro",
  "gemini-1.0-pro",
  "gemini-1.5-pro-latest"
];

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

    // Try each model in sequence
    let lastError = null;
    
    for (const modelName of MODEL_NAMES) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent(enhancedPrompt);
        const text = result.response.text();
        
        if (text) {
          console.log(`Successfully generated response with model ${modelName}, length:`, text.length);
          return NextResponse.json({ response: text }, { headers });
        }
      } catch (modelError: Error | unknown) {
        const errorMessage = modelError instanceof Error ? modelError.message : 'Unknown error';
        console.error(`Error with model ${modelName}:`, errorMessage);
        lastError = errorMessage;
      }
    }
    
    // If we get here, all models failed
    return NextResponse.json(
      { error: `Could not generate content with any available model. Last error: ${lastError}` },
      { status: 500, headers }
    );
    
  } catch (error: Error | unknown) {
    const errorDetails = error instanceof Error 
      ? { message: error.message, name: error.name, stack: error.stack }
      : { message: 'Unknown error' };
      
    console.error('Error details:', errorDetails);
    
    return NextResponse.json(
      { error: 'Could not generate response. Please try again.' },
      { status: 500, headers }
    );
  }
} 