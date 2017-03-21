import buildFormObj from '../lib/formObjectBuilder';

export default (router, { Task, User, Comment, Status, Tag }) => {
  router
    .get('tasks', '/tasks', async (ctx) => {
      const tasks = await Task.findAll();
      ctx.render('tasks', { tasks });
    })
    .get('newTask', '/tasks/new', async (ctx) => {
      const task = Task.build();
      const users = await User.findAll();
      ctx.render('tasks/new', { f: buildFormObj(task), users });
    })
    .get('task', '/tasks/:id', async (ctx) => {
      const task = await Task.findById(Number(ctx.params.id));
      const tags = await task.getTags();
      const comment = Comment.build();
      const comments = await task.getComments({
        order: 'createdAt DESC',
      });
      const creator = await task.getCreator();
      const assignedTo = await task.getAssignedTo();
      const statuses = await Status.findAll();
      const status = await task.statusName;
      const data = {
        id: task.dataValues.id,
        name: task.dataValues.name,
        description: task.dataValues.description,
        creator: creator.fullName,
        assignedTo: assignedTo.fullName,
        status,
      };
      ctx.render('tasks/task', { task: data, comments, statuses, tags, f: buildFormObj(comment) });
    })
    .post('tasks', '/tasks', async (ctx) => {
      const form = ctx.request.body.form;
      const tags = form.Tags.split(' ');
      form.creatorId = ctx.session.userId;
      const task = Task.build(form);
      try {
        await task.save();
        tags.map((tag) => {
          return Tag.findOne({ where: { name: tag } })
            .then(async result => result ? await task.addTag(result) : await task.createTag({ name: tag }))
        });
        ctx.flash.set('Task has been created');
        ctx.redirect(router.url('tasks'));
      } catch (e) {
        ctx.render('tasks/new', { f: buildFormObj(task, e) });
      }
    })
    .patch('/task', async (ctx) => {
      const { statusId, taskId } = ctx.request.body;
      const task = await Task.findById(Number(taskId));
      task.setStatus(Number(statusId));
      ctx.redirect(`/tasks/${taskId}`);
    });
};
