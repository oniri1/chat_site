import { Model, DataTypes } from "sequelize";

export default class Records extends Model {
  static init(sequelize) {
    return super.init(
      {},
      {
        sequelize,
        modelName: "Records",
        tableName: "Records",
        underscored: true,
        timestamps: true,
        paranoid: true,
        updatedAt: false,
      }
    );
  }
  static associate({ Records, Users, Rooms }) {
    Records.belongsTo(Users, {
      targetKey: "id",
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Records.belongsTo(Rooms, {
      targetKey: "id",
      foreignKey: "roomId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
