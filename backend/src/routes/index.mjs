import { Router } from "express";
import lecturesRouter from "./lecturesRoutes.mjs";
import rootRouter from "./root.mjs";

const router = Router();

router.use(rootRouter);
router.use(lecturesRouter);

export default router;
