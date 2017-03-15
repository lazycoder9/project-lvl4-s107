export default (router) => {
  router.get('/not_found', (ctx) => {
    ctx.status = 404;
    ctx.render('error/index');
  });
}
