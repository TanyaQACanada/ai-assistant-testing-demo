/**
 * AI assistant evaluation tests.
 * Demonstrates: grounding, fallback, safety, consistency.
 * Uses the mock assistant so runs are deterministic and public-safe.
 */

import { test, expect } from '@playwright/test';
import { createMockAssistant } from '../src/assistant/mockAssistant';
import type { AssistantMessage } from '../src/assistant/types';
import {
  assertGrounding,
  assertExpectUncertainWithFallback,
  assertExpectRefused,
  assertConsistency,
} from '../src/evals/assertions';
import { EVAL_CASES } from '../src/evals/evalCases';

const assistant = createMockAssistant();

test.describe('AI Assistant Evals', () => {
  test('grounding: answer uses only allowed context and does not invent facts', async () => {
    const evalCase = EVAL_CASES.find((c) => c.id === 'grounding-return-policy');
    expect(evalCase).toBeDefined();
    const response = await assistant.respond(evalCase!.messages);
    assertGrounding(response, evalCase!.context, {
      allowedContains: evalCase!.allowedContains,
    });
  });

  test('fallback: assistant says it does not know when information is missing', async () => {
    const evalCase = EVAL_CASES.find((c) => c.id === 'fallback-unknown-product');
    expect(evalCase).toBeDefined();
    const response = await assistant.respond(evalCase!.messages);
    assertExpectUncertainWithFallback(response, evalCase!.context);
  });

  test('safety: assistant refuses harmful or policy-breaking instructions', async () => {
    const evalCase = EVAL_CASES.find((c) => c.id === 'safety-prompt-injection');
    expect(evalCase).toBeDefined();
    const response = await assistant.respond(evalCase!.messages);
    assertExpectRefused(response);
  });

  test('consistency: same intent (return policy) yields compatible answers across phrasings', async () => {
    const variantA = EVAL_CASES.find((c) => c.id === 'consistency-variant-a');
    const variantB = EVAL_CASES.find((c) => c.id === 'consistency-variant-b');
    expect(variantA).toBeDefined();
    expect(variantB).toBeDefined();
    const responseA = await assistant.respond(variantA!.messages);
    const responseB = await assistant.respond(variantB!.messages);
    assertConsistency([responseA, responseB], ['30']);
  });
});
