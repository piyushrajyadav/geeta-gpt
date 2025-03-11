import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full py-6 px-4 mt-12 border-t border-accent/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Image 
            src="/krishna.png" 
            alt="Lord Krishna" 
            width={30} 
            height={30} 
            className="mr-2"
          />
          <p className="text-sm text-accent">
            Geeta GPT - Divine Wisdom from the Bhagavad Gita
          </p>
        </div>
        
        {/* <div className="flex flex-wrap justify-center gap-4 text-sm text-accent">
          <a href="#" className="hover:text-divine-blue transition-colors">About</a>
          <a href="#" className="hover:text-divine-blue transition-colors">Privacy</a>
          <a href="#" className="hover:text-divine-blue transition-colors">Terms</a>
          <a href="#" className="hover:text-divine-blue transition-colors">Contact</a>
        </div> */}
      </div>
      
      <div className="text-center mt-6 text-xs text-accent/70">
        <p>This is an AI-powered spiritual guidance tool. For serious spiritual or personal concerns, please consult with qualified professionals.</p>
      </div>
    </footer>
  );
} 