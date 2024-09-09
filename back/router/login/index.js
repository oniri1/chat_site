import { Router } from "express";
import { hasher } from "../../hash/index.js";
import { Users } from "../../mySQL/models/index.js";
const router = Router();

router.post("/", async (req, res) => {
  try {
    console.log(req.body);

    const pw = hasher(req.body.pw);
    const user = await Users.findOne({ where: { email: req.body.email } });

    console.log(user.password, pw);
    if (user.password == pw) {
      console.log(user.nickname);
      res.cookie("user", user.nickname, {
        httpOnly: true,
        // secure: true,
        signed: true,
        // path: "/",
      });
      res.clearCookie("ghost");
      res.json({ redirect: "/chatSite" });
    } else {
      throw new Error("not match password");
    }

    //이메일이 없을 경우
    if (user == null) throw new Error("not match email");

    res.cookie;
  } catch (err) {
    console.log("login router err@@@@ : ", err);
    res.json({ error: err.message });
  }
});

export default router;
