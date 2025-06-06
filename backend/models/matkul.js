module.exports = (sequelize, DataTypes) => {
  const matkul = sequelize.define('matkul', {
    nama: DataTypes.STRING,
    kode: DataTypes.STRING,
    sks: DataTypes.INTEGER,
    dosen: DataTypes.STRING,
  });
  return matkul;
};