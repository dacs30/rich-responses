'use server';

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '@/lib/prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function generateWithAnthropic(prompt: string): Promise<{ code?: string; error?: string }> {
  if (!prompt) {
    return { error: 'Prompt is required' };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: 'Anthropic API key not configured' };
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const code = message.content[0].type === 'text' ? message.content[0].text : '';
    return { code };
  } catch (error: unknown) {
    console.error('Anthropic API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to generate code' };
  }
}

export async function generateWithOpenAI(prompt: string): Promise<{ code?: string; error?: string }> {
  if (!prompt) {
    return { error: 'Prompt is required' };
  }

  if (!process.env.OPENAI_API_KEY) {
    return { error: 'OpenAI API key not configured' };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-5.2',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    const code = completion.choices[0]?.message?.content || '';
    return { code };
  } catch (error: unknown) {
    console.error('OpenAI API error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to generate code' };
  }
}
