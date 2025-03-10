'use client';

import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [prompt, setPrompt] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  if (!mounted) {
    // Return a non-interactive version for SSR
    return (
      <div className="w-full max-w-3xl mx-auto mt-6 px-4">
        <div className="relative">
          <div className="w-full p-4 pr-16 rounded-full border border-accent/30 bg-background/80 backdrop-blur-sm shadow-md">
            Ask Lord Krishna for guidance...
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-divine-blue text-divine-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </div>
        </div>
        <div className="text-center mt-3 text-sm text-accent/70">
          <p>Ask about dharma, purpose, emotions, relationships, or any life guidance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 px-4">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Lord Krishna for guidance..."
          className="w-full p-4 pr-16 rounded-full border border-accent/30 bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-divine-gold/50 shadow-md"
          disabled={isLoading}
          suppressHydrationWarning
        />
        
        <motion.button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-divine-blue text-divine-white hover:bg-divine-blue/80 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!prompt.trim() || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          suppressHydrationWarning
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-divine-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          )}
        </motion.button>
      </form>
      
      <div className="text-center mt-3 text-sm text-accent/70">
        <p>Ask about dharma, purpose, emotions, relationships, or any life guidance</p>
      </div>
    </div>
  );
} 