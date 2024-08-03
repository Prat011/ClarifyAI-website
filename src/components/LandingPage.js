import React, { useState, useEffect } from 'react';
import { TerminalIcon, BookOpenIcon, CodeIcon, SparklesIcon, ChevronDownIcon, MessageSquareIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('hero');

  const sections = ['hero', 'features', 'cta'];

  const scrollTo = (section) => {
    setActiveSection(section);
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-4 z-50 bg-black bg-opacity-80 backdrop-filter backdrop-blur-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <SparklesIcon className="mr-2" />
            ClarifyAI
          </h1>
          <div className="space-x-4">
            <button onClick={() => scrollTo('hero')} className={`hover:text-gray-300 ${activeSection === 'hero' ? 'text-gray-300' : ''}`}>Home</button>
            <button onClick={() => scrollTo('features')} className={`hover:text-gray-300 ${activeSection === 'features' ? 'text-gray-300' : ''}`}>Features</button>
            <Link to="/chat" className="hover:text-gray-300">Chat</Link>
            <a href="https://dub.sh/clarifyai" target="_blank" rel="noopener noreferrer" className="bg-white text-black hover:bg-gray-200 font-bold py-2 px-4 rounded-full transition duration-300">
              Use App
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-5xl font-bold mb-4">Be the programmer you've always wanted to be</h2>
          <p className="text-xl mb-8">Unlock your full potential with AI-powered software documentation assistance</p>
          <div className="space-x-4">
            <a href="https://dub.sh/clarifyai" target="_blank" rel="noopener noreferrer" className="bg-white text-black hover:bg-gray-200 font-bold py-3 px-8 rounded-full text-lg transition duration-300 inline-block">
              Use App
            </a>
            <button onClick={() => scrollTo('features')} className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold py-3 px-8 rounded-full text-lg transition duration-300">
              Learn More
            </button>
          </div>
        </div>
        <ChevronDownIcon 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" 
          size={32} 
          onClick={() => scrollTo('features')}
        />
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Empower Your Programming Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<TerminalIcon size={48} />}
              title="Master Complex Codebases"
              description="Navigate and understand intricate software documentation with ease."
            />
            <FeatureCard
              icon={<BookOpenIcon size={48} />}
              title="Accelerate Learning"
              description="Grasp new concepts quickly with interactive, AI-guided exploration."
            />
            <FeatureCard
              icon={<CodeIcon size={48} />}
              title="Boost Productivity"
              description="Get instant answers and code examples to speed up your development process."
            />
          </div>
        </div>
        <ChevronDownIcon 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" 
          size={32} 
          onClick={() => scrollTo('cta')}
        />
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-8">Ready to elevate your programming skills?</h2>
          <a href="https://dub.sh/clarifyai" target="_blank" rel="noopener noreferrer" className="bg-white text-black hover:bg-gray-200 font-bold py-3 px-8 rounded-full text-lg transition duration-300 inline-block">
            Start Using ClarifyAI Now
          </a>
          <p className="mt-8">&copy; 2024 ClarifyAI. Empowering programmers to reach new heights.</p>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition duration-300">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

export default LandingPage;