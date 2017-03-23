import Sequelize from 'sequelize';

export default connect => connect.define("Task", {
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
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
  freezeTableName: true,
  timestamps: false,
});
