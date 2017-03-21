import Sequelize from 'sequelize';

export default connect => connect.define("Comment", {
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});
