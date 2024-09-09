import { Router } from "express";
import { hasher } from "../../hash/index.js";
import { Users } from "../../mySQL/models/index.js";
const router = Router();

router.post("/", async (req, res) => {
  try {
    const { email, pw, pwCk, name } = req.body;
    console.log(email, pw, pwCk, name);

    //비밀번호가 틀리면
    if (pw != pwCk) {
      throw new Error("not match password");
    } else {
      await Users.create({
        email: email,
        password: hasher(pw),
        nickname: name,
      });
      res.json({ redirect: "/login" });
    }
  } catch (err) {
    console.error(err);
    res.json({ error: err.message });
  }
});

export default router;
