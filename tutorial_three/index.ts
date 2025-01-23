// Importing Eliza specific packages
import { AgentRuntime, settings, RAGKnowledgeManager, embed } from "@elizaos/core";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import { promises as fs } from "fs";
import readline from "readline";
import { stringToUuid, UUID } from "@elizaos/core";
import { DirectClient } from "@elizaos/client-direct";
import { TelegramClientInterface } from "@elizaos/client-telegram";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import { elizaLogger } from "@elizaos/core";
import { join } from 'node:path';


//--------------------------
// Importing external packages
import Database from "better-sqlite3";

//--------------------------

// Constants
const AGENT_ID: UUID = "Agent" as UUID;
const ROOM_ID: UUID = "terminal" as UUID;
const SERVER_PORT: number = 3020;

// Database initialization
const db = new SqliteDatabaseAdapter(new Database("db.sqlite"));
await db.init();


// Agent runtime configuration
const agent = new AgentRuntime({
    databaseAdapter: db,
    agentId: AGENT_ID,
    modelProvider: "groq",
    token: settings.GROQ_API_KEY,
    character: {
        name: AGENT_ID,
        postExamples: [],
        messageExamples: []
    },
    plugins: [bootstrapPlugin],
    ragOptions: {
        enabled: true,
        matchThreshold: 0.85,
        matchCount: 5
    }
});

await agent.initialize();

import readline from "readline";
import { UUID } from "@elizaos/core";

export class TerminalClient {
    private rl: readline.Interface;
    private serverPort: number;
    private agentId: UUID;

    constructor(serverPort: number, agentId: UUID) {
        this.serverPort = serverPort;
        this.agentId = agentId;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    private async handleUserInput(input: string): Promise<void> {
        if (input.toLowerCase() === "exit") {
            this.rl.close();
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
                        roomId: ROOM_ID
                    }),
                }
            );

            const data = await response.json();
            data.forEach((message: { text: string }) => 
                console.log(`${this.agentId}: ${message.text}`)
            );
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error:", error.message);
            } else {
                console.error("Unknown error occurred");
            }
        }
    }

    private chat(): void {
        this.rl.question("You: ", async (input: string) => {
            await this.handleUserInput(input);
            if (input.toLowerCase() !== 'exit') {
                this.chat();
            }
        });
    }

    public start(): void {
        try {
            console.log("\nChat with your agent! Type 'exit' to quit.");
            this.chat();
        } catch (error) {
            console.error("Error starting terminal client:", error);
            process.exit(1);
        }
    }
} 
// Initialize RAG manager
const ragManager: RAGKnowledgeManager = agent.ragKnowledgeManager;

// Custom RAG Provider
const ragProvider = {
    get: async (runtime: AgentRuntime, message: { content: { text: string } }): Promise<string | null> => {
        try {
            const contextEmbedding = await embed(runtime, message.content.text);
            const knowledgeManager = runtime.ragKnowledgeManager;
            
            const relevantKnowledge = await knowledgeManager.searchKnowledge({
                agentId: runtime.agentId,
                embedding: contextEmbedding,
                match_count: 5,
                match_threshold: 0.85
            });

            if (!relevantKnowledge || relevantKnowledge.length === 0) {
                return null;
            }
            
            elizaLogger.info("Relevant knowledge:");
            elizaLogger.info(relevantKnowledge);
            return relevantKnowledge
                .map((k: any) => k.content.text)
                .join('\n\n');
        } catch (error) {
            console.error("Error in RAG provider:", error);
            return null;
        }
    }
};

// Document loader function
async function loadDocuments(agent: AgentRuntime, docsPath: string): Promise<void> {
    try {
        const files = await fs.readdir(docsPath);
        
        for (const file of files) {
            if (file.endsWith('.md')) {
                const fullPath = join(docsPath, file);
                const content = await fs.readFile(fullPath, 'utf8');
                
                await agent.ragKnowledgeManager.processFile({
                    path: file,
                    content: content,
                    type: "md",
                    isShared: true
                });
                console.log(`Processed ${file}`);
            }
        }
    } catch (error) {
        console.error("Error loading documents:", error);
        throw error;
    }
}

// Running agent
if (!settings.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set in environment variables");
}


// Load documents from the specified path
const docsPath = process.argv[2] || "./";

await loadDocuments(agent, docsPath);

// Start terminal client

// Direct client setup
const directClient = new DirectClient();
directClient.registerAgent(agent);
directClient.start(SERVER_PORT);

const client = new TerminalClient(agent);
client.start();