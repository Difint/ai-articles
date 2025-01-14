// Importing Eliza specific packages
import { AgentRuntime } from "@elizaos/core";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
//--------------------------
//Importing core plugins
// import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
// import { createNodePlugin } from "@elizaos/plugin-node"

//--------------------------
// Importing external packages
import Database from "better-sqlite3";

//--------------------------

// Creating basic connections
// const directClient = new DirectClient();
 const db = new SqliteDatabaseAdapter(new Database("db.sqlite"));
 await db.init();

// //Creating agent runtime
const agent = new AgentRuntime({
  databaseAdapter: db
});