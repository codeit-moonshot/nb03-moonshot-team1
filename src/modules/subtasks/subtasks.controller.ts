import type { RequestHandler } from 'express';
import subtaskService from '#modules/subtasks/subtasks.service';
import { CreateSubtaskDto, DeleteSubtaskDto, UpdateSubtaskDto } from '#modules/subtasks/dto/subtasks.dto';

/**
 * @function createSubtask
 * @description 하위 할 일을 생성합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {201} 생성된 하위 할 일 반환
 *
 * @throws {401} 토큰 없음,토큰 유효하지 않음
 * @throws {403} 프로젝트 접근 권한 없음
 * @throws {404} 할일을 찾을 수 없는 경우
 */

const createSubtask: RequestHandler = async (req, res) => {
  const dto: CreateSubtaskDto = {
    title: req.body.title,
    taskId: Number(req.params.taskId),
  };
  const userId = Number(req.user.id);
  const subtask = await subtaskService.createSubtask(userId, dto);
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
 *
 * @throws {401} 토큰 없음,토큰 유효하지 않음
 * @throws {403} 프로젝트 접근 권한 없음
 * @throws {404} 할일을 찾을 수 없는 경우
 */

const getSubtaskList: RequestHandler = async (req, res) => {
  const taskId = Number(req.params.taskId);
  const userId = Number(req.user.id);
  const { data } = await subtaskService.getSubtaskList(taskId, userId);
  res.json(data);
};

/**
 * @function getSubtaskId
 * @description 특정 하위 할 일을 조회합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 특정 하위 할 일 반환
 *
 * @throws {400} 잘못된 ID
 * @throws {401} 토큰 없음,토큰 유효하지 않음
 * @throws {403} 프로젝트 접근 권한 없음
 * @throws {404} 할일을 찾을 수 없는 경우
 * @throws {404} 하위 할 일을 찾을 수 없는 경우
 */

const getSubtaskId: RequestHandler = async (req, res) => {
  const subtaskId = Number(req.params.subtaskId);
  const subtask = await subtaskService.getSubtaskById(subtaskId);
  res.send(subtask);
};

/**
 * @function updateSubtask
 * @description 하위 할 일의 정보를 수정합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 수정된 하위 할 일 반환
 *
 * @throws {400} 잘못된 ID
 * @throws {401} 토큰 없음,토큰 유효하지 않음
 * @throws {403} 프로젝트 접근 권한 없음
 * @throws {404} 하위 할 일을 찾을 수 없는 경우
 */
const updateSubtask: RequestHandler = async (req, res) => {
  const dto: UpdateSubtaskDto = {
    status: req.body.status,
    taskId: Number(req.params.taskId),
    subtaskId: Number(req.params.subtaskId),
  };
  const userId = Number(req.user.id);
  const subtask = await subtaskService.updateSubtask(userId, dto);
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
 *
 * @throws {400} 잘못된 ID
 * @throws {401} 토큰 없음,토큰 유효하지 않음
 * @throws {403} 프로젝트 접근 권한 없음
 * @throws {404} 할일을 찾을 수 없는 경우
 * @throws {404} 하위 할 일을 찾을 수 없는 경우
 */
const deleteSubtask: RequestHandler = async (req, res) => {
  const dto: DeleteSubtaskDto = {
    subtaskId: Number(req.params.subtaskId),
    taskId: Number(req.params.taskId),
  };
  const userId = Number(req.user.id);
  await subtaskService.deleteSubtask(userId, dto);
  res.status(204).end();
};

export default {
  createSubtask,
  getSubtaskList,
  getSubtaskId,
  updateSubtask,
  deleteSubtask,
};
