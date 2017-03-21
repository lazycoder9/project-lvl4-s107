import connect from './db';
import getModels from './models';

export default async () => {
  const models = getModels(connect);

  await Promise.all(Object.values(models).map(model => model.sync({ force: true })))
    .then(async () => {
      await Promise.all(Object.values(models).map((model) => {
        if (model.associate) {
          console.log(model);
          model.associate(models);
        }
      }));
    })
    .then(() => {
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
    });


};
