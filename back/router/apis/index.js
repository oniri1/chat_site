import { Router } from "express";
const router = Router();

import roomAPI from "./room/index.js";
import highLightAPI from "./highLight/index.js";

router.use("/room", roomAPI);
router.use("/highLight", highLightAPI);

export default router;
