import buildFormObj from '../lib/formObjectBuilder';

export default (router, { User, Task }) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();
      const tasks = await Task.findAll({
        where: {
          creator: 1,
        },
      });
      console.log(tasks);
      ctx.render('users', { users });
    })
    .get('newUser', '/users/new', (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
    })
    .post('users', '/users', async (ctx) => {
      const form = ctx.request.body.form;
      const user = User.build(form);
      try {
        await user.save();
        ctx.flash.set('User has been created');
        ctx.redirect(router.url('root'));
      } catch (e) {
        ctx.render('users/new', { f: buildFormObj(user, e) });
      }
    });
};
