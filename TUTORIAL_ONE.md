# The Simplest AI Agent

In this tutorial, we'll create a basic AI agent from scratch. While AI agents might seem magical, they're just programs with special capabilities. We'll build one step by step to understand how they work.

## Prerequisites
- Node.js installed on your computer
- Basic understanding of JavaScript
- A code editor (like VS Code)
- pnpm (faster version of NPM)

## Step 1: Project Setup

1. Create a new folder for your project:
```bash
mkdir my-first-agent
cd my-first-agent
```

2. Initialize a new Node.js project:
```bash
npm init -y
```

3. Create two new files:
```bash
touch index.js
touch db.sqlite
```

4. Open package.json and replace its content with:
```json
{
  "name": "eliza_from_scratch",
  "version": "0.0.1",
  "description": "Sample ElizaAI agent from scratch",
  "type": "module",
  "license": "MIT",
  "main": "index.js",
  "scripts": {  
    "start": "node index.js"
  },
  "dependencies": {
    "@elizaos/adapter-sqlite": "0.1.8", 
    "@elizaos/client-direct": "0.1.7", 
    "@elizaos/core": "0.1.8", 
    "@elizaos/plugin-bootstrap": "0.1.8", 
    "@elizaos/plugin-node": "0.1.7",
    "better-sqlite3": "11.6.0",
    "@tavily/core": "*",
    "readline": "*"
  }
}
```

5. Install the dependencies:
```bash
pnpm install
```

## Step 2: Creating the Agent

Open `index.js` and let's build our agent step by step:

1. First, add the necessary imports:
```javascript
import { AgentRuntime } from "@elizaos/core";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import { DirectClient } from "@elizaos/client-direct";
import Database from "better-sqlite3";
import readline from "readline";
```

2. Set up basic configuration:
```javascript
const SERVER_PORT = 3000;
const AGENT_ID = "Agent";
```

3. Initialize the database:
```javascript
const db = new SqliteDatabaseAdapter(new Database("db.sqlite"));
await db.init();
```

4. Create the agent:
```javascript
const agent = new AgentRuntime({
  databaseAdapter: db,
  agentId: AGENT_ID,
  modelProvider: "groq",
  token: "", // We'll add the token in the next tutorial
  character: {
    model: "groq",
    postExamples: [],
    messageExamples: []
  }
});

await agent.initialize();
```

5. Set up the communication client:
```javascript
const directClient = new DirectClient();
directClient.registerAgent(agent);
directClient.start(SERVER_PORT);
```

6. Create the chat interface:
```javascript
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
```

The complete code is available in the index.js file. To run your agent:

```bash
npm start
```

Dont forget to insert your API key that you could get at Groq.com for free
You should see a prompt where you can chat with your agent. Type 'exit' to quit.

## What's Happening?

Let's break down what we've built:

1. **Database Setup**: We use SQLite to store the agent's memory
2. **Agent Runtime**: The core of our AI agent, handling all the basic operations
3. **Direct Client**: Manages communication between you and the agent, starting web server for communications
4. **Chat Interface**: A simple command-line interface to talk with your agent


