'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getApiKey, saveApiKey, countTokens } from '@/lib/anthropic';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function ClaudeTokenCounterPage() {
  const { t } = useI18n();

  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>('claude-3-opus-20240229');
  const [messages, setMessages] = useState<string>('[{"role": "user", "content": "Hello, world"}]');
  const [tools, setTools] = useState<string>('');
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedApiKey = getApiKey();
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    saveApiKey(e.target.value);
  };

  const handleCountTokens = async () => {
    setError(null);
    setTokenCount(null);

    try {
      const parsedMessages = JSON.parse(messages);
      const parsedTools = tools ? JSON.parse(tools) : undefined;
      const count = await countTokens({
        apiKey,
        model,
        messages: parsedMessages,
        tools: parsedTools,
      });
      setTokenCount(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Head>
        <title>Claude Token Counter</title>
      </Head>
      <Card>
        <CardHeader>
          <CardTitle>Claude Token Counter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Anthropic API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter your Anthropic API key"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g., claude-3-opus-20240229"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="messages">Messages (JSON)</Label>
            <Textarea
              id="messages"
              value={messages}
              onChange={(e) => setMessages(e.target.value)}
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tools">Tools (JSON, optional)</Label>
            <Textarea
              id="tools"
              value={tools}
              onChange={(e) => setTools(e.target.value)}
              rows={5}
            />
          </div>
          <Button onClick={handleCountTokens}>Count Tokens</Button>
          {tokenCount !== null && (
            <div className="pt-4">
              <p className="text-lg font-semibold">Token Count: {tokenCount}</p>
            </div>
          )}
          {error && (
            <div className="pt-4">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
