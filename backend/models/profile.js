module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define("Profile", {
    fullName: DataTypes.STRING,
    age: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  });

  Profile.associate = (models) => {
    Profile.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Profile;
};
