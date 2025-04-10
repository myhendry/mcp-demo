import express from "express";
import ViteExpress from "vite-express";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

app.post("/message", async (req, res) => {
  const { messages } = await req.body;
  console.log("Messages", messages);

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    stream: true,
  });
  console.log("Result", result);

  // return result.toDataStreamResponse();
  return result.pipeDataStreamToResponse(res);
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));
