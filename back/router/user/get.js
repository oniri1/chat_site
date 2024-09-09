import { Router, json } from "express";
const router = Router();

import Rooms from "../../mySQL/models/room/rooms.js";
import Users from "../../mySQL/models/user/users.js";

import { mongoGetRecomment } from "../../mongoDB/mongoClient.js";

router.post("/rooms", async (req, res) => {
  try {
    const user = await Users.findAll({
      where: { nickname: req.signedCookies.user },
      include: [
        {
          model: Rooms,
          // attributes: [],
        },
      ],
    });

    console.log(user);

    res.json(...user);
  } catch (err) {
    res.json(err.message);
  }
});

//
router.post("/recomments", async (req, res) => {
  try {
    console.log(req.signedCookies.user);

    const recomments = await mongoGetRecomment({
      $and: [{ userId: req.signedCookies.user }, { deletedAt: false }],
    });

    console.log(recomments);
    res.json({ data: recomments });
  } catch (err) {
    res.json(err.message);
  }
});

export default router;
