import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { countTokens } from '@/lib/anthropic';

const ClaudeTokenCounter = () => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('claude-3-sonnet-20240229');
  const [messages, setMessages] = useState(JSON.stringify([{ role: 'user', content: "What's the weather like in San Francisco?" }], null, 2));
  const [tools, setTools] = useState(JSON.stringify([{
    name: "get_weather",
    description: "Get the current weather in a given location",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA",
        }
      },
      required: ["location"],
    }
  }], null, 2));
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('anthropicApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleCountTokens = async () => {
    try {
      localStorage.setItem('anthropicApiKey', apiKey);
      const parsedMessages = JSON.parse(messages);
      const parsedTools = JSON.parse(tools);
      const response = await countTokens(apiKey, model, parsedMessages, parsedTools);
      setTokenCount(response.input_tokens);
      setError('');
    } catch (err: any) {
      setError(err.message);
      setTokenCount(null);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <Head>
        <title>Claude Token Counter</title>
      </Head>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Claude Token Counter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Anthropic API key"
            />
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g., claude-3-sonnet-20240229"
            />
          </div>
          <div>
            <Label htmlFor="messages">Messages (JSON)</Label>
            <textarea
              id="messages"
              value={messages}
              onChange={(e) => setMessages(e.target.value)}
              className="w-full h-32 p-2 border rounded"
              placeholder="Enter messages in JSON format"
            />
          </div>
          <div>
            <Label htmlFor="tools">Tools (JSON)</Label>
            <textarea
              id="tools"
              value={tools}
              onChange={(e) => setTools(e.target.value)}
              className="w-full h-48 p-2 border rounded"
              placeholder="Enter tools in JSON format"
            />
          </div>
          <Button onClick={handleCountTokens} className="w-full">
            Count Tokens
          </Button>
          {tokenCount !== null && (
            <div className="p-4 bg-green-100 rounded">
              <p className="font-bold">Token Count: {tokenCount}</p>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-100 rounded">
              <p className="font-bold text-red-600">Error: {error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaudeTokenCounter;
