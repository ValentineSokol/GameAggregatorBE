const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class games extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      games.hasMany(models.keys, { foreignKey: 'game_id' });
    }
  }
  games.init({
    steamId: DataTypes.INTEGER,
    keyCount: DataTypes.INTEGER,
    name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    coverUrl: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'games',
  });
  return games;
};
