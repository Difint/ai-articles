/**
 * This is a chat application that uses the Eliza framework to create an AI agent
 * that can communicate through a terminal interface and has access to knowledge base.
 */

//-------------------
// Core Eliza imports
//-------------------
import { AgentRuntime, settings, embed, elizaLogger } from "@elizaos/core";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import { UUID } from "@elizaos/core";
import { DirectClient } from "@elizaos/client-direct";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";

//-------------------
// Node.js built-ins
//-------------------
import { promises as fs } from "fs";
import readline from "readline";
import { join } from 'node:path';

//-------------------
// External packages
//-------------------
import Database from "better-sqlite3";

//-------------------
// Constants
//-------------------
const AGENT_ID: UUID = "Agent" as UUID;  // Unique identifier for our agent
const ROOM_ID: UUID = "terminal" as UUID; // Identifier for the chat room
const SERVER_PORT: number = 3020;         // Port for the direct client server

//-------------------
// Database Setup
//-------------------
// Initialize SQLite database with our adapter
const db = new SqliteDatabaseAdapter(new Database("db.sqlite"));
await db.init();

//-------------------
// Agent Configuration
//-------------------
// Create and configure the main AI agent with necessary settings
const agent = new AgentRuntime({
    databaseAdapter: db,
    agentId: AGENT_ID,
    modelProvider: "groq",
    token: settings.GROQ_API_KEY,
    character: {
        name: AGENT_ID,
        postExamples: [],    // No example posts needed for basic chat
        messageExamples: []  // No example messages needed for basic chat
    },
    plugins: [bootstrapPlugin],  // Basic plugin for agent functionality
    ragOptions: {
        enabled: true,           // Enable Retrieval-Augmented Generation
        matchThreshold: 0.85,    // Minimum similarity score for knowledge matching
        matchCount: 5           // Number of knowledge pieces to retrieve
    }
});

// Initialize the agent
await agent.initialize();

//-------------------
// Terminal Client
//-------------------
/**
 * TerminalClient handles the command-line interface for chatting with the AI agent.
 * It provides a simple text-based interface for sending messages and receiving responses.
 */
export class TerminalClient {
    private rl: readline.Interface;
    private serverPort: number;
    private agentId: UUID;

    constructor(serverPort: number, agentId: UUID) {
        this.serverPort = serverPort;
        this.agentId = agentId;
        // Initialize readline interface for terminal I/O
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    /**
     * Processes user input and sends it to the agent server
     * Handles 'exit' command and displays agent responses
     */
    private async handleUserInput(input: string): Promise<void> {
        // Check for exit command
        if (input.toLowerCase() === "exit") {
            this.rl.close();
            process.exit(0);
        }

        try {
            // Send message to agent server
            const response = await fetch(
                `http://localhost:${this.serverPort}/${this.agentId}/message`,
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

            // Display agent responses
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

    /**
     * Maintains the chat loop, continuously prompting for user input
     */
    private chat(): void {
        this.rl.question("You: ", async (input: string) => {
            await this.handleUserInput(input);
            if (input.toLowerCase() !== 'exit') {
                this.chat();
            }
        });
    }

    /**
     * Starts the terminal client and begins the chat session
     */
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

//-------------------
// Knowledge Management
//-------------------

/**
 * Custom RAG Provider
 * Implements the logic for retrieving relevant knowledge based on user input
 */
const ragProvider = {
    get: async (runtime: AgentRuntime, message: { content: { text: string } }): Promise<string | null> => {
        try {
            // Generate embedding for the user's message
            console.log("Generating embedding for message:", message.content.text);
            const contextEmbedding = await embed(runtime, message.content.text);
            console.log("Generated embedding:", contextEmbedding);
            
            const knowledgeManager = runtime.ragKnowledgeManager;
            console.log("Retrieved knowledge manager");
            
            // Search for relevant knowledge using similarity matching
            console.log("Searching for relevant knowledge with parameters:", {
                agentId: runtime.agentId,
                match_count: 5,
                match_threshold: 0.85
            });
            
            const relevantKnowledge = await knowledgeManager.searchKnowledge({
                agentId: runtime.agentId,
                embedding: contextEmbedding,
                match_count: 5,           // Return top 5 matches
                match_threshold: 0.85     // Minimum similarity score
            });

            // Return null if no relevant knowledge found
            if (!relevantKnowledge || relevantKnowledge.length === 0) {
                console.log("No relevant knowledge found");
                return null;
            }
            
            // Log and return the found knowledge
            console.log("Found relevant knowledge entries:", relevantKnowledge.length);
            elizaLogger.info("Relevant knowledge:");
            elizaLogger.info(relevantKnowledge);
            
            const result = relevantKnowledge
                .map((k: any) => k.content.text)
                .join('\n\n');
            console.log("Returning concatenated knowledge text of length:", result.length);
            
            return result;
        } catch (error) {
            console.error("Error in RAG provider:", error);
            if (error instanceof Error) {
                console.error("Error details:", error.message);
                console.error("Stack trace:", error.stack);
            }
            return null;
        }
    }
};

// // Register RAG provider
agent.providers = agent.providers || [];
agent.providers.push(ragProvider);

/**
 * Document Loader
 * Loads and processes markdown documents into the knowledge base
 */
async function loadDocuments(agent: AgentRuntime, docsPath: string): Promise<void> {
    try {
        const files = await fs.readdir(docsPath);
        
        // Process each markdown file in the directory
        for (const file of files) {
            if (file.endsWith('.md')) {
                const fullPath = join(docsPath, file);
                const content = await fs.readFile(fullPath, 'utf8');
                
                // Add file content to the knowledge base
                await agent.ragKnowledgeManager.processFile({
                    path: file,
                    content: content,
                    type: "md",
                    isShared: true  // Make knowledge available to all agents
                });
                console.log(`Processed ${file}`);
            }
        }
    } catch (error) {
        console.error("Error loading documents:", error);
        throw error;
    }
}

//-------------------
// Application Startup
//-------------------

// Verify API key is present
if (!settings.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set in environment variables");
}

// Get documents path from command line or use current directory
const docsPath = process.argv[2] || "./";

// Load knowledge base from documents
await loadDocuments(agent, docsPath);

//-------------------
// Start Services
//-------------------

// Initialize direct client for handling HTTP requests
const directClient = new DirectClient();
directClient.registerAgent(agent);
directClient.start(SERVER_PORT);

// Start terminal interface
const client = new TerminalClient(SERVER_PORT, AGENT_ID);
client.start();