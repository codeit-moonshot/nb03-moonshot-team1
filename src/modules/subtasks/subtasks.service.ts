import tasksService from '#modules/tasks/tasks.service';
import subtaskRepo from '#modules/subtasks/subtasks.repo';
import ApiError from '#errors/ApiError';
import { CreateSubtaskDto, DeleteSubtaskDto, UpdateSubtaskDto } from '#modules/subtasks/dto/subtasks.dto';

const checkTaskExists = async (taskId: number, userId: number) => {
  const task = await tasksService.getTaskById(taskId, userId);
  if (!task) throw ApiError.notFound('할일을 찾을 수 없습니다.');
  return task;
};

const createSubtask = async (userId: number, data: CreateSubtaskDto) => {
  await checkTaskExists(data.taskId, userId);
  return subtaskRepo.create(data);
};

const getSubtaskList = async (taskId: number, userId: number) => {
  await checkTaskExists(taskId, userId);
  return subtaskRepo.findMany(taskId);
};

const getSubtaskById = async (subtaskId: number) => {
  return subtaskRepo.findById(subtaskId);
};

const updateSubtask = async (data: UpdateSubtaskDto) => {
  const subtask = await subtaskRepo.findById(data.subtaskId);
  if (!subtask) throw ApiError.notFound('하위 할 일을 찾을 수 없습니다.');
  return subtaskRepo.update(data);
};

const deleteSubtask = async (data: DeleteSubtaskDto) => {
  const subtask = await subtaskRepo.findById(data.subtaskId);
  if (!subtask) throw ApiError.notFound('하위 할 일을 찾을 수 없습니다.');
  return subtaskRepo.remove(data);
};

export default {
  createSubtask,
  getSubtaskList,
  updateSubtask,
  deleteSubtask,
  getSubtaskById,
};
