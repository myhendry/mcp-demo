import express from "express";
import cors from "cors";

import guitars from "./data/guitars";

const PORT = process.env.PORT || 8082;

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static("images"));

app.get("/products", (req, res) => {
  res.json(
    guitars.map((guitar) => ({
      ...guitar,
      image: `${req.protocol}://${req.get("host")}${guitar.image}`,
    }))
  );
});

app.listen(PORT, () => {
  console.log(
    `Products API Server is running on port http://localhost:${PORT}`
  );
});
