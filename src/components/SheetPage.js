import React, { useState, useEffect } from 'react';
import { SparklesIcon, SearchIcon, Loader, FileIcon, LogInIcon, LogOutIcon } from 'lucide-react';
import axios from 'axios';

const SheetPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [sheetId, setSheetId] = useState('');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('/api/check-session', { withCredentials: true });
      setIsLoggedIn(response.data.isLoggedIn);
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/api/login', { apiKey }, { withCredentials: true });
      setIsLoggedIn(true);
      setApiKey('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Login failed. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const validateSheetId = (id) => {
    return typeof id === 'string' && id.length === 44;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setErrorMessage('Please log in first.');
      return;
    }

    if (!validateSheetId(sheetId)) {
      setErrorMessage('Invalid Google Sheets ID. Please check and try again.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/process', {
        sheet_id: sheetId,
        query: query
      }, { withCredentials: true });

      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'user', content: query },
        { role: 'assistant', content: response.data.response }
      ]);
      setQuery('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error: ' + (error.response?.data?.detail || error.message));
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
          {isLoggedIn && (
            <button onClick={handleLogout} className="flex items-center">
              <LogOutIcon className="mr-2" />
              Logout
            </button>
          )}
        </div>
      </nav>
      
      <div className="flex-grow flex flex-col items-center justify-between p-4">
        <div className="w-full max-w-3xl mb-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Chat with Your Google Sheet</h2>
          
          {!isLoggedIn ? (
            <form onSubmit={handleLogin} className="space-y-4 mb-8">
              <div className="flex items-center space-x-2">
                <LogInIcon className="text-gray-400" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="flex-grow p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-300 flex items-center justify-center"
              >
                {isLoading ? <Loader className="animate-spin mr-2" /> : <LogInIcon className="mr-2" />}
                Login
              </button>
            </form>
          ) : (
            <>
              <div className="space-y-4 mb-8 max-h-[60vh] overflow-y-auto">
                {messages.map((message, index) => (
                  <div key={index} className={`p-3 rounded-lg ${message.role === 'assistant' ? 'bg-gray-800' : 'bg-gray-700'}`}>
                    <p>{message.content}</p>
                  </div>
                ))}
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
                      disabled={isLoading}
                      className="p-3 rounded-lg bg-white text-black hover:bg-gray-200 transition duration-300 flex items-center justify-center"
                    >
                      {isLoading ? <Loader className="animate-spin mr-2" /> : <SearchIcon className="mr-2" />}
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
          
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-800 rounded-lg">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SheetPage;
