import connect from './db';
import getModels from './models';

export default async () => {
  const models = getModels(connect);

  await Promise.all(Object.values(models).map(model => model.sync({ force: true })));
  models.User.bulkCreate([
    {
      email: 'test1@test.com',
      firstName: 'one',
      lastName: 'one',
      password: '123',
    },
    {
      email: 'test2@test.com',
      firstName: 'two',
      lastName: 'two',
      password: '123',
    },
  ]);

  models.Status.bulkCreate([
    {
      name: 'New',
    },
    {
      name: 'Doing',
    },
    {
      name: 'Testing',
    },
    {
      name: 'Done',
    },
  ]);

  models.Task.bulkCreate([
    {
      name: 'task for 2',
      description: 'description',
      creatorId: 1,
      assignedToId: 2,
    },
    {
      name: 'task for 1',
      description: 'description',
      creatorId: 2,
      assignedToId: 1,
    },
  ]);
};
