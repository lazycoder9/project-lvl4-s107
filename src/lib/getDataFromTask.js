export default async (task) => {
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
