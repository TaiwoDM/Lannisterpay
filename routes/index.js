import express from "express";

import computeSplitPayment from "../controllers/computeSplitPayment.js";

const router = express.Router();

router.post("/split-payments/compute", computeSplitPayment);

export default router;
