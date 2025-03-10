import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Use the environment variable for the API key
const API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Gemini client if API key is available
let genAI: GoogleGenerativeAI | null = null;
try {
  if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    console.log('Gemini client initialized successfully');
  } else {
    console.error('GEMINI_API_KEY is not set in environment variables');
  }
} catch (error) {
  console.error('Error initializing Gemini client:', error);
}

export async function POST(request: NextRequest) {
  // Check if Gemini client is initialized
  if (!genAI) {
    console.error('Gemini client is not initialized');
    return NextResponse.json(
      { error: 'API configuration error. Please try again later.' },
      { status: 500 }
    );
  }

  try {
    // Parse the request body
    const { prompt } = await request.json();
    
    // Ensure prompt is provided
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Valid prompt is required' },
        { status: 400 }
      );
    }

    // Log the API key length for debugging (don't log the actual key)
    console.log('API Key length:', API_KEY?.length);
    console.log('Prompt received, length:', prompt.length);

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

    try {
      console.log("Attempting to use gemini-pro model...");
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });
      
      // Generate content
      console.log("Generating content...");
      const result = await model.generateContent(enhancedPrompt);
      console.log("Content generated, getting response...");
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        console.error('Empty response received from Gemini API');
        throw new Error('Empty response from Gemini API');
      }
      
      console.log("Successfully generated response, length:", text.length);
      return NextResponse.json({ response: text });
      
    } catch (apiError) {
      console.error('Gemini API Error:', apiError);
      
      return NextResponse.json(
        { error: 'Could not generate response. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request processing error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
} 