import { Router } from "express";
const router = Router();

import Rooms from "../../mySQL/models/room/rooms.js";
import Users from "../../mySQL/models/user/users.js";
import { ObjectId } from "mongodb";
import { client } from "../../mongoDB/mongoClient.js";

router.post("/room", async (req, res) => {
  try {
    console.log(req.body.roomId);

    await Rooms.destroy({
      where: { id: req.body.roomId },
    });

    res.json({ redirect: "./" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/recomment", async (req, res) => {
  try {
    console.log(req.body.recommentId);
    const database = client.db("chatLog");
    const collection = database.collection("recomments");

    const recomment = await collection.updateOne(
      {
        _id: new ObjectId(req.body.recommentId),
      },
      { $set: { deletedAt: Date.now() } }
    );

    res.json({ redirect: "./" });
  } catch (err) {
    console.log(err);
  }
});
export default router;
