import React, { useState } from 'react';
import { ChatAnthropic } from "@langchain/anthropic";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { LangchainToolSet } from 'composio-core';
import { ChatPromptTemplate } from "@langchain/core/prompts";


const AnthropicChatInterface = () => {
  const [anthropicApiKey, setAnthropicApiKey] = useState('');
  const [composioApiKey, setComposioApiKey] = useState('');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnthropicApiKeyChange = (e) => {
    setAnthropicApiKey(e.target.value);
  };

  const handleComposioApiKeyChange = (e) => {
    setComposioApiKey(e.target.value);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!anthropicApiKey || !composioApiKey || !query) return;

    setIsLoading(true);
    try {
      const model = new ChatAnthropic({ anthropicApiKey: anthropicApiKey });
      const toolset = new LangchainToolSet({ apiKey: composioApiKey });

      const tools = await toolset.getTools({ apps: ["exa","tavily"] });
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful assistant"],
        ["placeholder", "{chat_history}"],
        ["human", "{input}"],
        ["placeholder", "{agent_scratchpad}"],
      ]);
      const executor = await createToolCallingAgent(
        tools,
        model,
        prompt
      );

      const result = await executor.invoke({ input: query });

      setResponse(result.output);
      setChatHistory([...chatHistory, { query, response: result.output }]);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred. Please try again.');
    }
    setIsLoading(false);
    setQuery('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Chat Interface (Anthropic with COMPOSIO)</h1>
      <div className="mb-4">
        <input
          type="password"
          value={anthropicApiKey}
          onChange={handleAnthropicApiKeyChange}
          placeholder="Enter Anthropic API Key"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="password"
          value={composioApiKey}
          onChange={handleComposioApiKeyChange}
          placeholder="Enter COMPOSIO API Key"
          className="w-full p-2 border rounded"
        />
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Enter your query"
            className="flex-grow p-2 border rounded-l"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white p-2 rounded-r"
          >
            {isLoading ? 'Loading...' : 'Send'}
          </button>
        </div>
      </form>
      <div className="border p-4 rounded h-64 overflow-y-auto">
        {chatHistory.map((chat, index) => (
          <div key={index} className="mb-2">
            <p className="font-bold">You: {chat.query}</p>
            <p>AI: {chat.response}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnthropicChatInterface;