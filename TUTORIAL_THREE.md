# Tutorial Three: Building a RAG-Enabled Chat Agent

In this tutorial, we'll create an advanced chat application that uses Retrieval-Augmented Generation (RAG) to enhance the AI's responses with knowledge from markdown documents. This builds upon the previous tutorials by adding document processing and knowledge retrieval capabilities.

## Prerequisites

- Node.js  or higher
- pnpm package manager
- GROQ API key
- Basic understanding of TypeScript
- Familiarity with async/await and promises

## Project Setup

1. Create a new directory and initialize the project:

```bash
mkdir tutorial-three
cd tutorial-three
pnpm init
```

2. Install the required dependencies:

```bash
pnpm install @elizaos/adapter-sqlite @elizaos/client-direct @elizaos/core @elizaos/plugin-bootstrap better-sqlite3 readline express socket.io
```

3. Copy the environment file and add your GROQ API key:

```bash
cp .env.example .env
```

Edit `.env` and add your GROQ API key:
```
GROQ_API_KEY=your-api-key-here
```

## Project Structure

The project consists of several key components:

```
tutorial-three/
├── .env
├── index.ts           # Main application file
├── db.sqlite         # SQLite database for storing embeddings
├── docs/            # Directory for markdown documents
└── package.json
```

## Implementation Steps

### 1. Core Setup and Imports

First, we set up the necessary imports and initialize our core components:

```typescript
import { AgentRuntime, settings, embed, elizaLogger } from "@elizaos/core";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import { DirectClient } from "@elizaos/client-direct";
// ... other imports
```

### 2. Database and Agent Configuration

We configure the SQLite database and set up our agent with RAG capabilities:

```typescript
const db = new SqliteDatabaseAdapter(new Database("db.sqlite"));
await db.init();

const agent = new AgentRuntime({
    databaseAdapter: db,
    agentId: AGENT_ID,
    modelProvider: "groq",
    token: settings.GROQ_API_KEY,
    ragOptions: {
        enabled: true,
        matchThreshold: 0.85,
        matchCount: 5
    }
});
```

### 3. Terminal Interface

The application provides a terminal-based chat interface using Node's readline:

```typescript
export class TerminalClient {
    private rl: readline.Interface;
    
    constructor(serverPort: number, agentId: UUID) {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }
    // ... implementation details
}
```

### 4. RAG Implementation

The RAG system consists of two main parts:

1. Document Loading:
```typescript
async function loadDocuments(agent: AgentRuntime, docsPath: string): Promise<void> {
    const files = await fs.readdir(docsPath);
    for (const file of files) {
        if (file.endsWith('.md')) {
            // Process and embed document content
        }
    }
}
```

2. Knowledge Retrieval:
```typescript
const ragProvider = {
    get: async (runtime: AgentRuntime, message: { content: { text: string } }): Promise<string | null> => {
        // Generate embeddings and search for relevant knowledge
    }
};
```

## Key Features

1. **Document Processing**
   - Automatically loads and processes markdown files
   - Generates embeddings for document content
   - Stores documents and embeddings in SQLite database

2. **Knowledge Retrieval**
   - Generates embeddings for user queries
   - Performs similarity search to find relevant content
   - Uses matched content to enhance AI responses

3. **Interactive Chat**
   - Terminal-based interface
   - Real-time responses
   - Context-aware conversations

## Usage

1. Start the application:

```bash
pnpm tsx index.ts
```

2. Or specify a custom docs directory:

```bash
pnpm tsx index.ts /path/to/your/docs
```

3. Chat with the agent:
   - Type your messages and press Enter
   - The agent will respond using both its base knowledge and relevant document content
   - Type 'exit' to quit

## How It Works

1. When you start the application:
   - The system initializes the database
   - Loads and processes all markdown files
   - Starts the chat interface

2. For each user message:
   - The system generates an embedding for the query
   - Searches for relevant content in the knowledge base
   - Combines found content with the AI's base knowledge
   - Generates a contextually relevant response

3. The RAG system:
   - Maintains a similarity threshold of 0.85
   - Returns up to 5 relevant matches
   - Concatenates matched content for context

## Best Practices

1. **Document Organization**
   - Keep markdown files well-structured
   - Use clear headings and sections
   - Maintain consistent formatting

2. **Performance Optimization**
   - Process documents in batches
   - Use appropriate match thresholds
   - Monitor database size

3. **Error Handling**
   - Implement proper error catching
   - Log important operations
   - Provide meaningful error messages

## Next Steps

- Add support for different file types
- Implement document update mechanisms
- Add conversation history
- Enhance similarity matching
- Add document metadata handling

## Troubleshooting

Common issues and solutions:

1. **Missing API Key**
   - Ensure GROQ_API_KEY is set in .env
   - Check environment variable loading

2. **Database Errors**
   - Verify SQLite installation
   - Check file permissions
   - Ensure proper initialization

3. **Embedding Issues**
   - Monitor embedding generation logs
   - Verify document processing
   - Check similarity thresholds

## Conclusion

This tutorial demonstrated how to build a RAG-enabled chat agent that can leverage document knowledge to provide more informed responses. The system combines the power of large language models with local document retrieval for enhanced conversation capabilities.
