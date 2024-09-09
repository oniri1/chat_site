import { Router } from "express";
const router = Router();

router.post("/", (req, res) => {
  console.log("logout", req.signedCookies.user);
  // res.cookie("user", req.signedCookies.user, {
  //   maxAge: 0,
  //   httpOnly: true,
  //   signed: true,
  // });

  res.clearCookie("user");
  res.json({ redirect: "/chatSite" });
});

export default router;
