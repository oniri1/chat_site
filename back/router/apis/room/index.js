import { Router } from "express";
const router = Router();
import Rooms from "../../../mySQL/models/room/rooms.js";
import Users from "../../../mySQL/models/user/users.js";
import Sequelize from "sequelize";

router.post("/ran", async (req, res) => {
  try {
    const tempRanNum = Math.floor(Math.random() * 10) + 1;
    let roomValue = req.body.roomValue;
    const tag = req.body.tag;

    let temp;

    if (tag == 0) {
      for (let breaker = false; breaker != true; ) {
        temp = await Rooms.findAll({
          attributes: ["id", "title", "tag"],
          limit: 1,
          offset: roomValue,
        });

        console.log("반복 중!");

        //만약 아무것도 못찾았으면 방의 끝까지 갔다는 소리
        if (temp[0] == undefined) {
          //근데 룸벨류가 0이면 아예 방이 없다는 소리
          if (roomValue === 0) {
            breaker = true;
          }
          roomValue = 0;
        } else {
          //무언가 찾았을 경우
          breaker = true;
        }
      }
    } else {
      for (let breaker = false; breaker != true; ) {
        temp = await Rooms.findAll({
          where: { tag: tag },
          attributes: ["id", "title", "tag"],
          limit: 1,
          offset: roomValue,
        });

        //만약 아무것도 못찾았으면 방의 끝까지 갔다는 소리
        if (temp[0] == undefined) {
          if (roomValue === 0) {
            breaker = true;
          }
          roomValue = 0;
        } else {
          //무언가 찾았을 경우
          breaker = true;
        }
      }
    }

    roomValue += tempRanNum;

    temp = temp[0]?.dataValues;

    res.json([
      {
        roomId: temp?.id,
        title: temp?.title,
        tag: temp?.tag,
        roomValue: roomValue,
      },
    ]);
  } catch (err) {
    console.log(err);
  }
});
router.post("/search", async (req, res) => {
  try {
    const title = req.body.title;

    const temp = await Rooms.findAll({
      where: { title: { [Sequelize.Op.like]: `%${title}%` } },
      attributes: ["id", "title", "tag"],
    });

    // console.log(temp);

    if (temp[0] != undefined) {
      res.json({ data: temp });
    } else {
      res.json({ error: `no room Search:${title}` });
    }
  } catch (err) {
    console.log(err);
  }
});
router.post("/make", async (req, res) => {
  try {
    //로그인이 되어 있다면
    if (req.signedCookies.user != undefined) {
      const user = req.signedCookies.user;

      // console.log(user);

      let userDB = await Users.findOne({
        where: { nickname: user },
      });

      //삭제되거나 없는 닉네임 쿠키로 시도할 경우
      if (userDB == undefined || userDB.deletedAt != null) {
        throw new Error("deleted User");
      }

      const roomCreate = await Rooms.create({
        userId: userDB.id,
        title: req.body.title,
        tag: req.body.tag,
      });

      res.json({ redirect: `/room/?roomId=${roomCreate.id}` });
    }
  } catch (err) {
    console.log(err);
    res.json({ error: err.message });
  }
});
export default router;
