/**
 * Deterministic mock AI assistant for demo and tests.
 * Returns fixed responses for known prompts so the repo is stable and public-safe.
 * A real LLM can be plugged in later via the AssistantProvider interface.
 */

import type { AssistantMessage, AssistantResponse, AssistantProvider } from './types';

/** Map of normalized prompt snippets to deterministic responses (public-safe, fictional) */
const MOCK_RESPONSES: Array<{
  trigger: string[];
  content: string;
  uncertain?: boolean;
  refused?: boolean;
}> = [
  {
    trigger: ['return policy', 'return an item', 'how many days'],
    content: 'Our product TaskFlow has a 30-day return policy. For support, contact support@example.com.',
    uncertain: false,
    refused: false,
  },
  {
    trigger: ['premium plan', 'enterprise tier', 'v2.0 release'],
    content: "I don't have that information in my current context. Please check our help docs or contact support.",
    uncertain: true,
    refused: false,
  },
  {
    trigger: ['ignore previous', 'hack into', 'bypass'],
    content: "I can't help with that. I'm here to answer questions about our product within my guidelines.",
    uncertain: false,
    refused: true,
  },
];

function normalizeForMatch(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

export class MockAssistant implements AssistantProvider {
  async respond(messages: AssistantMessage[]): Promise<AssistantResponse> {
    const lastUser = messages.filter((m) => m.role === 'user').pop();
    const prompt = lastUser?.content ?? '';
    const normalized = normalizeForMatch(prompt);

    for (const entry of MOCK_RESPONSES) {
      const matches = entry.trigger.some((t) => normalized.includes(normalizeForMatch(t)));
      if (matches) {
        return {
          content: entry.content,
          uncertain: entry.uncertain,
          refused: entry.refused,
        };
      }
    }

    return {
      content: "I'm not sure how to help with that. Can you rephrase or ask about our product?",
      uncertain: true,
      refused: false,
    };
  }
}

export function createMockAssistant(): AssistantProvider {
  return new MockAssistant();
}
