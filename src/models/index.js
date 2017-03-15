import getUser from './User';
import getStatus from './TaskStatus';
import getTag from './Tag';
import getTask from './Task';

export default connect => ({
  User: getUser(connect),
  TaskStatus: getStatus(connect),
  Tag: getTag(connect),
  Task: getTask(connect),
});
