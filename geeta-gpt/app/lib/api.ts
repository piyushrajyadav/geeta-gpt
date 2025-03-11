'use client';

/**
 * Sends a prompt to the Gemini API and returns the response
 * @param prompt The user's question to Lord Krishna
 * @returns The response from Lord Krishna based on Bhagavad Gita
 */
export async function askKrishna(prompt: string): Promise<{ response: string; error?: string }> {
  try {
    console.log('Sending request to API with prompt length:', prompt.length);
    
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout (increased from 30)

    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
      cache: 'no-store' // Ensure we don't use cached responses
    });

    clearTimeout(timeoutId);
    
    console.log('API response status:', response.status);

    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = 'Failed to get response from Lord Krishna';
      
      try {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        errorMessage = errorData.error || errorMessage;
      } catch (jsonError) {
        console.error('Failed to parse error response:', jsonError);
      }
      
      return { 
        response: '', 
        error: errorMessage
      };
    }

    // Parse the successful response
    try {
      const data = await response.json();
      console.log('Received response data:', !!data, 'has response:', !!data.response);
      
      if (!data.response) {
        return {
          response: '',
          error: 'Received empty response from Lord Krishna. Please try again.'
        };
      }
      
      return { response: data.response };
    } catch (jsonError) {
      console.error('Failed to parse success response:', jsonError);
      return {
        response: '',
        error: 'Failed to process response from Lord Krishna. Please try again.'
      };
    }
  } catch (error) {
    console.error('Error asking Krishna:', error);
    
    // Check if it's an abort error (timeout)
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { 
        response: '', 
        error: 'The request took too long to complete. Please try again.' 
      };
    }
    
    return { 
      response: '', 
      error: 'Could not connect to Lord Krishna at this moment. Please try again later.' 
    };
  }
}

/**
 * Formats the response text to properly display Sanskrit shlokas
 * @param text The response text from the API
 * @returns Formatted HTML content with proper styling
 */
export function formatResponse(text: string): string {
  if (!text) return '';
  
  // Replace *shloka* with styled spans for Sanskrit text
  let formattedText = text.replace(
    /\*(.*?)\*/g, 
    '<span class="sanskrit-text italic text-divine-gold">$1</span>'
  );
  
  // Add paragraph breaks
  formattedText = formattedText.replace(/\n\n/g, '</p><p>');
  
  // Highlight chapter and verse references
  formattedText = formattedText.replace(
    /(Chapter \d+, Verse \d+)/gi,
    '<span class="font-bold text-divine-saffron">$1</span>'
  );
  
  return `<p>${formattedText}</p>`;
} 