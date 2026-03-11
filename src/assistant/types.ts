/**
 * Shared types for the AI assistant under test.
 * Designed so a real LLM provider can be plugged in later behind this interface.
 */

export interface AssistantMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AssistantResponse {
  content: string;
  /** Optional: model can signal uncertainty (e.g. "I don't have that information") */
  uncertain?: boolean;
  /** Optional: model refused or safely deflected (e.g. prompt injection) */
  refused?: boolean;
}

export interface AssistantProvider {
  respond(messages: AssistantMessage[]): Promise<AssistantResponse>;
}

export interface EvalContext {
  /** Allowed knowledge for grounding checks (e.g. product docs snippet) */
  allowedContext?: string[];
  /** Forbidden phrases that indicate hallucination or policy violation */
  forbiddenPhrases?: string[];
  /** Phrases that indicate safe fallback (e.g. "I don't know") */
  fallbackPhrases?: string[];
}
