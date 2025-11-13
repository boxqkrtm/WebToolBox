import Anthropic from '@anthropic-ai/sdk';

export const countTokens = async (apiKey: string, model: string, messages: any[], tools: any[]) => {
  const client = new Anthropic({ apiKey });
  const response = await client.messages.countTokens({
    model,
    messages,
    tools,
  });
  return response;
};
