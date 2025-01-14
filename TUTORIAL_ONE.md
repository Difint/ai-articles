# The simpliest agent

In this article we will create a simple agent from scratch. At it's core agents are just very special programs, and by making it from scratch we want to uncover magic.

We gonna use NodeJS and Javascript to for the sake of simplicity.
We gonna use pnpm, it's basically npm but faster by using liunks to globally stored packages.

## Part One: The most minimalistic agent
### Preinstall
Commit with what you have is here (TBG commit)

1. Create new folder
2. cd to that folder
3. pnpm init
4. create index.js 
5. add "start": "node index.js" to package.json
6. add Elizad dependencies to "dependencies" section in package.json:
    "@elizaos/adapter-sqlite": "*", // for sqlite
    "@elizaos/client-direct": "*", // for direct client via terminal
    "@elizaos/core": "*", // for core
    "@elizaos/plugin-bootstrap": "*", // for core actions for agents
    "@elizaos/plugin-node": "*" // for nodejs specific operations, like interacting with the file system
7. We will need a few additional packages:
    - better-sqlite3 //sqlite database
    - @tavily/core //required by elize core

7. run "npm install"

### Creating Basic Agent

Let's modify the index.js file to create a basic agent.

#### Importing dependencies

```javascript
//Importing Eliza specific packages
import { AgentRuntime } from "@elizaos/core";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
```
#### Database

We will need a space to store memories of the Agent. We will use sqlite database for the sake of simplicity.

1. create db.sqlite file

```javascript
const db = new SqliteDatabaseAdapter(new Database("db.sqlite"));
await db.init();
```

#### Creating agent runtime

```javascript
const agent = new AgentRuntime({
  databaseAdapter: db
});
```

You should see something like this in the terminal:

```
["✓ User Eliza created successfully."]
```

## Part Two: Creating a chat interface 

We will use readline to create a chat interface.

1. create chat.js file
2. add the following code:

```javascript

```

## Part Three: Add groq

1. Create Groq account. You'll have pretty a lot free API calls.
2. Create .env file
3. Create API key in Groq
3. add GROQ_API_KEY=your_api_key_here to .env file
