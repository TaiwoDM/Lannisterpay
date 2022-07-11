import express from "express";

import computeSplitPayment from "./controllers/computeSplitPayment.js";

const app = express();

app.use(express.json());

app.post("/split-payments/compute", computeSplitPayment);

app.listen(8000);
