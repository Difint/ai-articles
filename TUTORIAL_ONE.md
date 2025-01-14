# The simpliest agent

In this article we will create a simple agent from scratch. At it's core agents are just very special programs, and by making it from scratch we want to uncover magic.

We gonna use NodeJS and Javascript to for the sake of simplicity.
We gonna use pnpm, it's basically npm but faster by using liunks to globally stored packages.

## Preinstall
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


7. run "npm install"

## Creating Basic Agent

Let's modify the index.js file to create a basic agent.

### Importing dependencies

```javascript
//Importing Eliza specific packages
import { DirectClient } from "@elizaos/client-direct";
import {
  AgentRuntime,
  elizaLogger,
  settings,
  stringToUuid,
  type Character,
} from "@elizaos/core";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import { createNodePlugin } from "@elizaos/plugin-node";
```
#### Database

We will need a space to store memories of the Agent. We will use sqlite database for the sake of simplicity.



## Creating character file

