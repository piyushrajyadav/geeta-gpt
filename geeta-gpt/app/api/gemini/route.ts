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

    // Direct API call to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: enhancedPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      
      return NextResponse.json(
        { error: `API Error: ${errorData.error?.message || 'Unknown error'}` },
        { status: 500, headers }
      );
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data).substring(0, 200) + '...');
    
    // Extract the text from the response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      console.error('No text in response:', data);
      return NextResponse.json(
        { error: 'Empty response from API. Please try again.' },
        { status: 500, headers }
      );
    }
    
    console.log('Successfully generated response, length:', text.length);
    return NextResponse.json({ response: text }, { headers });
    
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