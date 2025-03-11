'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import Response from './components/Response';
import Footer from './components/Footer';
import Bookmarks from './components/Bookmarks';
import { askKrishna } from './lib/api';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [question, setQuestion] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (prompt: string) => {
    setIsLoading(true);
    setError('');
    setQuestion(prompt);
    
    try {
      const result = await askKrishna(prompt);
      
      if (result.error) {
        setError(result.error);
      } else {
        setResponse(result.response);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (question) {
      handleSubmit(question);
    }
  };

  // Simple non-interactive version for SSR
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="w-24 h-24 rounded-full bg-divine-blue/20"></div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-divine-blue mb-2">
                <span className="text-divine-saffron">Geeta</span> GPT
              </h1>
              <p className="text-accent max-w-2xl mx-auto">
                Seek divine wisdom from Lord Krishna based on the timeless teachings of the Bhagavad Gita.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <Image 
                src="/krishna.png" 
                alt="Lord Krishna" 
                fill
                className="divine-glow rounded-full object-cover"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-divine-blue mb-2">
              <span className="text-divine-saffron">Geeta</span> GPT
            </h1>
            <p className="text-accent max-w-2xl mx-auto">
              Seek divine wisdom from Lord Krishna based on the timeless teachings of the Bhagavad Gita.
              Ask any question about life, purpose, duty, or spiritual growth.
            </p>
          </motion.div>
          
          <Response 
            response={response} 
            isLoading={isLoading} 
            error={error}
            question={question}
            onRegenerate={handleRegenerate}
          />
          
          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </main>
      
      <Footer />
      {mounted && <Bookmarks />}
    </div>
  );
}
