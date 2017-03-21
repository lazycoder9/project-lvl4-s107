import Sequelize from 'sequelize';

export default connect => connect.define('Status', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
});
