import connect from './db';
import getModels from './models';

export default async () => {
  const models = getModels(connect);

  await Promise.all(Object.values(models).map((model) => {
    if (model.associate) {
      console.log(model);
      model.associate(models);
    }
  }))
    .then(async (values) => {
      console.log(values);
      await Promise.all(Object.values(models).map(model => model.sync({ force: true })));
    })
    .then((values) => {
      console.log(values);
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
    })
    .catch(err => console.log(err));


};
