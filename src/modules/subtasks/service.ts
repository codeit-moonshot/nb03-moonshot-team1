import ApiError from '#errors/ApiError';
import { CreateSubtaskDto, DeleteSubtaskDto, UpdateSubtaskDto } from '#modules/subtasks/dto/subtasks.dto';
import subtaskRepo from '#modules/subtasks/repo';

const createSubtask = (data: CreateSubtaskDto) => {
  // TODO:: taskID 존재 여부 확인 추가
  return subtaskRepo.create(data);
};

const getSubtaskList = (taskId: number) => {
  return subtaskRepo.findMany(taskId);
};

const updateSubtask = async (data: UpdateSubtaskDto) => {
  const subtask = await subtaskRepo.findById(data.subtaskId);
  if (!subtask) throw new ApiError(404, '하위 할 일을 찾을 수 없습니다.');

  return subtaskRepo.update(data);
};

const deleteSubtask = async (data: DeleteSubtaskDto) => {
  const subtask = await subtaskRepo.findById(data.subtaskId);
  if (!subtask) throw new ApiError(404, '하위 할 일을 찾을 수 없습니다.');

  return subtaskRepo.remove(data);
};

export default {
  createSubtask,
  getSubtaskList,
  updateSubtask,
  deleteSubtask,
};
