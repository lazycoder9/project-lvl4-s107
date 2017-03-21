import Sequelize from 'sequelize';

export default connect => connect.define('Comment', {
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  classMethods: {
    associate: function (models) {
      models.Comment.belongsTo(models.User);
      models.Comment.belongsTo(models.Task);
    },
  },
  freezeTableName: true,
});
