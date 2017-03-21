import Sequelize from 'sequelize';

export default connect => connect.define('Tag', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  classMethods: {
    associate: function (models) {
      models.Tag.belongsToMany(models.Task, { through: 'TaskTag' });
    },
  },
  freezeTableName: true,
  timestamps: false,
});
