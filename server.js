import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config({
  path: __dirname + "/config.env",
});

import app from "./app.js";

const port = process.env.PORT || 8000;

app.listen(port, "0.0.0.0", () => {
  console.log(`App running on port ${port}`);
});
