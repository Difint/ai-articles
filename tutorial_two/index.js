// Step 1: Import required packages
import { AgentRuntime, settings } from "@elizaos/core"; //use settings to load from .env
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import { DirectClient } from "@elizaos/client-direct";
import Database from "better-sqlite3";
import readline from "readline";

// Step 2: Basic configuration
const SERVER_PORT = 3000;
const AGENT_ID = "Agent";

// create action

const generateImageAction = {
  name: "SAY_PONG",
  similes: ["PING", "ECHO"], 
  description: "When asked to ping, respond with pong",
  examples: [
    // Basic ping example
    [
      {
        user: "user1",
        content: {
          text: "ping"
        }
      },
      {
        user: "bot",
        content: {
          text: "Pong",
          action: "SAY_PONG",
          params: {}
        }
      }
    ],
    // Echo example
    [
      {
        user: "user1", 
        content: {
          text: "echo"
        }
      },
      {
        user: "bot",
        content: {
          text: "Pong",
          action: "SAY_PONG",
          params: {}
        }
      }
    ]
  ],
  async validate(runtime, message) {
      return true;
  },

  async handler(runtime, message, state, options, callback) {
    console.log("SAY_PONG");
    callback?.(
          {
              text: "Callback pong"
          },
          [],
      );

    return message
  }
};
// Step 3: Setup database
const db = new SqliteDatabaseAdapter(new Database("db.sqlite"));
await db.init();

// Step 4: Create and initialize agent
const agent = new AgentRuntime({
  databaseAdapter: db,
  agentId: AGENT_ID,
  modelProvider: "groq",
  token: settings.GROQ_API_KEY,
  character: {
    model: "groq",
    // Keep it simple for now
    postExamples: [],
    messageExamples: []
  },
  actions: [generateImageAction]
});

await agent.initialize();

// Step 5: Setup direct client for communication
const directClient = new DirectClient();
directClient.registerAgent(agent);
directClient.start(SERVER_PORT);

// Step 6: Setup chat interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Step 7: Handle user messages
async function handleUserInput(input) {
  if (input.toLowerCase() === "exit") {
    rl.close();
    process.exit(0);
  }

  try {
    const response = await fetch(
      `http://localhost:${SERVER_PORT}/${AGENT_ID}/message`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          userId: "user",
          userName: "User",
        }),
      }
    );

    const data = await response.json();
    data.forEach((message) => console.log(`${AGENT_ID}: ${message.text}`));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Step 8: Start the chat loop
console.log("Chat with your agent! Type 'exit' to quit.");

function chat() {
  rl.question("You: ", async (input) => {
    await handleUserInput(input);
    if (input.toLowerCase() !== "exit") {
      chat();
    }
  });
}

chat();

