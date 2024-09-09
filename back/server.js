//외부 라이브러리
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

//커스텀
import router from "./router/index.js";

//mySQL
import db from "./mySQL/models/index.js";
const { sequelize, Admins } = db;

//socket
import roomsocket from "./socket/roomsocket.js";

//몽고 접속
import { connectToMongoDB, mongoDelete } from "./mongoDB/mongoClient.js";

//라이브러리 설정
const app = express();

app.set("port", process.env.PORT || 3010);
app.use(
  cors({
    origin: ["http://localhost", "http://127.0.0.1:5500"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser("Oniri1Making"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", router);

(async () => {
  try {
    await sequelize.sync({ force: false });
    await connectToMongoDB(process.env.MONGODBPORT);

    const dbCheck = await Admins.findAll();
    if (dbCheck[0] === undefined) {
      console.log("디비 빔");
      await sequelize.sync({ force: true });
      await mongoDelete();
      await Admins.create({
        email: "Admin",
        password: "onirimanyi!",
        nickname: "햄스터킹",
      });
    }
    const server = app.listen(app.get("port"), () => {
      console.log(app.get("port"), "server open");
    });

    //소켓 통신 활성화
    console.log("소켓 활성화");
    roomsocket(server);
  } catch (err) {
    console.log("@@@@@@@@@@@@@@@@@@@@");
    console.log(err);
  }
})();
