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
    static associate() {
      // define association here
    }
  }
  games.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    cover_url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'games',
  });
  return games;
};
