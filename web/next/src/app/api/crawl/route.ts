import { experimental_createMCPClient, generateText, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

// export const runtime = "nodejs";

function errorHandler(error: unknown) {
  if (error == null) {
    return "unknown error";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}

let sseClient;

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    console.log("Connecting to MCP client...");
    sseClient = await experimental_createMCPClient({
      transport: {
        type: "sse",
        url: "http://localhost:8081/sse",
      },
      name: "Demo MCP",
    });
    console.log("Connected to MCP client");

    const toolSetOne = await sseClient.tools();
    console.log("Tool set one", toolSetOne);

    const tools = {
      ...toolSetOne,
    };

    console.log("Starting stream...");
    const response = await streamText({
      // model: anthropic("claude-3-5-sonnet-latest"),
      model: openai("gpt-4o-mini"),
      messages,
      system: `
      You are a helpful AI assistant. You can crawl the web for information.  
      When the user asks you to find information, use the crawlWeb tool.
      To use the crawlWeb tool, you need to provide:
      - url: The complete URL you want to crawl (include https://)
      - formats: Optional. Default is ["markdown"]
      Example usage:
      User: "Find information about climate change from NASA's website"
      You should use crawlWeb with url="https://climate.nasa.gov/"`,
      // onFinish: async () => {
      //   console.log("Stream finished, closing client");
      //   await sseClient!.close();
      // },
      tools,
    });

    console.log("Returning response stream");
    return response.toDataStreamResponse({
      getErrorMessage: errorHandler,
    });
  } catch (error) {
    console.log("Error", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
