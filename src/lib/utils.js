export const getDataFromRaw = async (task) => {
  const tags = await task.getTags();
  const comments = await task.getComments({
    order: '"createdAt" DESC',
  });
  const creator = await task.getCreator();
  const assignedTo = await task.getAssignedTo();
  const status = await task.statusName;
  const data = {
    id: task.dataValues.id,
    name: task.dataValues.name,
    description: task.dataValues.description,
    creator: creator.fullName,
    assignedTo: assignedTo.fullName,
    status,
  };

  return { data, tags, comments };
};

export const generateSearchQuery = (params, ctx) => {
  const where = {};
  if (params.category && params.category !== 'All') {
    where[params.category] = ctx.session.userId;
  }
  if (params.status && params.status !== 'All') {
    where["StatusId"] = Number(params.status);
  }

  return where;
};
