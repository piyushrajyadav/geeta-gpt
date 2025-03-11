import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative w-16 h-16"
      >
        <Image
          src="/peacock-feather.png"
          alt="Loading"
          fill
          className="object-contain"
        />
      </motion.div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mt-4 text-accent text-sm"
      >
        Seeking divine wisdom...
      </motion.p>
    </div>
  );
} 