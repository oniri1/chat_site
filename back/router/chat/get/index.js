import { Router } from "express";

import {
  mongoGetDataOne,
  mongoGetRecomment,
} from "../../../mongoDB/mongoClient.js";
import { ObjectId } from "mongodb";
import Rooms from "../../../mySQL/models/room/rooms.js";

const router = Router();

router.post("/contents", async (req, res) => {
  try {
    const content = await mongoGetDataOne({
      _id: new ObjectId(req.body.chatId),
    });

    const roomData = await Rooms.findOne({ where: { id: content.roomId } });

    res.json({
      title: roomData.title,
      user: content.userId == null ? content.ghostId : content.userId,
      chat: content.content,
      createdAt: content.createdAt,
      file: content.fileName,
    });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

router.post("/recomments", async (req, res) => {
  try {
    const content = await mongoGetRecomment({
      chatId: req.body.chatId,
    });

    console.log(content);

    if (content[0] == undefined) {
      res.json({ error: "notrecomments" });
    } else {
      res.json({ data: content });
    }
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

export default router;
