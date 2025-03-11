'use client';

import { useState, useEffect } from 'react';
import { getBookmarks, deleteBookmark } from '../lib/bookmarks';
import { motion, AnimatePresence } from 'framer-motion';
import { formatResponse } from '../lib/api';

interface Bookmark {
  id: string;
  question: string;
  response: string;
  timestamp: number;
}

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBookmarks(getBookmarks());
  }, []);

  const handleDelete = (id: string) => {
    if (deleteBookmark(id)) {
      setBookmarks(getBookmarks());
    }
  };

  if (!mounted) {
    return null; // Don't render anything on the server side
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-divine-blue text-divine-white p-3 rounded-full shadow-lg hover:bg-divine-blue/80"
        aria-label="Toggle bookmarks"
        suppressHydrationWarning
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-4 w-96 max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-sm border border-accent/20 rounded-lg shadow-xl"
          >
            <div className="p-4">
              <h3 className="text-lg font-bold text-divine-blue mb-4">Saved Wisdom</h3>
              
              {bookmarks.length === 0 ? (
                <p className="text-accent text-center py-4">No bookmarks saved yet</p>
              ) : (
                <div className="space-y-4">
                  {bookmarks.map((bookmark) => (
                    <motion.div
                      key={bookmark.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-background/50 border border-accent/10 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm text-accent">{bookmark.question}</p>
                        <button
                          onClick={() => handleDelete(bookmark.id)}
                          className="text-red-500 hover:text-red-600"
                          aria-label="Delete bookmark"
                          suppressHydrationWarning
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div
                        className="prose prose-sm max-w-none text-foreground"
                        dangerouslySetInnerHTML={{ __html: formatResponse(bookmark.response) }}
                      />
                      
                      <div className="text-xs text-accent/60 mt-2">
                        {new Date(bookmark.timestamp).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 