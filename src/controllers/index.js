import welcome from './welcome';
import users from './users';
import sessions from './sessions';
import error from './error';
import tasks from './tasks';
import comments from './comments';
import tags from './tags';

const controllers = [welcome, users, sessions, error, tasks, comments, tags];

export default (router, container) => controllers.forEach(f => f(router, container));
