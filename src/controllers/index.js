import welcome from './welcome';
import users from './users';
import sessions from './sessions';
import error from './error';
import tasks from './tasks';

const controllers = [welcome, users, sessions, error, tasks];

export default (router, container) => controllers.forEach(f => f(router, container));
