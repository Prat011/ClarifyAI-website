import React, { useState } from 'react';
import { SparklesIcon, SearchIcon, Loader, FileIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SheetPage = () => {
  const [sheetId, setSheetId] = useState('');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateSheetId = (id) => {
    return typeof id === 'string' && id.length === 44;
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

    setIsLoading(true);
    try {
      const isAccessible = await checkSheetAccess(sheetId);
      if (!isAccessible) {
        throw new Error('Unable to access the Google Sheet. Please make sure it\'s public.');
      }

      // Call the API to process the query
      const response = await axios.post('/sheets_query/', {
        sheet_id: sheetId,
        query: query
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
      <nav className="bg-black shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <SparklesIcon className="h-8 w-8 text-white" />
                <span className="ml-2 text-2xl font-bold text-white">AI Sheets Assistant</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Chat with Your Google Sheet</h1>

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="p-6 max-h-96 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 p-3 rounded-lg ${
                  message.role === 'assistant' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="sheetId" className="block text-sm font-medium text-gray-700">Google Sheet ID</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="sheetId"
                  value={sheetId}
                  onChange={(e) => setSheetId(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter Google Sheet ID"
                />
              </div>
            </div>
            <div>
              <label htmlFor="query" className="block text-sm font-medium text-gray-700">Your Query</label>
              <div className="mt-1">
                <input
                  type="text"
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Ask about your Google Sheet"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? (
                  <Loader className="animate-spin h-5 w-5 mr-3" />
                ) : (
                  <SearchIcon className="h-5 w-5 mr-2" />
                )}
                Search
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SheetPage;
