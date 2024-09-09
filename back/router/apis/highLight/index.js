import { Router } from "express";
import { Rooms } from "../../../mySQL/models/index.js";
import {
  client,
  mongoAddRecomment,
  mongoGetDataOne,
} from "../../../mongoDB/mongoClient.js";
import { ObjectId } from "mongodb";

const router = Router();

router.post("/rooms", async (req, res) => {
  try {
    const database = client.db("chatLog");
    const collection = database.collection("chats");

    let nowtime = Date.now();

    // console.log(nowtime);

    const tempArr = await collection
      .find({
        $and: [
          { createdAt: { $gte: nowtime - 360000000 * 10 } }, //기준 - 1000hour
        ],
      })
      .toArray();

    let countArr = [];

    //받아온 값들 카운팅 해주는 코드
    for (const { roomId } of tempArr) {
      //   console.log(dupliNum[roomId]);
      if (countArr[roomId] == undefined) {
        countArr[roomId] = { roomId: roomId, count: 1 };
      } else {
        countArr[roomId].count++;
      }
    }

    //빈 배열 삭제
    countArr = countArr.filter((n) => n);
    countArr.sort((a, b) => b.count - a.count);

    countArr = countArr.slice(0, 5);

    // console.log("countArr", countArr);

    const data = [];

    for (const { roomId } of countArr) {
      const a = await Rooms.findOne({
        where: { id: roomId },
        attributes: ["id", "title", "tag"],
      });

      if (a != null) {
        a.dataValues.roomId = a.dataValues.id;
        a.dataValues.id = undefined;

        //   console.log(a.dataValues);
        data.push(a);
      }
    }

    res.json([...data]);

    // res.json({});
  } catch (err) {
    console.log(err);
  }
});

//

router.post("/recomments", async (req, res) => {
  try {
    const database = client.db("chatLog");
    const collection = database.collection("recomments");

    let nowtime = Date.now();

    // console.log(nowtime);

    const tempArr = await collection
      .find({
        $and: [
          { createdAt: { $gte: nowtime - 360000000 * 10 } }, //기준 - 1000hour
        ],
      })
      .toArray();

    let countArr = [];

    //받아온 값들 카운팅 해주는 코드
    let forValue = 0;
    for (const { chatId } of tempArr) {
      if (countArr[chatId] == undefined) {
        countArr[chatId] = { index: forValue };
        countArr[forValue] = { chatId: chatId, count: 1 };
        forValue++;
      } else {
        countArr[countArr[chatId].index].count++;
      }
    }

    countArr.sort((a, b) => b.count - a.count);
    countArr = countArr.slice(0, 5);

    // console.log(countArr);

    const data = [];
    for (const { chatId } of countArr) {
      const temp = await mongoGetDataOne({
        _id: new ObjectId(chatId),
      });
      data.push(temp);
    }

    res.json(data);
  } catch (err) {
    console.log(err);
  }
});
export default router;
