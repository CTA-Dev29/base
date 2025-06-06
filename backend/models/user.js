// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
    nim: {
      type: DataTypes.STRING,
      defaultValue: "0000",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     nowa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
    avatar: {
      type: DataTypes.BLOB("long"), // tipe untuk gambar
      allowNull: true,
    },
  });

  User.associate = (models) => {
    User.hasOne(models.Profile, { foreignKey: "userId" });
  };

  return User;
};
