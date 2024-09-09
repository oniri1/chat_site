import { Router } from "express";
import get from "./get/index.js";
import reply from "./reply/index.js";

const router = Router();

router.use("/get", get);
router.use("/reply", reply);

export default router;
