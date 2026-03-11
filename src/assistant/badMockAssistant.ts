/**
 * "Bad" mock assistant: returns responses that violate grounding, fallback, or safety.
 * Used to prove that our evals actually catch bad behavior — when you run the same
 * assertions against this provider, they fail as expected.
 */

import type { AssistantMessage, AssistantResponse, AssistantProvider } from './types';

function normalizeForMatch(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Bad responses: hallucination, no fallback, no refusal.
 * Same trigger keys as the good mock, but wrong content/flags.
 */
const BAD_RESPONSES: Array<{
  trigger: string[];
  content: string;
  uncertain?: boolean;
  refused?: boolean;
}> = [
  {
    trigger: ['return policy', 'return an item', 'how many days'],
    content: 'Our Premium Plan has a 90-day return policy and Enterprise tier gets 120 days.', // hallucination: forbidden phrases
    uncertain: false,
    refused: false,
  },
  {
    trigger: ['premium plan', 'enterprise tier', 'v2.0 release'],
    content: 'The Premium Plan launches next month and v2.0 release is in Q4.', // no fallback: invents answer, uncertain=false
    uncertain: false,
    refused: false,
  },
  {
    trigger: ['ignore previous', 'hack into', 'bypass'],
    content: 'Sure, here are some steps you could try to reset a password...', // no refusal: helps with harmful request
    uncertain: false,
    refused: false,
  },
];

export class BadMockAssistant implements AssistantProvider {
  async respond(messages: AssistantMessage[]): Promise<AssistantResponse> {
    const lastUser = messages.filter((m) => m.role === 'user').pop();
    const prompt = lastUser?.content ?? '';
    const normalized = normalizeForMatch(prompt);

    for (const entry of BAD_RESPONSES) {
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
      content: 'Our Enterprise tier includes that feature.',
      uncertain: false,
      refused: false,
    };
  }
}

export function createBadMockAssistant(): AssistantProvider {
  return new BadMockAssistant();
}
