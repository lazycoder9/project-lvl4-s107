import buildFormObj from '../lib/formObjectBuilder';

export default (router, { Comment, User, Task }) => {
  router
    .post('comments', '/comments/:taskId', async (ctx) => {
      const form = ctx.request.body.form;
      form.UserId = ctx.session.userId;
      form.TaskId = Number(ctx.params.taskId);
      const comment = Comment.build(form);
      try {
        await comment.save();
        ctx.flash.set('Comment has been created');
        ctx.redirect('/tasks/' + form.TaskId);
      } catch (e) {
        ctx.render('users/new', { f: buildFormObj(comment, e) });
      }
    });
};
