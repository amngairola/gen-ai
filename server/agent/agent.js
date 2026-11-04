import dotenv from "dotenv";
import Groq from "groq-sdk";
import { systemPrompt } from "./prompt.js";
import { tavily } from "@tavily/core";

import NodeCache from "node-cache";

// Load environment variables
dotenv.config({ path: "../.env" });

// Initialize clients
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const tvly = tavily({
  apiKey: process.env.TAVILY_KEY,
});

// Model configuration
const MODEL = "openai/gpt-oss-20b";
const MAX_ITERATIONS = 5;

// Tool definitions
const tools = [
  {
    type: "function",
    function: {
      name: "webSearch",
      description:
        "Search the internet for latest information and real-time data.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query",
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
  },
];

const cache = new NodeCache({
  stdTTL: 60 * 60 * 24, // 24 hr
});

// Get Groq completion
async function getGroqChatCompletion(messages) {
  return await groq.chat.completions.create({
    messages,
    model: MODEL,
    tools,
    tool_choice: "auto",
    temperature: 0,
  });
}

// Main agent function
export async function main(query, history = []) {
  console.log("Agent started...");

  if (!query || typeof query !== "string" || !query.trim()) {
    throw new Error("A valid query is required.");
  }

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },

    ...history.map((message) => ({
      role: message.role,
      content: message.content,
    })),

    {
      role: "user",
      content: query,
    },
  ];

  // Agent execution loop
  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    console.log(`Agent iteration: ${iteration + 1}`);

    const response = await getGroqChatCompletion(messages);

    const assistantMessage = response.choices[0]?.message;

    if (!assistantMessage) {
      throw new Error("No response received from Groq.");
    }

    // If no tool calls, return final AI response
    if (!assistantMessage.tool_calls?.length) {
      console.log("Agent completed.");

      return assistantMessage.content ?? "";
    }

    // Store assistant message containing tool calls
    messages.push(assistantMessage);

    // Execute requested tools
    for (const tool of assistantMessage.tool_calls) {
      const functionName = tool.function.name;

      let args;

      try {
        args = JSON.parse(tool.function.arguments);
      } catch {
        throw new Error(`Invalid arguments for tool: ${functionName}`);
      }

      console.log(`Executing tool: ${functionName}`);

      let result;

      if (functionName === "webSearch") {
        result = await webSearch(args);
      } else {
        throw new Error(`Unknown tool: ${functionName}`);
      }

      // Send tool result back to the LLM
      messages.push({
        role: "tool",
        tool_call_id: tool.id,
        content: JSON.stringify(result),
      });
    }
  }

  throw new Error(`Agent exceeded maximum iterations (${MAX_ITERATIONS}).`);
}

// Tavily web search tool
async function webSearch({ query }) {
  console.log("Calling Tavily web search...");

  if (!query) {
    throw new Error("Search query is required.");
  }

  try {
    const response = await tvly.search(query);

    const finalResult = response.results
      .map((result) => result.content)
      .filter(Boolean)
      .join("\n\n");

    return finalResult || "No relevant search results found.";
  } catch (error) {
    console.error("Tavily search failed:", error.message);

    throw new Error("Unable to search the web right now.");
  }
}
