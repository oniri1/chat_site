import { MongoClient } from "mongodb";

export let client;

const connectToMongoDB = async (mongoUrl) => {
  try {
    client = new MongoClient(mongoUrl);
    await client.connect(); // 몽고DB 서버에 연결
    console.log("Connected Mongo@@@@");
  } catch (error) {
    console.error("connectERR @@@@@@", error);
  }
};

//데이터 베이스에 추가

const mongoAddData = async (jsonData) => {
  try {
    const database = client.db("chatLog");
    const collection = database.collection("chats");

    //JSON 변환
    const data = JSON.parse(jsonData);

    // console.log("MongoClient.js ADDfun data@@", data);

    return await collection.insertOne({ ...data });
  } catch (err) {
    console.log("MongoAddFuncERR@@@@", err);
  }
};

//최신 데이터 뽑아오기

const mongoGetData = async (objData) => {
  try {
    const database = client.db("chatLog");
    const collection = database.collection("chats");
    const result = await collection.find({ ...objData }).toArray();

    return result;
  } catch (err) {
    console.log("mongoGetData Func Err@@@ mongoclient.js", err);
  }
};

const mongoGetDataOne = async (objData) => {
  try {
    const database = client.db("chatLog");
    const collection = database.collection("chats");

    console.log({ ...objData });
    const result = await collection.findOne({ ...objData });

    return result;
  } catch (err) {
    console.log("mongoGetData Func Err@@@ mongoclient.js", err);
  }
};

//

//recomment 추가
const mongoAddRecomment = async (jsonData) => {
  try {
    const database = client.db("chatLog");
    const collection = database.collection("recomments");

    //JSON 변환
    const data = JSON.parse(jsonData);

    // console.log("MongoClient.js ADDfun data@@", data);

    return await collection.insertOne({ ...data });
  } catch (err) {
    console.log("MongoAddRecomment FuncERR@@@@", err);
  }
};

const mongoGetRecomment = async (objData) => {
  try {
    const database = client.db("chatLog");
    const collection = database.collection("recomments");

    const result = await collection.find({ ...objData }).toArray();

    return result;
  } catch (err) {
    console.log("mongoGetRecomment Func Err@@@ mongoclient.js", err);
  }
};

const mongoGetRecommentOne = async (objData) => {
  try {
    const database = client.db("chatLog");
    const collection = database.collection("recomments");
    const result = await collection.findOne({ ...objData });

    return result;
  } catch (err) {
    console.log("mongoGetRecommentOne Func Err@@@ mongoclient.js", err);
  }
};

const mongoDelete = async () => {
  try {
    const database = client.db("chatLog");
    const collection1 = database.collection("recomments");
    const collection2 = database.collection("chats");

    await collection1.drop();
    await collection2.drop();
  } catch (err) {
    throw `mongoDelete fail ${err}`;
  }
};

export {
  connectToMongoDB,
  mongoAddData,
  mongoGetData,
  mongoGetDataOne,
  mongoAddRecomment,
  mongoGetRecomment,
  mongoGetRecommentOne,
  mongoDelete,
};
