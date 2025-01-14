// Importing Eliza specific packages
// import { DirectClient } from "@elizaos/client-direct";
import { AgentRuntime } from "@elizaos/core";
// import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
// import { createNodePlugin } from "@elizaos/plugin-node";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";

//--------------------------
// Importing external packages
import Database from "better-sqlite3";

//--------------------------

// Creating basic connections
// const directClient = new DirectClient();
 const db = new SqliteDatabaseAdapter(new Database("db.sqlite"));


// //Creating agent runtime
// const agent = new AgentRuntime({
//   databaseAdapter: db,
//   token,
//   modelProvider: character.modelProvider,
//   evaluators: [],
//   character,
//   plugins: [
//     bootstrapPlugin,
//     nodePlugin,
//     character.settings?.secrets?.WALLET_PUBLIC_KEY ? solanaPlugin : null,
//   ].filter(Boolean),
//   providers: [],
//   actions: [],
//   services: [],
//   managers: [],
//   cacheManager: cache,
// });