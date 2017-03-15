import connect from './db';
import getModels from './models';

export default async () => {
  const models = getModels(connect);
  const { User, Task, TaskStatus, Tag } = models;
  User.hasMany(Task, { foreignKey: 'creator' });
  Task.belongsTo(User, { foreignKey: 'assignedTo' });
  Task.hasMany(Tag);
  Tag.hasMany(Task);

  await Promise.all(Object.values(models).map(model => model.sync()));
};
