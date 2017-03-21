import Sequelize from 'sequelize';

export default connect => connect.define("Task", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: Sequelize.TEXT,
  StatusId: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
}, {
  getterMethods: {
    statusName: async function statusName() {
      const status = await this.getStatus();
      return status.dataValues.name;
    },
  },
  classMethods: {
    associate: function (models) {
      models.Task.belongsTo(models.User, { as: 'creator' });
      models.Task.belongsTo(models.User, { as: 'assignedTo' });
      models.Task.belongsTo(models.Status);
      models.Task.hasMany(models.Comment);
      models.Task.belongsToMany(models.Tag, { through: 'TaskTag' });
    },
  },
  freezeTableName: true,
  timestamps: false,
});
