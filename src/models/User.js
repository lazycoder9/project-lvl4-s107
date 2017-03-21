import Sequelize from 'sequelize';
import { encrypt } from '../lib/secure';

export default connect => connect.define("User", {
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  passwordDigest: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name',
  },
  lastName: {
    type: Sequelize.STRING,
    field: 'last_name',
  },
  password: {
    type: Sequelize.VIRTUAL,
    set: function set(value) {
      this.setDataValue('passwordDigest', encrypt(value));
      this.setDataValue('password', value);
      return value;
    },
    validate: {
      len: [1, +Infinity],
    },
  },
}, {
  getterMethods: {
    fullName: function fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
  },
  classMethods: {
    associate: async function (models) {
      console.log('TRY TO ASSICIATE USER TO TASK AS CREATOR!');
      await models.User.hasMany(models.Task, { foreignKey: 'creatorId', as: 'createdTask' });
      console.log('TRY TO ASSICIATE USER TO TASK AS ASSIGNED!');
      await models.User.hasMany(models.Task, { foreignKey: 'assignedToId', as: 'assignedTo' });
      await models.User.hasMany(models.Comment);
    },
  },
  freezeTableName: true, // Model tableName will be the same as the model name
});
