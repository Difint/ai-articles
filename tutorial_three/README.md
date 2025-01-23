# Simple RAG Example

Loading Markdown Documents into ElizaOS Agent memory and being able to ask questions about them.
This is a simple example of using RAG (Retrieval-Augmented Generation) with ElizaOS to create a question-answering system based on markdown documents.

## Prerequisites

- Node.js 22+
- pnpm
- A GROQ API key

## Setup

0. download repo:
```bash
git clone https://github.com/Difint/ai-articles.git
cd tutorial_three
```

1. Install dependencies:
```bash
pnpm install
```

2. Copy the `.env.example` file to `.env` and add your GROQ API key:
```bash
cp .env.example .env
```

Then edit `.env` and add your GROQ API key:
```
GROQ_API_KEY=your-api-key-here
```



## Usage

1. Run the example with current directory:
```bash
pnpm start 
```

2. Or specify a custom docs directory:
```bash
pnpm start /path/to/your/docs
```

The script will:
1. Load all markdown files from the specified directory
2. Process them and store them in the SQLite database
3. Start an interactive terminal session where you can ask questions

Type your questions and the system will:
1. Search for relevant content in the loaded documents
2. Use the found content as context to generate an answer
3. Display the answer

Type 'exit' to quit the program.

## How it Works

1. Document Loading:
   - The system reads all `.md` files from the specified directory
   - Each file is processed and stored in a SQLite database with embeddings

2. Question Answering:
   - When you ask a question, the system generates an embedding for your query
   - It searches for relevant content using similarity search
   - The found content is used as context for the LLM to generate an answer

3. Components:
   - `index.ts`: Main script containing all the logic
   - `db.sqlite`: SQLite database storing the documents and embeddings
