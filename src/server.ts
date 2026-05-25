import express from "express";
import cors from "cors";

import todoRoutes from "./routes/todo.routes";
import categoriesRoutes from "./routes/categories.routes";
import "./db";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/todos", todoRoutes);
app.use("/api/categories", categoriesRoutes);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
