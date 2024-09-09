import { Server } from "socket.io";
import {
  mongoAddData,
  mongoGetData,
  mongoGetDataOne,
} from "../mongoDB/mongoClient.js";

const chatEleCreater = (data) => {
  console.log("data", data);

  const date = new Date(data.createdAt);
  const dateTitle = `${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}월 ${date
    .getDate()
    .toString()
    .padStart(2, "0")}일 ${date.getHours()}시 ${date.getMinutes()}분`;

  if (data.userId != null) {
    data.name = data.userId;
  } else {
    data.name = data.ghostId;
  }

  if (data.fileName == null) {
    return `
    <a href="/chat/?chatId=${data._id}"><li class="received">
      <span class="profile">
        <span class="user">${data.name}</span>
        <img class="image" src="../img/two-bleeding-gladiator-fight-in-colosseum-with-many-audience.jpeg" alt="" />
      </span>
      <span class="message">${data.content} </span>
      <span class="time">${dateTitle}</span>
    </li></a>`;
  } else {
    return `
    <a href="/chat/?chatId=${data._id}"><li class="received">
      <span class="profile">
        <span class="user">${data.name}</span>
        <img class="image" src="../img/two-bleeding-gladiator-fight-in-colosseum-with-many-audience.jpeg" alt="" />
      </span>
      <span class="message">${data.content} </span>
      <span class="time">${dateTitle}</span>
      <div class="imgBox">
        <img class="image" src="../userFiles/${data.fileName}" alt="" />
      </div>
    </li></a>`;
  }
};

export default (server) => {
  const io = new Server(server, {
    cors: { origin: "http://localhost" },
    path: "/chatProject/socket.io", //router를 자동으로 생성, client의 src = 랑 주소가 맞아야 한다. http://localhost:3010/api/socket.io , 클라이언트 js와도 맞아야 함 ":3010/api/socket.io"
  });

  console.log("등록");
  // 네임스페이스 등록
  const room = io.of("/room");

  // chat 네임스페이스 전용 이벤트
  room.on("connection", (socket) => {
    const roomIdStr = socket.handshake.query.roomId;
    const id = +roomIdStr;

    //룸에 접속
    socket.join(id);
    console.log(socket.rooms);
    console.log(`chat${id} 네임스페이스에 접속`);

    socket.on("disconnect", () => {
      console.log(`chat${id} 네임스페이스 접속 해제`);

      //접속 해제
      socket.leave(id);
      console.log(socket.rooms);
    });

    //쓰기
    socket.on("chatReply", async (data) => {
      try {
        if (!data.userName.ghost) data.userName.ghost = null;
        if (!data.userName.user) data.userName.user = null;

        console.log(data);

        //
        const MongoData = await mongoGetDataOne({
          _id: (
            await mongoAddData(
              JSON.stringify({
                roomId: id,
                userId: data.userName.user,
                ghostId: data.userName.ghost,
                content: data.chat,
                createdAt: Date.now(),
                deletedAt: false,
                fileName: data.fileName,
              })
            )
          ).insertedId,
        });

        //보내기
        room.to(id).emit("chat", chatEleCreater(MongoData));
      } catch (err) {
        console.log("roomsocket.js err@@@@", err);
      }
    });

    //몽고에서 채팅기록 뽑아오기 이벤트
    socket.on("chatLoad", async (data) => {
      try {
        let { time } = data;
        const { roomId } = data;

        let dataFromMongo = [];
        for (
          ;
          dataFromMongo[0] == undefined && time > 1715565537840;
          time -= 3600000
        ) {
          dataFromMongo = await mongoGetData({
            $and: [
              { roomId: roomId },
              {
                $and: [
                  { createdAt: { $gte: time - 3600000 } }, //기준 - 1hour
                  { createdAt: { $lte: time } }, //Date now 기준
                ],
              },
            ],
          });

          dataFromMongo.reverse();
        }

        dataFromMongo.forEach((temp) => {
          socket.emit("chatload", chatEleCreater(temp));
          socket.emit("CliTimeReset", temp.createdAt);
        });

        dataFromMongo = [];
      } catch (err) {
        console.log("roomsocket.js err@@@@", err);
      }
    });
  });
};
