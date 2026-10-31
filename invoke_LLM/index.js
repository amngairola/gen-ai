import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config({ path: "../.env" });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

main();

async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are Aman  , a smart review grader , your taskis to analyse given riview and return the sentiment ",
      },
      {
        role: "user",
        content: "who are you",
      },
    ],
    model: "openai/gpt-oss-20b",
    temperature: 1,
    // top_p: 0.2,
    // stop: 4,
    max_completion_tokens: 10000,

    response_format: {
      type: "json_object",
    },
  });
}
