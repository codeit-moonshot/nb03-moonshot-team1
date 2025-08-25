import { CreateSubtaskDto, UpdateSubtaskDto } from '#modules/subtasks/dto/subtasks.dto';
import { create, update } from '#modules/subtasks/repo';

export const createSubtask = (data: CreateSubtaskDto) => {
  // TODO:: taskID 존재 여부 확인 추가
  return create(data);
};

export const updateSubtask = (data: UpdateSubtaskDto) => update(data);
