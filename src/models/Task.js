import Sequelize from 'sequelize';

export default connect => connect.define('Task', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  creator: Sequelize.INTEGER,
  assignedTo: Sequelize.INTEGER,
}, {
  freezeTableName: true,
  timestamps: false,
});
