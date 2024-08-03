import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, SearchIcon } from 'lucide-react';

const ChatPage = () => {
  const [docLink, setDocLink] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching:', { docLink, collectionName, query });
  };

  const handleIngest = () => {
    // Implement document ingestion functionality here
    console.log('Ingesting documents:', { docLink, collectionName });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navigation */}
      <nav className="p-4 bg-black bg-opacity-80 backdrop-filter backdrop-blur-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <SparklesIcon className="mr-2" />
            ClarifyAI
          </Link>
          <Link to="/" className="hover:text-gray-300">Back to Home</Link>
        </div>
      </nav>

      {/* Chat Interface */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Chat with Your Documentation</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <input
              type="text"
              value={docLink}
              onChange={(e) => setDocLink(e.target.value)}
              placeholder="Enter document link"
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Enter collection name"
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="button"
              onClick={handleIngest}
              className="w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-300"
            >
              Ingest Documents
            </button>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about your documentation"
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="w-full p-3 rounded-lg bg-white text-black hover:bg-gray-200 transition duration-300 flex items-center justify-center"
            >
              <SearchIcon className="mr-2" />
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-400">
        <p>&copy; 2024 ClarifyAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ChatPage;