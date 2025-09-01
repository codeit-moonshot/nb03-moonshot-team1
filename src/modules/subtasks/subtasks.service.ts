import ApiError from '#errors/ApiError';
import tasksService from '#modules/tasks/tasks.service';
import subtaskRepo from '#modules/subtasks/subtasks.repo';
import { CreateSubtaskDto, DeleteSubtaskDto, UpdateSubtaskDto } from '#modules/subtasks/dto/subtasks.dto';

const checkTaskExists = (taskId: number, userId: number) => {
  const task = tasksService.getTaskById(taskId, userId);
  if (!task) throw new ApiError(404, '할일을 찾을 수 없습니다.');
  return task;
};

const createSubtask = (userId: number, data: CreateSubtaskDto) => {
  checkTaskExists(data.taskId, userId);
  return subtaskRepo.create(data);
};

const getSubtaskList = (taskId: number, userId: number) => {
  checkTaskExists(taskId, userId);
  return subtaskRepo.findMany(taskId);
};

const getSubtaskById = async (userId: number, subtaskId: number) => {
  checkTaskExists(subtaskId, userId);
  return subtaskRepo.findById(subtaskId);
};

const updateSubtask = async (userId: number, data: UpdateSubtaskDto) => {
  checkTaskExists(data.taskId, userId);
  const subtask = await subtaskRepo.findById(data.subtaskId);
  if (!subtask) throw new ApiError(404, '하위 할 일을 찾을 수 없습니다.');

  return subtaskRepo.update(data);
};

const deleteSubtask = async (userId: number, data: DeleteSubtaskDto) => {
  checkTaskExists(data.taskId, userId);
  const subtask = await subtaskRepo.findById(data.subtaskId);
  if (!subtask) throw new ApiError(404, '하위 할 일을 찾을 수 없습니다.');

  return subtaskRepo.remove(data);
};

export default {
  createSubtask,
  getSubtaskList,
  updateSubtask,
  deleteSubtask,
  getSubtaskById,
};
