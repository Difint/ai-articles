// Importing Eliza specific packages
import { AgentRuntime } from "@elizaos/core";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import { DirectClient } from "@elizaos/client-direct";
//--------------------------
//Importing core plugins
// import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
// import { createNodePlugin } from "@elizaos/plugin-node"

//--------------------------
// Importing external packages
import Database from "better-sqlite3";
import readline from "readline";

//--------------------------

// Creating basic connections
const SERVER_PORT = 3000;
const AGENT_ID = "Agent";

const db = new SqliteDatabaseAdapter(new Database("db.sqlite"));
await db.init();

// //Creating agent runtime
const agent = new AgentRuntime({
  databaseAdapter: db,
  agentId: AGENT_ID
});

await agent.initialize();

//Direct client
const directClient = new DirectClient();
directClient.registerAgent(agent);

directClient.start(SERVER_PORT);

//--------------------------------
//Creating chat interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Handling Ctrl+C to exit the chat
rl.on("SIGINT", () => {
  rl.close();
  process.exit(0);
});

//--------------------------------
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
    console.error("Error fetching response:", error);
  }
}

console.log("Welcome to Eliza chat! Type 'exit' to leave.");
//Actual chat
function chat() {
  rl.question("You: ", async (input) => {
    await handleUserInput(input);
    if (input.toLowerCase() !== "exit") {
      chat(); // Loop back to ask another question
    }
  });
}

chat()

