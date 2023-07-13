const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  reviews.init({
    game_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    recommended: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'reviews',
  });
  return reviews;
};
