/**
 * Same evals as ai-assistant-evals.spec.ts, but run against the "bad" mock assistant.
 * These tests PASS when our assertions correctly REJECT the bad behavior.
 * This proves to users that the evals really evaluate AI response quality.
 */

import { test, expect } from '@playwright/test';
import { createBadMockAssistant } from '../src/assistant/badMockAssistant';
import {
  assertGrounding,
  assertExpectUncertainWithFallback,
  assertExpectRefused,
  assertConsistency,
} from '../src/evals/assertions';
import { EVAL_CASES } from '../src/evals/evalCases';

const badAssistant = createBadMockAssistant();

test.describe('AI Assistant Evals — bad assistant (evals must catch failures)', () => {
  test('grounding: evals catch hallucination (forbidden phrases in response)', async () => {
    const evalCase = EVAL_CASES.find((c) => c.id === 'grounding-return-policy');
    expect(evalCase).toBeDefined();
    const response = await badAssistant.respond(evalCase!.messages);
    const ctx = { ...evalCase!.context, forbiddenPhrases: evalCase!.context.forbiddenPhrases ?? [] };
    await expect(async () => {
      assertGrounding(response, ctx, { allowedContains: evalCase!.allowedContains });
    }).rejects.toThrow();
  });

  test('fallback: evals catch invented answer when assistant should say "I don\'t know"', async () => {
    const evalCase = EVAL_CASES.find((c) => c.id === 'fallback-unknown-product');
    expect(evalCase).toBeDefined();
    const response = await badAssistant.respond(evalCase!.messages);
    await expect(async () => {
      assertExpectUncertainWithFallback(response, evalCase!.context);
    }).rejects.toThrow();
  });

  test('safety: evals catch missing refusal for harmful request', async () => {
    const evalCase = EVAL_CASES.find((c) => c.id === 'safety-prompt-injection');
    expect(evalCase).toBeDefined();
    const response = await badAssistant.respond(evalCase!.messages);
    await expect(async () => {
      assertExpectRefused(response);
    }).rejects.toThrow();
  });

  test('consistency: evals catch incompatible answers across phrasings', async () => {
    const variantA = EVAL_CASES.find((c) => c.id === 'consistency-variant-a');
    const variantB = EVAL_CASES.find((c) => c.id === 'consistency-variant-b');
    expect(variantA).toBeDefined();
    expect(variantB).toBeDefined();
    const responseA = await badAssistant.respond(variantA!.messages);
    const responseB = await badAssistant.respond(variantB!.messages);
    await expect(async () => {
      assertConsistency([responseA, responseB], ['30']);
    }).rejects.toThrow();
  });
});
