import Sequelize from "sequelize";
import mySQLConfig from "../config/config.json" assert { type: "json" };

import AdminsModel from "./admins/admins.js";
import RecordsModel from "./user/records.js";
import RoomsModel from "./room/rooms.js";
import UsersModel from "./user/users.js";

const env = process.env.NODE_ENV || "development";
const config = mySQLConfig[env];

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

export const Admins = AdminsModel.init(sequelize);
export const Records = RecordsModel.init(sequelize);
export const Rooms = RoomsModel.init(sequelize);
export const Users = UsersModel.init(sequelize);

const db = { Admins, Records, Rooms, Users };

Object.keys(db).forEach((model) => {
  if (db[model].associate) {
    db[model].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
