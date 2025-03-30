import { openai } from "@ai-sdk/openai";
import { streamText, tool, experimental_createMCPClient } from "ai";
import { z } from "zod";
import { fetchGuitars } from "../utils";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const mcpClient = await experimental_createMCPClient({
  transport: {
    type: "sse",
    url: "http://localhost:8081/sse",
  },
  name: "Order Service",
});

const tools = await mcpClient.tools();
console.log("TOOLS", tools);

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    system: `You are an AI for a music store.
There are products available for purchase. You can recommend a product to the user.
You can get a list of products by using the getProducts tool.
You also have access to a fulfillment server that can be used to purchase products.
You can get a list of products by using the getInventory tool.
You can purchase a product by using the purchase tool.
After purchasing a product tell the customer they've made a great choice and their order will be processed soon and they will be playing their new guitar in no time.
    `,

    tools: {
      // !MCP Tools
      ...tools,
      // !Server Tools
      getProducts: tool({
        description: "Get all products from the database",
        parameters: z.object({}),
        execute: async () => {
          const guitars = await fetchGuitars();
          return guitars;
        },
      }),
      weather: tool({
        description: "Get the weather in a location (fahrenheit)",
        parameters: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: "Convert a temperature in fahrenheit to celsius",
        parameters: z.object({
          temperature: z
            .number()
            .describe("The temperature in fahrenheit to convert"),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return {
            celsius,
          };
        },
      }),
      // !Client Tools
      recommendGuitar: tool({
        description: "Use this tool to recommend a guitar to the user",
        parameters: z.object({
          guitarId: z.number().describe("The id of the guitar to recommend"),
        }),
      }),
    },
  });

  return result.toDataStreamResponse();
}
