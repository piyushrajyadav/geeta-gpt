interface Bookmark {
  id: string;
  question: string;
  response: string;
  timestamp: number;
}

// Save a response as a bookmark
export function saveBookmark(question: string, response: string): Bookmark {
  const bookmarks = getBookmarks();
  
  const newBookmark: Bookmark = {
    id: generateId(),
    question,
    response,
    timestamp: Date.now()
  };
  
  bookmarks.push(newBookmark);
  localStorage.setItem('krishna_bookmarks', JSON.stringify(bookmarks));
  
  return newBookmark;
}

// Get all bookmarks
export function getBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return [];
  
  const bookmarksJson = localStorage.getItem('krishna_bookmarks');
  if (!bookmarksJson) return [];
  
  try {
    return JSON.parse(bookmarksJson);
  } catch (error) {
    console.error('Error parsing bookmarks:', error);
    return [];
  }
}

// Delete a bookmark by ID
export function deleteBookmark(id: string): boolean {
  const bookmarks = getBookmarks();
  const filteredBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
  
  if (filteredBookmarks.length === bookmarks.length) {
    return false; // No bookmark was deleted
  }
  
  localStorage.setItem('krishna_bookmarks', JSON.stringify(filteredBookmarks));
  return true;
}

// Generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
} 