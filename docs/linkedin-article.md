# How I Learned to Stop Chasing the "Right" Answer and Start Testing What Actually Matters

*LinkedIn article — brief, B2 English. You can paste this into LinkedIn Article or use it as a long post.*

---

You know that feeling when you ask an AI assistant something and you get a different answer every time? For a while I thought that meant we couldn’t really test it. Turns out we can — we just had to stop looking for one perfect reply and start checking the things that really matter.

Here’s what I mean.

## It’s Not About One Correct Sentence

When we test a normal feature, we often compare the result to one expected value. With an AI, the same question can get many valid answers. So instead of “does it say exactly this?” we ask: “does it behave in a way we can trust?”

I focused on four things:

**Grounding** — Does it stick to what we gave it (e.g. our docs) and avoid making things up?  
**Fallback** — When it doesn’t know, does it say so instead of guessing?  
**Safety** — Does it refuse or deflect when someone tries to trick it or ask for something harmful?  
**Consistency** — Do similar questions get answers that don’t contradict each other?

These are things we can actually check in code. No need to judge every word — we define what “good” looks like and we automate the checks.

## Why This Felt Like a Win

I put together a small open project to try this in practice. TypeScript, Playwright, and a mock assistant so everything runs without calling a real AI. The interesting part: we run the same tests against a “good” mock (that follows the rules) and a “bad” one (that hallucinates, doesn’t fall back, doesn’t refuse). When the bad mock fails the tests, we know our evals are doing their job. So when you plug in a real assistant later, you’re not just hoping — you’re checking.

If you work in QA or product and you’re starting to test AI features, this might give you a clear place to start. The same ideas work for chatbots, copilots, or any assistant that has to be useful, safe, and honest.

What would you add to your own checklist for testing AI in your product? I’d love to hear what matters most in your context.

---

*Link to repo in comments. Hashtags: #AITesting #QA #TestAutomation #Playwright #QualityEngineering*
