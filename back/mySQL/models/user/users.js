import { Model, DataTypes } from "sequelize";

export default class Users extends Model {
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
        modelName: "Users",
        tableName: "Users",
        underscored: true,
        timestamps: true,
        paranoid: true,
        updatedAt: false,
      }
    );
  }
  static associate({ Users, Records, Rooms }) {
    Users.hasMany(Records, {
      sourceKey: "id", // 내보내주는 이름
      foreignKey: "userId", // 대상 컬럼명을 지정해준다. has belong에서 둘다 이름을 맞추는게 좋다.
    });
    Users.hasMany(Rooms, {
      sourceKey: "id", // 내보내주는 이름
      foreignKey: "userId", // 대상 컬럼명을 지정해준다. has belong에서 둘다 이름을 맞추는게 좋다.
    });
  }
}
