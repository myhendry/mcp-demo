export interface Guitar {
  id: number;
  name: string;
  image: string;
  description: string;
  shortDescription: string;
  price: number;
}

export interface InventoryItem {
  guitarId: number;
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  items: Array<{
    guitarId: number;
    quantity: number;
  }>;
  totalAmount: number;
  orderDate: string;
}

export const fetchGuitars = async () => {
  const response = await fetch("http://localhost:8082/products");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as unknown as Guitar[];
};
