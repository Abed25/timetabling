import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(201).send("Backend is running under routes");
});

export default router;
