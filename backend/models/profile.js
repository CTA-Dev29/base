module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define("Profile", {
    fullName: DataTypes.STRING,
    nim: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  });

  Profile.associate = (models) => {
    Profile.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Profile;
};
