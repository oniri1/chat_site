import { Router } from "express";
const router = Router();

import Users from "../../mySQL/models/user/users.js";
import { hasher } from "../../hash/index.js";

router.post("/name", async (req, res) => {
  try {
    console.log(req.signedCookies.user);

    await Users.update(
      { nickname: req.body.name },
      {
        where: { nickname: req.signedCookies.user },
      }
    );

    const user = await Users.findOne({ where: { nickname: req.body.name } });

    res.cookie("user", user.nickname, {
      httpOnly: true,
      signed: true,
    });

    res.json({ redirect: "/" });
  } catch (err) {
    console.log(err);
    res.json({ error: "someone has this name" });
  }
});
router.post("/pw", async (req, res) => {
  try {
    const newPw = hasher(req.body.pw);

    console.log(req.signedCookies.user);
    await Users.update(
      { password: newPw },
      {
        where: { nickname: req.signedCookies.user },
      }
    );

    res.json({ redirect: "/" });
  } catch (err) {
    console.log(err);
  }
});

export default router;
