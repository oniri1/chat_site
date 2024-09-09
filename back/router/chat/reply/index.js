import { Router } from "express";
import { ObjectId } from "mongodb";
import {
  mongoGetDataOne,
  mongoAddRecomment,
} from "../../../mongoDB/mongoClient.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const data = {};
    data.userName = req.signedCookies;
    if (!data.userName.ghost) data.userName.ghost = null;
    if (!data.userName.user) data.userName.user = null;
    data.content = req.body.content;

    const temp = await mongoGetDataOne({
      _id: new ObjectId(req.body.chatId),
    });

    // console.log(temp);

    await mongoAddRecomment(
      JSON.stringify({
        chatId: temp._id,
        roomId: temp.roomId,
        userId: data.userName.user,
        ghostId: data.userName.ghost,
        content: data.content,
        createdAt: Date.now(),
        deletedAt: false,
      })
    );

    res.json({ redirect: `./?chatId=${req.body.chatId}` });
  } catch (err) {
    console.log(err);
  }
});

export default router;
