import getUser from './User';
import getStatus from './Status';
import getTag from './Tag';
import getTask from './Task';
import getComment from './Comment';
import getTaskTag from './TaskTag';

export default (connect) => {
  const models = {
    User: getUser(connect),
    Status: getStatus(connect),
    Task: getTask(connect),
    Tag: getTag(connect),
    Comment: getComment(connect),
    TaskTag: getTaskTag(connect),
  };
  models.User.hasMany(models.Task, { foreignKey: 'creatorId', as: 'createdTask' });
  models.User.hasMany(models.Task, { foreignKey: 'assignedToId', as: 'assignedTo' });
  models.User.hasMany(models.Comment);
  models.Task.belongsTo(models.User, { as: 'creator' });
  models.Task.belongsTo(models.User, { as: 'assignedTo' });
  models.Task.belongsTo(models.Status);
  models.Task.hasMany(models.Comment);
  models.Task.belongsToMany(models.Tag, { through: 'TaskTag' });
  models.Tag.belongsToMany(models.Task, { through: 'TaskTag' });
  models.Status.hasMany(models.Task);
  models.Comment.belongsTo(models.User);
  models.Comment.belongsTo(models.Task);
  return models;
};
