import Sequelize from 'sequelize';
import { encrypt } from '../lib/secure';

export default connect => connect.define("User", {
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
    allowNull: false,
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
    len: [3, +Infinity],
  },
  lastName: {
    type: Sequelize.STRING,
    field: 'last_name',
    len: [3, +Infinity],
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
  freezeTableName: true, // Model tableName will be the same as the model name
});
