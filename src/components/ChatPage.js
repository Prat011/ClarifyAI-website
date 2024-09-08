import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, SearchIcon, Loader, ToggleLeft, ToggleRight } from 'lucide-react';
import axios from 'axios';
import { Analytics } from "@vercel/analytics/react";

const ChatPage = () => {
  const [docLink, setDocLink] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [query, setQuery] = useState('');
  const [setupComplete, setSetupComplete] = useState(false);
  const [messages, setMessages] = useState([]);
  const [setupMessage, setSetupMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useAgentSearch, setUseAgentSearch] = useState(false);

  useEffect(() => {
    const clearChatHistory = async () => {
      try {
        await axios.post('https://prat0-clarifapi.hf.space/clear-chat/');
        setMessages([]);
      } catch (error) {
        console.error('Error clearing chat history:', error);
      }
    };
    clearChatHistory();
  }, []);

  useEffect(() => {
    if (useAgentSearch) {
      setSetupMessage('Agent search is enabled. No setup required.');
      setSetupComplete(true);
    } else {
      setSetupComplete(false);
      setSetupMessage('');
    }
  }, [useAgentSearch]);

  const handleSetup = async () => {
    if (useAgentSearch) {
      setSetupMessage('Agent search is enabled. No setup required.');
      setSetupComplete(true);
      return;
    }

    if (!collectionName) {
      setSetupMessage('Collection name is required.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('https://prat0-clarifapi.hf.space/setup/', {
        url: docLink || '',
        collection_name: collectionName
      });
      setSetupMessage(response.data.message);
      setSetupComplete(true);
    } catch (error) {
      setSetupMessage('Error during setup: ' + error.response?.data?.detail || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!setupComplete && !useAgentSearch) {
      setSetupMessage('Please complete the setup first.');
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (useAgentSearch) {
        response = await axios.post('https://prat0-clarifapi.hf.space/agent-search/', { query });
      } else {
        response = await axios.post('https://prat0-clarifapi.hf.space/query/', { query });
      }
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'user', content: query },
        { role: 'assistant', content: response.data.response }
      ]);
      setQuery('');
    } catch (error) {
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'error', content: 'Error: ' + error.response?.data?.detail || error.message }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <nav className="p-4 bg-black bg-opacity-80 backdrop-filter backdrop-blur-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <SparklesIcon className="mr-2" />
            ClarifyAI
          </Link>
          <Link to="/" className="hover:text-gray-300">Back to Home</Link>
        </div>
      </nav>
      
      <div className="flex-grow flex flex-col items-center justify-between p-4">
        <div className="w-full max-w-3xl mb-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Chat with Your Documentation</h2>
          
          <div className="flex items-center space-x-2 mb-4">
            {useAgentSearch ? (
              <ToggleRight
                className="cursor-pointer text-blue-500"
                onClick={() => setUseAgentSearch(false)}
              />
            ) : (
              <ToggleLeft
                className="cursor-pointer text-gray-500"
                onClick={() => setUseAgentSearch(true)}
              />
            )}
            <span>Use Agent Search</span>
          </div>

          {!setupComplete && !useAgentSearch && (
            <div className="space-y-4 mb-8">
              <input
                type="text"
                value={docLink}
                onChange={(e) => setDocLink(e.target.value)}
                placeholder="Enter document link (optional)"
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <input
                type="text"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="Collection name (required)"
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                onClick={handleSetup}
                disabled={isLoading}
                className="w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-300 flex items-center justify-center"
              >
                {isLoading ? <Loader className="animate-spin mr-2" /> : null}
                Setup
              </button>
            </div>
          )}
          
          {setupMessage && (
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              {setupMessage}
            </div>
          )}

          <div className="space-y-4 mb-8 max-h-[60vh] overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className={`p-3 rounded-lg ${message.role === 'assistant' ? 'bg-gray-800' : 'bg-gray-700'}`}>
                <p className="font-league-spartan">{message.content}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-3xl">
          <div className="flex space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={useAgentSearch ? "Enter a search query" : "Query the documentation"}
              className="flex-grow p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-3 rounded-lg bg-white text-black hover:bg-gray-200 transition duration-300 flex items-center justify-center"
            >
              {isLoading ? <Loader className="animate-spin mr-2" /> : <SearchIcon className="mr-2" />}
              Search
            </button>
          </div>
        </form>
      </div>
      <Analytics />
    </div>
  );
};

export default ChatPage;
