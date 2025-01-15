# Building Eliza Agents from Scratch

Let's start with the basics to understand how ElizaOS works.

ElizaOS and similar frameworks revolutionized the way we build AI agents.
They've put together lot of small pieces in a pretty simple framework that just works.

At first glance AI agents looks like magic and it's hard to find how to start.

The goal of the series of tutorials is to build Eliza agent from scratch gradually increasing complexity.

## Prerequisites

Same as for the [ElizaOS](https://github.com/elizaos/elizaos) project.
- Node.js 23
- pnpm 9+

## Tutorials

1. [The simpliest agent](./TUTORIAL_ONE.md)
   - Basic agent setup
   - Simple chat interface
   - Database integration

2. [Custom actions](./TUTORIAL_TWO.md)
   - Creating custom actions
   - Adding ping-pong functionality
   - Action validation and handling

3. [Custom memory](./TUTORIAL_THREE.md)
   - Memory management
   - Document processing
   - Advanced agent features

## Running the Examples

Each tutorial has its own directory with a complete working example. To run any example:

1. Navigate to the tutorial directory:
   ```bash
   cd tutorial_one # or tutorial_two, tutorial_three, etc.
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Initialize the database:
   ```bash
   pnpm start
   ```

After that you'll be able to chat with your agent in the terminal.