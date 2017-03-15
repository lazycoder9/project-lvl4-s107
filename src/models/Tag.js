import Sequelize from 'sequelize';

export default connect => connect.define('Tag', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  freezeTableName: true,
  timestamps: false,
});
