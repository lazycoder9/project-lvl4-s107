import getDataFromTask from '../lib/getDataFromTask';

export default (router, { Tag }) => {
  router
    .get('tag', '/tag/:id', async (ctx) => {
      const tag = await Tag.findById(Number(ctx.params.id));
      const rawTasks = await tag.getTasks();
      const tasks = await Promise.all(rawTasks.map(async (task) => {
        const { data } = await getDataFromTask(task);
        return data;
      }));
      ctx.render('tag', { tasks, tag });
    });
};
