// @flow

import 'babel-polyfill';

import path from 'path';
import Koa from 'koa';
import Pug from 'koa-pug';
import Router from 'koa-router';
import koaLogger from 'koa-logger';
import serve from 'koa-static';
import middleware from 'koa-webpack';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import flash from 'koa-flash-simple';
import _ from 'lodash';
import methodOverride from 'koa-methodoverride';
import rollbar from 'rollbar';

import getWebpackConfig from '../webpack.config.babel';
import addRoutes from './controllers';
import container from './container';

export default () => {
  const app = new Koa();

  app.keys = ['some secret hurr'];
  app.use(session(app));
  app.use(flash());
  app.use(async (ctx, next) => {
    ctx.state = {
      flash: ctx.flash,
      isSignedIn: () => ctx.session.userId !== undefined,
      signedId: () => ctx.session.userId,
    };
    await next();
  });
  app.use(bodyParser());
  app.use(methodOverride((req) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      return req.body._method;
    }
  }));
  app.use(serve(path.join(__dirname, '..', 'public')));
  app.use(middleware({
    config: getWebpackConfig(),
  }));
  app.use(koaLogger());

  const router = new Router();
  const isAuthenticated = async (ctx, next) => {
    if (ctx.session.userId) {
      await next();
    } else {
      ctx.flash.set('You are not logged in');
      ctx.redirect(router.url('root'));
    }
  };
  router.use('/users', isAuthenticated);
  router.use('/tasks', isAuthenticated);
  addRoutes(router, container);

  app.use(router.allowedMethods());
  app.use(router.routes());
  app.use(async (ctx) => {
    if (ctx.status !== 404) {
      return;
    }
    ctx.redirect('/not_found');
  });

  const pug = new Pug({
    viewPath: path.join(__dirname, 'views'),
    debug: true,
    pretty: true,
    compileDebug: true,
    locals: [],
    basedir: path.join(__dirname, 'views'),
    helperPath: [
      { _ },
      { urlFor: (...args) => router.url(...args) },
    ],
  });
  pug.use(app);
  const options = {
    exitOnUncaughtException: true,
  };

  rollbar.init('e6d974c48e184f71b51b5f5345bb5222');
  rollbar.errorHandler('e6d974c48e184f71b51b5f5345bb5222');
  rollbar.handleUnhandledRejections('e6d974c48e184f71b51b5f5345bb5222');
  rollbar.handleUncaughtExceptions('e6d974c48e184f71b51b5f5345bb5222', options);

  return app;
};
