import type { RequestHandler } from 'express';
import subtaskService from '#modules/subtasks/service';
import { CreateSubtaskDto, DeleteSubtaskDto, UpdateSubtaskDto } from '#modules/subtasks/dto/subtasks.dto';

/**
 * @function createSubtask
 * @description 하위 할 일을 생성합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {201} 생성된 하위 할 일 반환
 */
const createSubtask: RequestHandler = async (req, res) => {
  const dto: CreateSubtaskDto = {
    title: req.body.title,
    taskId: Number(req.params.taskId),
  };

  const subtask = await subtaskService.createSubtask(dto);
  res.status(201).json(subtask);
};

/**
 * @function getSubtaskList
 * @description 하위 할 일 목록을 조회합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 하위 할 일 목록 반환
 */
const getSubtaskList: RequestHandler = (req, res) => {
  res.send('getSubtaskList');
};

/**
 * @function updateSubtask
 * @description 하위 할 일의 정보를 수정합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 수정된 하위 할 일 반환
 * @throws {400} 잘못된 ID
 * @throws {403} 권한 없음
 * @throws {404} 하위 할 일을 찾을 수 없는 경우
 */
const updateSubtask: RequestHandler = async (req, res) => {
  const dto: UpdateSubtaskDto = {
    status: req.body.status,
    taskId: Number(req.params.taskId),
    subtaskId: Number(req.params.subtaskId),
  };
  const subtask = await subtaskService.updateSubtask(dto);
  res.send(subtask);
};

/**
 * @function deleteSubtask
 * @description 하위 할 일을 삭제합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {204} 삭제 성공
 * @throws {400} 잘못된 ID
 * @throws {403} 권한 없음
 * @throws {404} 하위 할 일을 찾을 수 없는 경우
 */
const deleteSubtask: RequestHandler = async (req, res) => {
  const dto: DeleteSubtaskDto = {
    subtaskId: Number(req.params.subtaskId),
    taskId: Number(req.params.taskId),
  };
  await subtaskService.deleteSubtask(dto);
  res.status(204).end();
};

export default {
  createSubtask,
  getSubtaskList,
  updateSubtask,
  deleteSubtask,
};
