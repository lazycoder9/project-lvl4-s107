import connect from './db';
import getModels from './models';

export default async () => {
  const models = getModels(connect);

  await models.User.sync({ force: true });
  await models.Status.sync({ force: true });
  await models.Task.sync({ force: true });
  await models.Tag.sync({ force: true });
  await models.Comment.sync({ force: true });
  await models.Stats.sync({ force: true });

  /*await Promise.all(Object.values(models).map(model => model.sync({ force: true })))
    .then((values) => {
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
    .catch(err => console.log(err));*/
};
