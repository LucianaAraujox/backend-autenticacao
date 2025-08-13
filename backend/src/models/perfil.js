module.exports = (sequelize, DataTypes) => {
  const Perfil = sequelize.define('Perfil', {
    bio: DataTypes.TEXT,
    website: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Perfil;
};