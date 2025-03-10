'use client';

/**
 * Sends a prompt to the Gemini API and returns the response
 * @param prompt The user's question to Lord Krishna
 * @returns The response from Lord Krishna based on Bhagavad Gita
 */
export async function askKrishna(prompt: string): Promise<{ response: string; error?: string }> {
  try {
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return { 
        response: '', 
        error: errorData.error || 'Failed to get response from Lord Krishna' 
      };
    }

    const data = await response.json();
    
    if (!data.response) {
      return {
        response: '',
        error: 'Received empty response from Lord Krishna. Please try again.'
      };
    }
    
    return { response: data.response };
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