module.exports = (sequelize, DataTypes) => {
  const Tugas = sequelize.define('Tugas', {
   
    judul: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_matkul: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'tugas',
    timestamps: true,
  })

  Tugas.associate = (models) => {
    Tugas.belongsTo(models.matkul, { foreignKey: "id_matkul" });
  };
  return Tugas
}
