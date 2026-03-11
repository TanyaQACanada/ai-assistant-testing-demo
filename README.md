# AI Assistant Testing Demo

A small public project that shows how to test AI assistant behavior at the API level. It uses **TypeScript** and **Playwright** as the test runner, with a deterministic mock assistant so everything runs without any real LLM or private data.

## What this repo demonstrates

Testing an AI assistant is not about one "correct" answer. It is about:

- **Grounding** — The assistant answers only from allowed context and does not invent facts.
- **Fallback** — When it does not know something, it says so clearly instead of guessing.
- **Safety** — It refuses or deflects harmful or policy-breaking requests (e.g. prompt injection).
- **Consistency** — Similar questions get compatible answers (e.g. same policy, same numbers).

This repo implements simple evaluation contracts and assertions for these four areas, plus a mock assistant that returns fixed responses so tests are stable and safe to run anywhere.

## Proving the evals really evaluate responses

We do not use a real AI API by default, so how do you know the tests actually catch bad behavior?

1. **Good mock** — The main tests use a “good” mock assistant that returns correct, grounded, safe responses. All four evals **pass**.
2. **Bad mock** — We also ship a “bad” mock that intentionally returns wrong behavior (hallucination, no fallback, no refusal, wrong facts). The **same evals** run against this bad assistant, and they **correctly fail** (the test suite expects those failures and passes when the evals catch them).

So when you run `npm test` you see 8 tests: 4 that pass with the good assistant and 4 that pass because the evals caught the bad assistant. That shows the evaluation logic really does distinguish good from bad AI responses. You can reuse the same assertions with a real LLM (e.g. behind an `AssistantProvider`) to evaluate your own model or API.

## Quick start

```bash
npm install
npm test
```

## Project structure

- `src/assistant/` — Assistant interface and mock implementation.
- `src/evals/` — Evaluation scenarios and assertion helpers (grounding, fallback, safety, consistency).
- `tests/` — Playwright specs that run the evals.
- `fixtures/` — Small public-safe prompt/response dataset.
- `docs/` — Article draft, LinkedIn post, and technical walkthrough.

## Running against a real AI API (optional)

The same evals can run against a real model. Implement the `AssistantProvider` interface from `src/assistant/types.ts`: call your API (e.g. OpenAI, Anthropic), map the result to `{ content, uncertain?, refused? }`, and pass that provider into the tests instead of `createMockAssistant()`. The assertions stay the same. See `docs/project-walkthrough.md` for the interface and how to plug in a provider.

## License

MIT.
