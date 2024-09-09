import { Model, DataTypes } from "sequelize";

export default class Admins extends Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: DataTypes.STRING(50),
          unique: true,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(64),
          allowNull: false,
        },
        nickname: {
          type: DataTypes.STRING(30),
          unique: true,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Admins",
        tableName: "Admins",
        underscored: true,
        timestamps: true,
        paranoid: true,
        updatedAt: false,
      }
    );
  }
}
