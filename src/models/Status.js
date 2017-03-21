import Sequelize from 'sequelize';

export default connect => connect.define('Status', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  classMethods: {
    associate: function (models) {
      models.Status.hasMany(models.Task);
    }
  },
  freezeTableName: true,
  timestamps: false,
});
