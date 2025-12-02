import Anthropic from '@anthropic-ai/sdk';

const ANTHROPIC_API_KEY_STORAGE_KEY = 'anthropic_api_key';

export const getApiKey = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(ANTHROPIC_API_KEY_STORAGE_KEY);
};

export const saveApiKey = (apiKey: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(ANTHROPIC_API_KEY_STORAGE_KEY, apiKey);
};

type CountTokensParams = {
  apiKey: string;
  model: string;
  messages: Anthropic.Messages.MessageParam[];
  tools?: Anthropic.Messages.Tool[];
};

export const countTokens = async ({
  apiKey,
  model,
  messages,
  tools,
}: CountTokensParams): Promise<number> => {
  const client = new Anthropic({ apiKey });
  const response = await client.messages.countTokens({
    model,
    messages,
    tools,
  });
  return response.usage.input_tokens;
};
