import buildFormObj from '../lib/formObjectBuilder';
import rollbar from 'rollbar';

export default (router, { User, Task }) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();
      ctx.render('users', { users });
    })
    .get('user', '/users/:id', async (ctx) => {
      const user = await User.findById(Number(ctx.params.id));
      ctx.render('users/profile', { user, signedId: ctx.session.userId });
    })
    .get('newUser', '/user/new', (ctx) => {
      const user = User.build();
      ctx.render('users/new', { f: buildFormObj(user) });
    })
    .post('/user/new', async (ctx) => {
      const form = ctx.request.body.form;
      const user = User.build(form);
      try {
        await user.save();
        ctx.flash.set('User has been created. Please log in');
        ctx.redirect(router.url('newSession'));
      } catch (e) {
        rollbar.handleError(e);
        ctx.render('users/new', { f: buildFormObj(user, e) });
      }
    })
    .delete('/user/:id', async (ctx) => {
      const userId = Number(ctx.params.id);
      User.destroy({
        where: { id: userId },
      });
      ctx.flash.set('User has been deleted');
      ctx.session = {};
      ctx.redirect(router.url('root'));
    });
};
