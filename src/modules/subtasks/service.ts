import { CreateSubtaskDto } from './dto';
import { create } from './repo';

export const createSubtask = (data: CreateSubtaskDto) => create(data);