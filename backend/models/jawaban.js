module.exports = (sequelize, DataTypes) => {
  const Jawaban = sequelize.define('Jawaban', {
   
   file: {
      type: DataTypes.BLOB("long"), // tipe untuk gambar
      allowNull: true,
    },
     id_user: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
     id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
     id_tugas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'jawaban',
    timestamps: true,
  })

  Jawaban.associate = (models) => {
    Jawaban.belongsTo(models.Tugas, { foreignKey: "id_tugas" });
    Jawaban.belongsTo(models.User, { foreignKey: "id_user" });
  };
  return Jawaban
}
