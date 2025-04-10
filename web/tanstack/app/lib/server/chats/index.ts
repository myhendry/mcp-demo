import { createServerFn } from "@tanstack/start";
import { experimental_createMCPClient, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  //   parts?: Array<{
  //     type: string;
  //     text?: string;
  //     toolInvocation?: any;
  //   }>;
}
export const genAIResponse = createServerFn({
  method: "POST",
  response: "raw",
})
  .validator(
    (d: {
      messages: Array<Message>;
      systemPrompt?: { value: string; enabled: boolean };
    }) => d
  )
  .handler(async ({ data }) => {
    console.log("🔴 DATA", data);

    const messages = data.messages
      .filter(
        (msg) =>
          msg.content.trim() !== "" &&
          !msg.content.startsWith("Sorry, I encountered an error")
      )
      .map((msg) => ({
        role: msg.role,
        content: msg.content.trim(),
      }));

    const mcpClient = await experimental_createMCPClient({
      transport: {
        type: "sse",
        url: "http://localhost:8081/sse",
        // url: "http://192.168.68.62:8081/sse",
      },
    });
    const tools = await mcpClient.tools();
    console.log("✅ TOOLS", tools);

    try {
      const result = streamText({
        model: openai("gpt-4o-mini"),
        messages,
        system: `You are a helpful AI assistant. You have the tool to crawl the web for information by using the crawlWeb tool.`,
        maxSteps: 20,
        tools,
      });

      return result.toDataStreamResponse();
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({
          error:
            error instanceof Error
              ? error.message
              : "Failed to get AI response",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  });
