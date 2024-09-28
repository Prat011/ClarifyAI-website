import React, { useState } from 'react';
import { SparklesIcon, SearchIcon, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SheetPage = () => {
  const [sheetId, setSheetId] = useState('');
  const [query, setQuery] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!sheetId || !query || !apiKey) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('https://prat0-clarifapi.hf.space/sheets_query/', {
        sheet_id: sheetId,
        query: query,
        api_key: apiKey
      });

      console.log('Response:', response.data);

      if (response.data && response.data.response) {
        setMessages(prevMessages => [
          ...prevMessages,
          { role: 'user', content: query },
          { role: 'assistant', content: response.data.response.response || 'No response content' }
        ]);
        setQuery('');
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.response?.data || error.message || 'An error occurred while processing your query.');
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
                {message.role === 'assistant' ? (
                  <ReactMarkdown 
                    className="font-league-spartan prose prose-invert max-w-none"
                    remarkPlugins={[remarkGfm]}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p className="font-league-spartan">{message.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-3xl space-y-4">
          <input
            type="text"
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
            placeholder="Enter Google Sheet ID"
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter OpenAI API Key"
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
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
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : <SearchIcon className="mr-2" />}
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SheetPage;