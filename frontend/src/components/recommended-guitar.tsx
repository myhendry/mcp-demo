"use client";

import { Guitar } from "@/app/api/utils";
import { useQuery } from "@tanstack/react-query";

async function fetchGuitars() {
  const res = await fetch("http://localhost:8082/products");
  if (!res.ok) throw new Error("Failed to fetch guitars");
  return res.json();
}

type GuitarListProps = {
  guitarId?: string; // Optional filter prop
};

export function RecommendedGuitar({ guitarId }: GuitarListProps) {
  const {
    data: guitars,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["guitars"], // Cache key
    queryFn: fetchGuitars,
    staleTime: 60 * 1000, // 1 minute cache
  });

  // Filter guitars based on guitarId if provided
  const filteredGuitars = guitarId
    ? guitars?.filter((guitar: Guitar) => guitar.id === parseInt(guitarId))
    : guitars;

  if (isLoading) return <div>Loading guitars...</div>;
  if (isError) return <div>Error loading guitars</div>;

  return (
    <div>
      {filteredGuitars?.map((guitar: any) => (
        <div key={guitar.id}>
          <h3>{guitar.name}</h3>
          <p>Type: {guitar.type}</p>
          <p>Price: ${guitar.price}</p>
        </div>
      ))}

      {guitarId && filteredGuitars?.length === 0 && (
        <div>No guitar found with ID: {guitarId}</div>
      )}
    </div>
  );
}
