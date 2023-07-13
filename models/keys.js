const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class keys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  keys.init({
    game_id: DataTypes.INTEGER,
    key: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'keys',
  });
  return keys;
};
