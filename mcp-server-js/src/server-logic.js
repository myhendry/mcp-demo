import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export const server = new McpServer({
  name: "Fulfillment MCP Server",
  version: "1.0.0",
});

server.tool("getOrders", "Get product orders", async () => {
  console.error("Fetching orders");
  const res = await fetch("http://localhost:8080/orders");
  const orders = await res.json();

  return { content: [{ type: "text", text: JSON.stringify(orders) }] };
});

server.tool("getInventory", "Get product inventory", async () => {
  console.error("Fetching inventory");
  const res = await fetch("http://localhost:8080/inventory");
  const inventory = await res.json();

  return { content: [{ type: "text", text: JSON.stringify(inventory) }] };
});

server.tool(
  "purchase",
  "Purchase a product",
  {
    items: z
      .array(
        z.object({
          guitarId: z.number().describe("ID of the guitar to purchase"),
          quantity: z.number().describe("Quantity of guitars to purchase"),
        })
      )
      .describe("List of guitars to purchase"),
    customerName: z.string().describe("Name of the customer"),
  },
  async ({ items, customerName }) => {
    console.error("Purchasing", { items, customerName });
    const res = await fetch("http://localhost:8080/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
        customerName,
      }),
    });
    const order = await res.json();

    return { content: [{ type: "text", text: JSON.stringify(order) }] };
  }
);
