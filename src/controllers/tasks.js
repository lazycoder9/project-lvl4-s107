import url from 'url';
import rollbar from 'rollbar';
import buildFormObj from '../lib/formObjectBuilder';
import { getDataFromRaw, generateSearchQuery } from '../lib/utils';

export default (router, { Task, User, Comment, Status, Tag }) => {
  router
    .get('tasks', '/tasks', async (ctx) => {
      const { query } = url.parse(ctx.request.url, true);
      const where = generateSearchQuery(query, ctx);
      const rawTasks = await Task.findAll({ where });
      const tasks = await Promise.all(rawTasks.map(async (task) => {
        const { data } = await getDataFromRaw(task);
        return data;
      }));
      const statuses = await Status.findAll();
      ctx.render('tasks', { tasks, statuses });
    })
    .get('newTask', '/tasks/new', async (ctx) => {
      const task = Task.build();
      const users = await User.findAll();
      ctx.render('tasks/new', { f: buildFormObj(task), users });
    })
    .get('task', '/tasks/:id', async (ctx) => {
      const task = await Task.findById(Number(ctx.params.id));
      const { data, tags, comments } = await getDataFromTask(task);
      const comment = Comment.build();
      const statuses = await Status.findAll();
      ctx.render('tasks/task', { task: data, comments, statuses, tags, f: buildFormObj(comment) });
    })
    .post('tasks', '/tasks', async (ctx) => {
      const form = ctx.request.body.form;
      const users = await User.findAll();
      const tags = form.Tags.split(' ');
      form.creatorId = ctx.session.userId;
      const task = Task.build(form);
      try {
        await task.save();
        tags.map(tag => Tag.findOne({ where: { name: tag } })
            .then(async result => (result ? await task.addTag(result) : await task.createTag({ name: tag }))));
        ctx.flash.set('Task has been created');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        rollbar.handleError(e);
        ctx.render('tasks/new', { f: buildFormObj(task, e), users });
      }
    })
    .patch('/task', async (ctx) => {
      const { statusId, taskId } = ctx.request.body;
      const task = await Task.findById(Number(taskId));
      task.setStatus(Number(statusId));
      ctx.redirect(`/tasks/${taskId}`);
    })
    .delete('/task/:id', async (ctx) => {
      const taskId = Number(ctx.params.id);
      Task.destroy({
        where: { id: taskId },
      });
      ctx.flash.set('Task has been deleted');
      ctx.redirect(router.url('tasks'));
    });
};
