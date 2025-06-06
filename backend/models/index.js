const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_URI);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user")(sequelize, DataTypes);
db.Profile = require("./profile")(sequelize, DataTypes);
db.Tugas = require("./tugas")(sequelize, DataTypes);
db.matkul = require("./matkul")(sequelize, DataTypes);
db.Jawaban = require("./jawaban")(sequelize, DataTypes);

Object.values(db).forEach(model => {
  if (model.associate) model.associate(db);
});

module.exports = db;
