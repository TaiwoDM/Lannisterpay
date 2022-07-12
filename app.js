import express from "express";

import computeSplitPaymentRouter from "./routes/index.js";

const app = express();

app.use(express.json());

app.use(computeSplitPaymentRouter);

export default app;
