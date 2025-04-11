import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

interface InventoryItem {
  guitarId: number;
  quantity: number;
}

interface Order {
  id: number;
  customerName: string;
  items: Array<{
    guitarId: number;
    quantity: number;
  }>;
  totalAmount: number;
  orderDate: string;
}

interface Guitar {
  id: number;
  name: string;
  image: string;
  description: string;
  shortDescription: string;
  price: number;
}

async function fetchState(): Promise<{
  inventory: InventoryItem[];
  orders: Order[];
  guitars: Guitar[];
}> {
  let inventory: InventoryItem[] = [];
  let orders: Order[] = [];
  let guitars: Guitar[] = [];

  if (inventory.length === 0) {
    const guitarsReq = await fetch("http://localhost:8082/products");
    guitars = await guitarsReq.json();
    inventory = guitars.map((guitar: Guitar) => ({
      guitarId: guitar.id,
      quantity: Math.floor(Math.random() * 10) + 5,
    }));
  }

  orders = [
    {
      id: 2,
      customerName: "Jane Doe",
      items: [{ guitarId: 3, quantity: 3 }],
      totalAmount: 2500,
      orderDate: "2025-03-12",
    },
    {
      id: 3,
      customerName: "Bob Smith",
      items: [
        { guitarId: 1, quantity: 1 },
        { guitarId: 2, quantity: 2 },
      ],
      totalAmount: 2200,
      orderDate: "2025-02-14",
    },
    {
      id: 5,
      customerName: "Mike Brown",
      items: [
        { guitarId: 5, quantity: 2 },
        { guitarId: 6, quantity: 1 },
      ],
      totalAmount: 1800,
      orderDate: "2025-02-19",
    },
    {
      id: 4,
      customerName: "Alice Johnson",
      items: [{ guitarId: 4, quantity: 1 }],
      totalAmount: 1500,
      orderDate: "2025-01-19",
    },
    {
      id: 1,
      customerName: "John Doe",
      items: [
        { guitarId: 1, quantity: 2 },
        { guitarId: 2, quantity: 1 },
      ],
      totalAmount: 1200,
      orderDate: "2025-01-17",
    },
  ];

  return { inventory, orders, guitars };
}

let state: Awaited<ReturnType<typeof fetchState>> | null = null;

const getState = async () => {
  if (!state) {
    state = await fetchState();
  }
  return state;
};

app.get("/inventory", async (_req, res) => {
  const { inventory, orders, guitars } = await getState();
  const invetoryWithDetails = inventory.map((item) => {
    const guitar = guitars.find((g: Guitar) => g.id === item.guitarId);
    return {
      ...item,
      guitar,
    };
  });
  res.json(invetoryWithDetails);
});

app.post("/orders", async (req, _res) => {
  const { order } = req.body;
});

app.get("/orders", async (_req, res) => {
  const { orders } = await getState();
  res.json(
    [...orders]
      .sort(
        (a, b) =>
          new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
      )
      .reverse()
  );
});

// @ts-ignore
app.post("/purchase", async (req, res) => {
  const { inventory, orders, guitars } = await getState();

  const { customerName, items } = req.body as {
    customerName: string;
    items: Array<{ guitarId: number; quantity: number }>;
  };

  if (!customerName || !items || items.length === 0) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  let totalAmount = 0;
  for (const item of items) {
    const inventoryItem = inventory.find((i) => i.guitarId === item.guitarId);
    const guitar = guitars.find((g: Guitar) => g.id === item.guitarId);

    if (!inventoryItem || !guitar) {
      return res
        .status(404)
        .json({ error: `Guitar with id ${item.guitarId} not found` });
    }

    if (inventoryItem.quantity < item.quantity) {
      return res.status(400).json({
        error: `Insufficient inventory for guitar ${guitar.name}. Available: ${inventoryItem.quantity}`,
      });
    }

    totalAmount += guitar.price * item.quantity;
  }

  // Create order
  const order: Order = {
    id: orders.length + 1,
    customerName,
    items,
    totalAmount,
    orderDate: new Date().toISOString(),
  };

  // Update inventory
  items.forEach((item) => {
    const inventoryItem = inventory.find((i) => i.guitarId === item.guitarId)!;
    inventoryItem.quantity -= item.quantity;
  });

  orders.push(order);

  res.json(order);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Fulfillment API Server is running on port http://localhost:${PORT}`
  );
});
