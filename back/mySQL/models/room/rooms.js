import { Model, DataTypes } from "sequelize";

export default class Rooms extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        tag: {
          type: DataTypes.TINYINT.UNSIGNED,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Rooms",
        tableName: "Rooms",
        underscored: true,
        timestamps: true,
        paranoid: true,
        updatedAt: false,
      }
    );
  }
  static associate({ Rooms, Records, Users }) {
    Rooms.hasMany(Records, {
      sourceKey: "id", // 내보내주는 이름
      foreignKey: "roomId", // 대상 컬럼명을 지정해준다. has belong에서 둘다 이름을 맞추는게 좋다.
    });
    Rooms.belongsTo(Users, {
      targetKey: "id",
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
