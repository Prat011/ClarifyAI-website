import React, { useState } from 'react';
import { SparklesIcon, SearchIcon, Loader, KeyIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Analytics } from "@vercel/analytics/react";

const SheetPage = () => {
  const [sheetId, setSheetId] = useState('');
  const [query, setQuery] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateSheetId = (id) => {
    return typeof id === 'string' && id.length === 44;
  };

  const validateApiKey = (key) => {
    return typeof key === 'string' && key.startsWith('sk-') && key.length === 51;
  };

  const checkSheetAccess = async (id) => {
    try {
      const response = await axios.get(`https://spreadsheets.google.com/feeds/worksheets/${id}/public/basic?alt=json`);
      return response.status === 200;
    } catch (error) {
      console.error('Error checking sheet access:', error);
      return false;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateSheetId(sheetId)) {
      setErrorMessage('Invalid Google Sheets ID. Please check and try again.');
      return;
    }

    if (!validateApiKey(apiKey)) {
      setErrorMessage('Invalid OpenAI API Key. Please check and try again.');
      return;
    }

    setIsLoading(true);
    try {
      const isAccessible = await checkSheetAccess(sheetId);
      if (!isAccessible) {
        throw new Error('Unable to access the Google Sheet. Please make sure it\'s public.');
      }

      // Call the API to process the query
      const response = await axios.post('/sheets_query/', {
        sheet_id: sheetId,
        query: query,
        api_key: apiKey
      });

      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'user', content: query },
        { role: 'assistant', content: response.data.response }
      ]);
      setQuery('');
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || error.message || 'An error occurred while processing your query.');
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
            AI Sheets Assistant
          </Link>
          <Link to="/" className="hover:text-gray-300">Back to Home</Link>
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center justify-between p-4">
        <div className="w-full max-w-3xl mb-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Chat with Your Google Sheet</h2>

          {errorMessage && (
            <div className="mb-4 p-3 bg-gray-800 rounded-lg text-red-500">
              {errorMessage}
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

        <form onSubmit={handleSearch} className="w-full max-w-3xl space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              placeholder="Enter Google Sheet ID"
              className="flex-grow p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div className="flex space-x-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter OpenAI API Key"
              className="flex-grow p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about your Google Sheet"
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

export default SheetPage;
