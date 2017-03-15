import buildFormObj from '../lib/formObjectBuilder';

export default (router, { Task, User }) => {
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
      const creator = await User.findById(Number(task.dataValues.creator));
      const assignedTo = await User.findById(Number(task.dataValues.assignedTo));
      console.log(creator);
      console.log(assignedTo);
      const data = {
        id: task.dataValues.id,
        name: task.dataValues.name,
        description: task.dataValues.description,
        creator: creator.dataValues.firstName,
        assignedTo: assignedTo.dataValues.firstName,
        status: 'new'
      };

      ctx.render('tasks/task', { task: data });
    })
    .post('tasks', '/tasks', async (ctx) => {
      const form = ctx.request.body.form;
      form.creator = ctx.session.userId;
      const task = Task.build(form);
      try {
        await task.save();
        ctx.flash.set('Task has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('tasks/new', { f: buildFormObj(task, e) });
      }
    });
};
