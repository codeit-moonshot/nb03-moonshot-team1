import ApiError from '#errors/ApiError';
import { CreateSubtaskDto, DeleteSubtaskDto, UpdateSubtaskDto } from '#modules/subtasks/dto/subtasks.dto';
import { create, findById, update, remove } from '#modules/subtasks/repo';

export const createSubtask = (data: CreateSubtaskDto) => {
  // TODO:: taskID 존재 여부 확인 추가
  return create(data);
};

export const updateSubtask = async (data: UpdateSubtaskDto) => {
  const subtask = await findById(data.subtaskId);
  if (!subtask) throw new ApiError(404, '하위 할 일을 찾을 수 없습니다.');

  return update(data);
};

export const deleteSubtask = async (data: DeleteSubtaskDto) => {
  if (!Number.isInteger(data.taskId) || data.taskId <= 0) throw new ApiError(400, '하위 할 일 ID가 올바르지 않습니다.');

  const subtask = await findById(data.subtaskId);
  if (!subtask) throw new ApiError(404, '하위 할 일을 찾을 수 없습니다.');

  return remove(data);
};
