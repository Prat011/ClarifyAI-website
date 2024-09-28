import React, { useState, useEffect } from 'react';
import { SparklesIcon, SearchIcon, Loader, KeyIcon, FileIcon } from 'lucide-react';
import axios from 'axios';

const SheetPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [sheetId, setSheetId] = useState('');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupMessage, setSetupMessage] = useState('');

  useEffect(() => {
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setSetupComplete(true);
    }
  }, []);

  const validateSheetId = (id) => {
    // Basic validation: check if it's a string of the correct length
    return typeof id === 'string' && id.length === 44;
  };

  const checkSheetAccess = async (id) => {
    try {
      const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${id}?fields=properties.title`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      return response.data.properties.title ? true : false;
    } catch (error) {
      console.error('Error checking sheet access:', error);
      return false;
    }
  };

  const handleSetup = async () => {
    if (!apiKey) {
      setSetupMessage('API key is required.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API key validation (replace with actual validation if possible)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('apiKey', apiKey);
      setSetupComplete(true);
      setSetupMessage('Setup complete. You can now use the chat.');
    } catch (error) {
      setSetupMessage('Error during setup: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!setupComplete) {
      setSetupMessage('Please complete the setup first.');
      return;
    }

    if (!validateSheetId(sheetId)) {
      setSetupMessage('Invalid Google Sheets ID. Please check and try again.');
      return;
    }

    setIsLoading(true);
    try {
      const isAccessible = await checkSheetAccess(sheetId);
      if (!isAccessible) {
        throw new Error('Unable to access the Google Sheet. Please make sure it\'s public or you have the correct permissions.');
      }

      const response = await axios.post('/sheets_query/', {
        sheet_id: sheetId,
        api_key: apiKey,
        query: query
      });

      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'user', content: query },
        { role: 'assistant', content: response.data.response }
      ]);
      setQuery('');
    } catch (error) {
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'error', content: 'Error: ' + (error.response?.data?.detail || error.message) }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <nav className="p-4 bg-black bg-opacity-80 backdrop-filter backdrop-blur-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold flex items-center">
            <SparklesIcon className="mr-2" />
            AI Google Sheets Assistant
          </div>
        </div>
      </nav>
      
      <div className="flex-grow flex flex-col items-center justify-between p-4">
        <div className="w-full max-w-3xl mb-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Chat with Your Google Sheet</h2>
          
          {!setupComplete && (
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-2">
                <KeyIcon className="text-gray-400" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="flex-grow p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
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
                <p>{message.content}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-3xl">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <FileIcon className="text-gray-400" />
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
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about your Google Sheet"
                className="flex-grow p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                disabled={isLoading || !setupComplete}
                className="p-3 rounded-lg bg-white text-black hover:bg-gray-200 transition duration-300 flex items-center justify-center"
              >
                {isLoading ? <Loader className="animate-spin mr-2" /> : <SearchIcon className="mr-2" />}
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SheetPage;
