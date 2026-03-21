# AI Tutorial Assistant

Status: **Planning** — saved for future implementation.

## What it does

A conversational assistant embedded in the tutorial that answers accessibility questions grounded in WCAG 2.1/2.2, ARIA Authoring Practices, and the tutorial's own content. It cites specific success criteria, techniques, and tutorial pages rather than giving generic advice.

## Knowledge sources

1. **Tutorial content** — The MDX pages already indexed by Pagefind. Could reuse the same index or build a separate vector store from the MDX source files.
2. **WCAG 2.1/2.2** — Success criteria, understanding docs, and techniques. Available as structured HTML from W3C.
3. **ARIA Authoring Practices Guide (APG)** — Patterns, examples, and decision trees for widget roles.

> **Open question — copyright:** Before indexing WCAG or APG content, confirm that doing so for this use case does not overstep W3C copyright or licensing terms. The W3C Document License permits reproduction, but the specifics of indexing for an AI tool-use lookup need review.

## Architecture options

### Option A: RAG with Claude API

- Embed the knowledge sources into a vector store (e.g., chunks of MDX + WCAG + APG).
- On each question, retrieve relevant chunks and send them as context to Claude.
- Pros: answers are grounded, citable, and up to date with tutorial content.
- Cons: requires a vector store service and an API key with usage costs.

### Option B: Claude API with tool use

- Give Claude tools to search the tutorial (reuse Pagefind or a server-side search) and look up WCAG criteria by number.
- The model decides when to call tools vs. answer from its training knowledge.
- Pros: simpler infrastructure, no vector store needed.
- Cons: tool calls add latency, less control over grounding.

### Option C: Pre-built solution (e.g., Vercel AI SDK)

- Use the Vercel AI SDK's `useChat` hook with a streaming API route.
- Combine with either RAG or tool use on the server side.
- Pros: handles streaming UI, conversation state, and edge deployment out of the box.
- Cons: ties you to a specific framework.

### Current preference: Hybrid tool use

Use tool use as the primary approach, with a free-text search tool for fuzzy lookups. See detailed design below.

## UI integration

- A collapsible side panel accessible from any tutorial page.
- The assistant knows which tutorial page the user is currently on (passed as context).
- Responses include links to relevant tutorial pages and WCAG success criteria.
- Chat history stored in session storage — no persistence needed.
- No login required; access controlled by feature flag and tokens.

## Accessibility of the assistant itself

- Chat input with proper label and `aria-live` region for responses.
- Keyboard-navigable conversation history.
- Screen reader announcements for new messages.
- Respects `prefers-reduced-motion` for any animations.
- Clear focus management when opening/closing the panel.

## Content safety guardrails

- System prompt scopes answers to accessibility topics only.
- Responses cite sources — no unsourced claims about compliance.
- Disclaimer that the assistant provides guidance, not legal advice.
- Rate limiting to manage API costs.

## Grounding tool-use answers in standards

The risk with tool use is the model answering from training knowledge instead of calling tools. This is solved with a strong system prompt and well-designed tools.

### System prompt strategy

- Instruct the model to always cite specific WCAG success criteria by number (e.g., 1.4.3) and link to the understanding doc.
- Require it to search the tutorial before answering tutorial-related questions.
- Tell it to say "I don't have information on that" rather than speculate outside its tools.

### Tools to give the model

1. **`search_tutorial`** — Searches the tutorial content (reuse Pagefind's Node API or a server-side index). Returns page title, URL, and relevant excerpt.
2. **`lookup_wcag_criterion`** — Takes a success criterion number (e.g., "1.4.3") and returns the criterion text, level, understanding doc summary, and sufficient techniques. Built from the WCAG structured data (the W3C publishes it as JSON/XML).
3. **`search_wcag`** — Free-text search over WCAG understanding docs for cases where the user describes a problem without knowing the criterion number.
4. **`search_aria_patterns`** — Searches the APG patterns by widget name or role. Returns the pattern description, required roles/states/properties, and keyboard interaction spec.

### Why tool use grounds better than RAG for this case

- RAG retrieves chunks based on embedding similarity — it can miss relevant standards if the user's phrasing doesn't match well.
- Tool use lets Claude reason about *which* standard applies, then look it up precisely.
- The model can chain calls: search tutorial → find a related WCAG criterion mentioned on that page → look up the full criterion details.

### Hybrid approach

- Use tool use as the primary approach.
- Add `search_wcag` as a free-text tool (backed by a small search index over WCAG understanding docs) for cases where the user describes a problem without knowing the criterion number.
- This gives precise lookup *and* fuzzy search.

## Access control and feature flags

### Token-based access (lightweight approach)

- Generate short-lived tokens (UUID + expiry) stored in a simple KV store (Vercel KV, or even an environment variable with a list of active tokens).
- Share tokens as URL params: `?assistant=abc123` — the client stores it in session storage.
- The API route validates the token before processing requests.
- Usage tracking per token for free (log token + timestamp + question count).

### Feature flag options

- **Simple:** Environment variable `NEXT_PUBLIC_ASSISTANT_ENABLED` controls whether the panel renders at all. For workshops, deploy with it on; for the public site, leave it off.
- **Per-audience:** Issue different tokens for different workshops or people. The API route can log which token is being used, giving a sense of who's active without building a full auth system.
- **Rate limiting:** Apply per-token rate limits in the API route (e.g., 20 questions per hour per token). Vercel KV or an in-memory counter works for this scale.

## Architecture diagram

```
Tutorial Page
  └─ Side panel (client component, renders only if token is valid)
       └─ useChat (Vercel AI SDK) → POST /api/assistant
                                        ├─ Validate token
                                        ├─ Rate limit check
                                        ├─ System prompt (grounding rules)
                                        └─ Claude API with tools:
                                             ├─ search_tutorial
                                             ├─ lookup_wcag_criterion
                                             ├─ search_wcag (free text)
                                             └─ search_aria_patterns
```

## Key decisions to make

1. **Copyright review** — Confirm W3C licensing allows indexing WCAG/APG content for tool-use lookup in this context.
2. **WCAG data format** — Build a JSON lookup file from the W3C source, or use a lightweight search index? JSON lookup is simpler for criterion-by-number; search index handles "what criterion covers color contrast?" better. Both is probably the answer.
3. **Model choice** — Haiku 4.5 would be fast and cheap for a demo/workshop context. Sonnet if answer quality is the priority.
4. **Token distribution** — Manual (generate and share via email/Slack) or self-serve (a simple form that emails for approval)?
5. **Vercel AI SDK** — Evaluate whether it fits or if a lighter custom approach is better.
