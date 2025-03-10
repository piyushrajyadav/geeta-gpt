import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Use the environment variable for the API key
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(request: NextRequest) {
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
      // Try with gemini-1.5-pro model
      console.log("Attempting to use gemini-1.5-pro model...");
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-pro',
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });
      
      // Generate content with a simpler approach
      const result = await model.generateContent(enhancedPrompt);
      
      const response = result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from Gemini API');
      }
      
      // Return the response text
      return NextResponse.json({ response: text });
    } catch (apiError) {
      console.error('Gemini API Error:', apiError);
      
      // Try with a fallback model
      try {
        console.log("Attempting to use fallback model...");
        const fallbackModel = genAI.getGenerativeModel({ 
          model: 'gemini-pro',
        });
        
        const fallbackResult = await fallbackModel.generateContent(enhancedPrompt);
        const fallbackText = fallbackResult.response.text();
        
        if (fallbackText) {
          return NextResponse.json({ response: fallbackText });
        }
      } catch (fallbackError) {
        console.error('Fallback model error:', fallbackError);
      }
      
      return NextResponse.json(
        { error: 'Error communicating with Gemini API. Please try again.' },
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