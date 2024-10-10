import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ChatPage from './components/ChatPage';
import SheetPage from './components/SheetPage';
import AnthropicChatInterface from './components/ChatAnthropicPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/sheet" element={<SheetPage />} />
        <Route path="/claude" element={<AnthropicChatInterface/>}/>
      </Routes>
    </Router>
  );
};

export default App;
