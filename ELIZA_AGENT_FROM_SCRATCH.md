# Eliza Agent from Scratch

In this article we will create a simple agent from scratch. At it's core agents are just very special programs, and by making it from scratch we want to uncover magic.

We gonna use NodeJS and Javascript to for the sake of simplicity.


1. Create new folder
2. cd to that folder
3. npm init5
4. add "start": "node index.js" to package.json
5. create index.js
6. add dependencies:
    "@elizaos/adapter-sqlite": "*", // for sqlite
    "@elizaos/client-auto": "*", // for auto client
    "@elizaos/client-direct": "*", // for direct client
    "@elizaos/core": "*", // for core
    "@elizaos/plugin-bootstrap": "*", // for bootstrap plugin
    "@elizaos/plugin-node": "*" // for node plugin
7. run "npm install"