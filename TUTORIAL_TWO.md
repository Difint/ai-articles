# Tutorial Two: Custom Actions

In this tutorial, we'll learn how to add custom actions to our AI agent. Actions are like special commands that our agent can recognize and respond to in a specific way.

## What is an Action?

An action is like a simple "if-then" rule for our agent. When a user says something specific, the agent performs a predefined task. Each action has:
- `name`: What we call this action (like "PING_PONG")
- `similes`: Words that trigger this action (like "ping" or "echo")
- `description`: What the action does
- `validate`: Checks if we should use this action
- `handler`: What to do when the action is triggered

## Let's Build a Ping-Pong Action

We'll create a simple game where:
1. When you type "ping", the agent replies "Pong!"
2. When you type "echo", the agent also replies "Pong!"

### Step 1: Create the Action

First, let's create our ping-pong action in `index.js`:

```javascript:tutorial_two/index.js
const pingPongAction = {
  name: "PING_PONG",
  similes: ["PING", "ECHO"],
  description: "Responds with 'Pong!' to ping or echo",
  
  // Checks if we should use this action
  async validate(runtime, message) {
    const text = message.content.text.toUpperCase();
    return text === "PING" || text === "ECHO";
  },

  // What to do when triggered
  async handler(runtime, message, state, options, callback) {
    return {
      text: "Pong!"
    };
  }
};
```

### Step 2: Add the Action to Your Agent

Update your agent configuration to include the action:

```javascript:tutorial_two/index.js
const agent = new AgentRuntime({
  // ... other settings ...
  actions: [pingPongAction],
  character: {
    model: "groq",
    systemPrompt: "You are a helpful assistant that can play ping pong.",
    // ... other character settings ...
  }
});
```

### Step 3: Try It Out!

1. Start your agent:
```bash
npm start
```

2. Test these commands:
- Type "ping" → Agent replies "Pong!"
- Type "echo" → Agent replies "Pong!"
- Type other messages → Agent responds normally

## How It Works

1. When you send a message, the agent checks all its actions
2. For each action, it runs the `validate` function
3. If `validate` returns true, it runs that action's `handler`
4. The `handler` sends back the response

## Exercise

Try modifying the ping-pong action to:
1. Add more trigger words (add to `similes`)
2. Change the response message (modify the `handler`)

## Next Steps

In Tutorial Three, we'll learn about memory - making our agent remember past conversations!