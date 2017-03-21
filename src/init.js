import connect from './db';
import getModels from './models';

export default async () => {
  const models = getModels(connect);

  await Promise.all(Object.values(models).map(async (model) => {
    if (model.associate) {
      console.log(model);
      await model.associate(models);
    }
  }))
    .then(async () => {
      console.log('RELATIONS ARE FINISHED!');
      await Promise.all(Object.values(models).map(async model => model.sync({ force: true })));
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
