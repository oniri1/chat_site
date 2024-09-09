import { Router } from "express";
import Rooms from "../../mySQL/models/room/rooms.js";
const router = Router();

router.post("/", async (req, res) => {
  try {
    if (req.query.roomId == undefined) {
      res.status(405);
      res.json({ error: "no room" });
    } else {
      const rooms = await Rooms.findOne({
        where: { id: req.query.roomId },
        attributes: ["id", "title"],
      });

      let temp = false;

      const { id } = rooms;
      if (id == req.query.roomId) temp = true;

      console.log("room@@@@@@@@@@@@@@@@@@", rooms.title);

      if (temp) {
        res.json({ roomId: req.query.roomId, title: rooms.title });
      } else {
        console.log("err");
        res.status(405);
        res.json({ error: "no room" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
