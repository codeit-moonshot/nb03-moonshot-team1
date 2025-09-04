import tasksService from '#modules/tasks/tasks.service';
import subtaskRepo from '#modules/subtasks/subtasks.repo';
import ApiError from '#errors/ApiError';
import {
  CreateSubtaskDto,
  DeleteSubtaskDto,
  UpdateSubtaskDto,
  PublicSubtaskDto,
  SubtaskListResponse,
} from '#modules/subtasks/dto/subtasks.dto';

const checkTaskExists = async (taskId: number, userId: number): Promise<void> => {
  await tasksService.getTaskById(taskId, userId);
};

const createSubtask = async (userId: number, data: CreateSubtaskDto): Promise<PublicSubtaskDto> => {
  await checkTaskExists(data.taskId, userId);
  return subtaskRepo.create(data);
};

const getSubtaskList = async (taskId: number, userId: number): Promise<SubtaskListResponse> => {
  await checkTaskExists(taskId, userId);
  return subtaskRepo.findMany(taskId);
};

const getSubtaskById = async (subtaskId: number): Promise<PublicSubtaskDto | null> => {
  return subtaskRepo.findById(subtaskId);
};

const updateSubtask = async (userId: number, data: UpdateSubtaskDto): Promise<PublicSubtaskDto> => {
  const subtask = await subtaskRepo.findById(data.subtaskId);
  if (!subtask) throw ApiError.notFound('하위 할 일을 찾을 수 없습니다.');

  await checkTaskExists(subtask.taskId, userId);

  const status: 'done' | 'todo' = data.status === 'done' ? 'done' : 'todo';

  return subtaskRepo.update(data.subtaskId, status);
};

const deleteSubtask = async (userId: number, data: DeleteSubtaskDto): Promise<void> => {
  const subtask = await subtaskRepo.findById(data.subtaskId);
  if (!subtask) throw ApiError.notFound('하위 할 일을 찾을 수 없습니다.');

  await checkTaskExists(subtask.taskId, userId);

  await subtaskRepo.remove(data.subtaskId);
};

export default {
  createSubtask,
  getSubtaskList,
  updateSubtask,
  deleteSubtask,
  getSubtaskById,
};
