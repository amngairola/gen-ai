import dotenv from "dotenv";
import Groq from "groq-sdk";
import { systemPrompt } from "./prompt.js";
import readline from "node:readline/promises";

import { tavily } from "@tavily/core";

dotenv.config({ path: "../.env" });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
const tvly = tavily({ apiKey: process.env.TAVILY_KEY });

const role = ["system", "user"];

const model = "openai/gpt-oss-20b";

const tools = [
  {
    type: "function",
    function: {
      name: "webSearch",
      description: "search the latest info and real time data on the internet ",
      parameters: {
        // JSON Schema object
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query",
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
  },
];

//agent
async function getGroqChatCompletion(messages) {
  return groq.chat.completions.create({
    messages,
    tools,
    model,
    tool_choice: "auto",
    temperature: 0,
  });
}

//method to call agent and tools
export async function main(query) {
  const messages = [
    {
      role: role[0],
      content: systemPrompt,
    },
    // {
    //   role: role[1],
    //   content: query,
    // },
  ];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const q = await rl.question("you: ");

    if (q === "bye") break;

    messages.push({
      role: role[1],
      content: q,
    });

    let iterations = 0;
    const MAX_ITERATIONS = 3;

    while (iterations < MAX_ITERATIONS) {
      iterations++;
      const response = await getGroqChatCompletion(messages);

      const assistentMessage = response.choices[0].message;
      //   console.log(assistentMessage);

      if (!assistentMessage.tool_calls?.length) {
        console.log("Ai : ", assistentMessage.content);

        break;
      }

      messages.push(assistentMessage);

      for (const tool of assistentMessage.tool_calls) {
        // console.log("tools :: ", tool);

        const functionName = tool.function.name;
        const args = JSON.parse(tool.function.arguments);

        let result;

        if (functionName === "webSearch") {
          result = await webSearch(args);
        } else {
          throw new Error(`unknown tool : ${functionName}`);
        }

        messages.push({
          role: "tool",
          tool_call_id: tool.id,
          name: functionName,
          content: JSON.stringify(result),
        });
      }
    }
  }

  rl.close();
}

// tool calling method

async function webSearch({ query }) {
  console.log("calling web search...");
  try {
    const res = await tvly.search(query);

    const finalRes = res.results.map((result) => result.content).join("\n\n");

    return finalRes;
  } catch (error) {
    console.error("Tavily search failed:", error.message);
    throw new Error("Unable to search the web right now.");
  }
}
