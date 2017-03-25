import url from 'url';
import buildFormObj from '../lib/formObjectBuilder';
import getDataFromTask from '../lib/getDataFromTask';

const generateSearchQuery = (params, ctx) => {
  const where = {};
  if (params.category && params.category !== 'All') {
    where[params.category] = ctx.session.userId;
  }
  if (params.status && params.status !== 'All') {
    where["StatusId"] = Number(params.status);
  }

  return where;
};

export default (router, { Task, User, Comment, Status, Tag }) => {
  router
    .get('tasks', '/tasks', async (ctx) => {
      if (ctx.session.userId) {
        const { query } = url.parse(ctx.request.url, true);
        console.log(query);
        const search = generateSearchQuery(query, ctx);
        console.log(search);
        const rawTasks = await Task.findAll({ where: search });
        const tasks = await Promise.all(rawTasks.map(async (task) => {
          const { data } = await getDataFromTask(task);
          return data;
        }));
        const statuses = await Status.findAll();
        ctx.render('tasks', { tasks, statuses });
      } else {
        ctx.flash.set('You are not logged in');
        ctx.redirect(router.url('root'));
      }
    })
    .get('newTask', '/tasks/new', async (ctx) => {
      if (ctx.session.userId) {
        const task = Task.build();
        const users = await User.findAll();
        ctx.render('tasks/new', { f: buildFormObj(task), users });
      } else {
        ctx.flash.set('You are not logged in');
        ctx.redirect(router.url('root'));
      }
    })
    .get('task', '/tasks/:id', async (ctx) => {
      if (ctx.session.userId) {
        const task = await Task.findById(Number(ctx.params.id));
        const { data, tags, comments } = await getDataFromTask(task);
        const comment = Comment.build();
        const statuses = await Status.findAll();
        ctx.render('tasks/task', { task: data, comments, statuses, tags, f: buildFormObj(comment) });
      } else {
        ctx.flash.set('You are not logged in');
        ctx.redirect(router.url('root'));
      }
    })
    .post('tasks', '/tasks', async (ctx) => {
      const form = ctx.request.body.form;
      console.log(form);
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
