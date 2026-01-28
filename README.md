# Rich Responses

A demonstration of AI-generated, executable user interfaces.

## Why This Exists

Most AI interactions today are limited to plain text conversations. You ask a question, you get text back. But what if AI could respond with something more tangible?

Rich Responses explores this idea by having AI generate actual, working React components instead of just describing them. Instead of getting a paragraph explaining what a login form should look like, you get a functioning login form that renders immediately.

This is about pushing past the text-only constraint and seeing what happens when AI can respond with interactive, executable artifacts.

## What It Does

Rich Responses is a Next.js app where you describe a UI component in plain English, and an AI model generates the React code for it. The component then renders live in your browser.

Here's the flow:
1. Pick an AI model (OpenAI's GPT-4o or Anthropic's Claude)
2. Write a description of what you want ("a pricing table with three tiers")
3. The AI generates React component code with TypeScript and Tailwind CSS
4. The component renders immediately in a sandbox preview

You can copy the generated code and use it in your own projects.

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- OpenAI and Anthropic APIs
- Client-side React rendering in an iframe sandbox

## Getting Started

First, clone the repo and install dependencies:

```bash
git clone <your-repo-url>
cd rich-responses
npm install
```

Create a `.env.local` file with your API keys:

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're good to go.

## Project Structure

```
rich-responses/
├── app/
│   ├── api/generate/
│   │   ├── openai/route.ts      # OpenAI endpoint
│   │   └── anthropic/route.ts   # Anthropic endpoint
│   └── page.tsx                 # Main UI
├── components/
│   ├── code-sandbox.tsx         # Preview renderer
│   └── ui/                      # shadcn components
├── lib/
│   └── prompts.ts              # Shared AI prompt
└── .env.local                  # Your API keys
```

## How It Actually Works

### The Prompt

Both AI models get the same system prompt that tells them to generate React components with TypeScript, use Tailwind for styling, and keep things self-contained. The prompt explicitly says "no explanations, just code."

This is in `lib/prompts.ts` so both models stay consistent.

### Code Processing

The generated code gets cleaned up before rendering:
- Import statements are stripped out (the sandbox provides its own)
- Export statements get removed
- Special characters are escaped so they don't break the template

### The Sandbox

Components render in an iframe that loads React, ReactDOM, and Babel from CDNs. Babel transpiles the JSX on the fly. We provide stub implementations of common shadcn components so the generated code doesn't need to actually import them.

The sandbox scans for any function with a capital letter name and tries to render it. If it finds one, great. If not, it shows an error.

### Security

API keys never touch the client—they stay on the server in the API routes. The iframe runs with sandbox restrictions. No eval or Function constructors anywhere.

## What This Demonstrates

This project is really about proving a point: AI doesn't have to be limited to text chat. It can generate artifacts—code, UIs, interactive experiences—that you can actually use.

Some specific things worth noting:

**Prompt Engineering** - Getting consistent, high-quality output requires a well-crafted system prompt. Small changes make a big difference.

**Safe Code Execution** - Running user-generated (or in this case, AI-generated) code in the browser is tricky. Iframes with sandbox attributes help a lot.

**Real-time Transpilation** - Babel in the browser is surprisingly practical for this kind of thing. It's heavy, but it works.

**Component Stubbing** - You can fake imports by providing stub implementations in the execution context. Not perfect, but good enough for a demo.

## Ideas for Later

Some things that could make this better:

- Let users iterate on components with follow-up prompts
- Add an editor so you can tweak the generated code
- Export directly to CodeSandbox or StackBlitz
- Build a gallery of past generations
- Support more AI providers
- Allow custom component library imports

## Contributing

If you want to experiment with this or take it further, feel free. The whole point is exploring what's possible when AI generates interactive stuff instead of just text.


Built with ❤️ by Danilo and (surprisingly) Github Copilot CLI - which is getting smarter every day.
