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
    validate: {
      max: 4,
    },
  },
  creatorId: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: true,
    },
  },
  assignedToId: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: true,
    },
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
