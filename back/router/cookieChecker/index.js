import { Router } from "express";
const router = Router();

let ghostId = 0;

router.post("/", (req, res) => {
  console.log("cookiechecker", req.signedCookies);

  if (req.signedCookies.user) {
    console.log("user on");
    res.json({ user: req.signedCookies.user });
  } else {
    if (req.signedCookies.ghost) {
      res.json({ ghost: `ghost${ghostId}` });
    } else {
      res.cookie("ghost", `ghost${ghostId++}`, {
        httpOnly: true,
        signed: true,
      });
      res.json({ ghost: `ghost${ghostId}` });
    }
  }
});

export default router;
