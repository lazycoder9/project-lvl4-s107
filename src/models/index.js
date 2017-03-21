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
  // User.hasMany(Task, { foreignKey: 'creatorId', as: 'createdTask' });
  // User.hasMany(Task, { foreignKey: 'assignedToId', as: 'assignedTo' });
  // User.hasMany(Comment);
  // Task.belongsTo(User, { as: 'creator' });
  // Task.belongsTo(User, { as: 'assignedTo' });
  // Task.belongsTo(Status);
  // Task.hasMany(Comment);
  // Task.belongsToMany(Tag, { through: 'TaskTag' });
  // Tag.belongsToMany(Task, { through: 'TaskTag' });
  // Status.hasMany(Task);
  // Comment.belongsTo(User);
  // Comment.belongsTo(Task);
  return models;
};
