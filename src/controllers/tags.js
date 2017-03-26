import { getDataFromRaw } from '../lib/utils';

export default (router, { Tag }) => {
  router
    .get('tag', '/tag/:id', async (ctx) => {
      const tag = await Tag.findById(Number(ctx.params.id));
      const rawTasks = await tag.getTasks();
      const tasks = await Promise.all(rawTasks.map(async (task) => {
        const { data } = await getDataFromRaw(task);
        return data;
      }));
      ctx.render('tag', { tasks, tag });
    });
};
