import { Router } from "express";
const router = Router();
import room from "./rooms/index.js";
import img from "./img/index.js";
import login from "./login/index.js";
import regist from "./regist/index.js";
import logout from "./logout/index.js";
import cookieChecker from "./cookieChecker/index.js";
import api from "./apis/index.js";
import user from "./user/index.js";
import chat from "./chat/index.js";

router.use("/cookieCheck", cookieChecker);
router.use("/room", room);
router.use("/img", img);
router.use("/login", login);
router.use("/regist", regist);
router.use("/logout", logout);
router.use("/api", api);
router.use("/user", user);
router.use("/chat", chat);

export default router;
