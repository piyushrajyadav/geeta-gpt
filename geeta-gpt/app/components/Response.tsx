'use client';

import { motion } from 'framer-motion';
import { formatResponse } from '../lib/api';
import { saveBookmark } from '../lib/bookmarks';
import Image from 'next/image';
import LoadingAnimation from './LoadingAnimation';
import { useState, useEffect } from 'react';

interface ResponseProps {
  response: string;
  isLoading: boolean;
  error?: string;
  question?: string;
  onRegenerate?: () => void;
}

export default function Response({ response, isLoading, error, question, onRegenerate }: ResponseProps) {
  const [bookmarkSaved, setBookmarkSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveBookmark = () => {
    if (response && question) {
      saveBookmark(question, response);
      setBookmarkSaved(true);
      setTimeout(() => setBookmarkSaved(false), 2000);
    }
  };

  // Simple non-interactive version for SSR
  if (!mounted) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 px-4">
        <div className="bg-background/50 backdrop-blur-sm border border-accent/20 rounded-lg p-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-divine-blue/20"></div>
          <h2 className="text-xl font-bold text-divine-blue mb-2">Ask Lord Krishna</h2>
          <p className="text-accent">
            Seek divine wisdom from the Bhagavad Gita for guidance in your life's journey.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 px-4 flex flex-col items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 px-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-red-800 dark:text-red-300 font-bold mb-2">Divine Connection Interrupted</h3>
          <p className="text-red-700 dark:text-red-200">{error}</p>
          <button 
            onClick={onRegenerate}
            className="mt-4 px-4 py-2 bg-divine-blue text-divine-white rounded-md hover:bg-divine-blue/80"
            suppressHydrationWarning
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 px-4">
        <div className="bg-background/50 backdrop-blur-sm border border-accent/20 rounded-lg p-6 text-center">
          <Image 
            src="/krishna.png" 
            alt="Lord Krishna" 
            width={80} 
            height={80} 
            className="mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-divine-blue mb-2">Ask Lord Krishna</h2>
          <p className="text-accent">
            Seek divine wisdom from the Bhagavad Gita for guidance in your life's journey.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full max-w-3xl mx-auto mt-8 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-background/50 backdrop-blur-sm border border-accent/20 rounded-lg p-6 shadow-md">
        <div className="flex items-center mb-4">
          <Image 
            src="/krishna.png" 
            alt="Lord Krishna" 
            width={40} 
            height={40} 
            className="mr-3 divine-glow rounded-full"
          />
          <h3 className="text-lg font-bold text-divine-blue">Lord Krishna's Wisdom</h3>
        </div>
        
        <div 
          className="prose prose-sm sm:prose max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: formatResponse(response) }}
        />
        
        <div className="flute-divider my-4"></div>
        
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(response);
              alert('Krishna\'s wisdom copied to clipboard!');
            }}
            className="px-3 py-1.5 text-sm bg-accent/10 hover:bg-accent/20 rounded-md flex items-center gap-1"
            aria-label="Copy to clipboard"
            suppressHydrationWarning
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
            </svg>
            Copy
          </button>
          
          <button 
            onClick={handleSaveBookmark}
            className="px-3 py-1.5 text-sm bg-accent/10 hover:bg-accent/20 rounded-md flex items-center gap-1"
            aria-label="Save as bookmark"
            disabled={bookmarkSaved}
            suppressHydrationWarning
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill={bookmarkSaved ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
            {bookmarkSaved ? "Saved" : "Bookmark"}
          </button>
          
          <button 
            onClick={onRegenerate}
            className="px-3 py-1.5 text-sm bg-divine-blue text-divine-white hover:bg-divine-blue/80 rounded-md flex items-center gap-1"
            aria-label="Ask again for a different response"
            suppressHydrationWarning
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Ask Again
          </button>
        </div>
      </div>
    </motion.div>
  );
} 