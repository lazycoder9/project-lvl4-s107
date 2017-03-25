import buildFormObj from '../lib/formObjectBuilder';
import rollbar from 'rollbar';

export default (router, { User, Task }) => {
  router
    .get('users', '/users', async (ctx) => {
      if (ctx.session.userId) {
        const users = await User.findAll();
        ctx.render('users', { users });
      } else {
        ctx.flash.set('You are not logged in');
        ctx.redirect(router.url('root'));
      }
    })
    .get('user', '/user/:id', async (ctx) => {
      if (ctx.session.userId) {
        const user = await User.findById(Number(ctx.params.id));
        ctx.render('users/profile', { user, signedId: ctx.session.userId });
      } else {
        ctx.flash.set('You are not logged in');
        ctx.redirect(router.url('root'));
      }
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
