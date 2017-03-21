import connect from './db';
import getModels from './models';

export default async () => {
  const models = getModels(connect);

  await Promise.all(Object.values(models).map(model => model.sync({ force: true })));
  await Promise.all(Object.values(models).map((model) => {
    if (model.associate) {
      model.associate(models);
    }
    return;
  }));
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
};
