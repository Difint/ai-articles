# Eliza Agent from Scratch

In this article we will create a simple agent from scratch. At it's core agents are just very special programs, and by making it from scratch we want to uncover magic.

We gonna use NodeJS and Javascript to for the sake of simplicity.
We gonna use pnpm, it's basically npm but faster by using liunks to globally stored packages.

1. Create new folder
2. cd to that folder
3. pnpm init5
4. add "start": "node index.js" to package.json
5. create index.js
6. add dependencies:
    "@elizaos/adapter-sqlite": "*", // for sqlite
    "@elizaos/client-direct": "*", // for direct client via terminal
    "@elizaos/core": "*", // for core
    "@elizaos/plugin-bootstrap": "*", // for core actions for agents
    "@elizaos/plugin-node": "*" // for nodejs specific operations, like interacting with the file system
7. run "npm install"