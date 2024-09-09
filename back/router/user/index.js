import { Router } from "express";
const router = Router();
import get from "./get.js";
import deleter from "./delete.js";
import set from "./set.js";

import Users from "../../mySQL/models/user/users.js";

router.use("/get", get);
router.use("/delete", deleter);
router.use("/set", set);

router.post("/kill", async (req, res) => {
  try {
    console.log(req.signedCookies);

    await Users.destroy({
      where: { nickname: req.signedCookies.user }, //소프트 삭제
    });
    res.clearCookie("user");
    res.json({ redirect: "/chatSite" });
  } catch (err) {
    console.log(err);
    res.json({ error: err.message });
  }
});

router.post("/info", async (req, res) => {
  try {
    const user = req.signedCookies.user;

    if (user != undefined) {
      const userInfo = await Users.findOne({ where: { nickname: user } });

      res.json({ user: userInfo.nickname });
    } else {
      res.json("no user");
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
