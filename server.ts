import express from "express";
import cors from "cors";
import { processGraph } from "./src/lib/graph.js";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  app.use(cors());
  app.use(express.json());

  // POST /api/bfhl
  app.post("/api/bfhl", (req, res) => {

    try {
      const { data } = req.body;
      
      if (!data || !Array.isArray(data)) {
        res.status(400).json({
          status: "error",
          message: "Invalid input. Expected format: { \"data\": [\"A->B\", \"C->D\"] }",
        });
        return;
      }
      const result = processGraph(data);
      res.json(result);

    }
    catch (error: any){
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        error: error.message,
      });
    }

  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

}

startServer().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
