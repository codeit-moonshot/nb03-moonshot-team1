import type { RequestHandler } from 'express';
import forwardZodError from '#utils/zod';
import { createProjectSchema, projectMemberQuerySchema, updateProjectSchema } from '#modules/projects/dto/projects.dto';
import { meProjectQuerySchema } from '#modules/projects/dto/me-projects.dto';

const validateCreateProject: RequestHandler = async (req, res, next) => {
  try {
    createProjectSchema.parse(req.body);
    next();
  } catch (err) {
    forwardZodError(err, '프로젝트 생성', next);
  }
};

const validateUpdateProject: RequestHandler = async (req, res, next) => {
  try {
    updateProjectSchema.parse(req.body);
    next();
  } catch (err) {
    forwardZodError(err, '프로젝트 수정', next);
  }
};

const validateProjectMemberQuery: RequestHandler = async (req, res, next) => {
  try {
    res.locals.projectMemberQuery = projectMemberQuerySchema.parse(req.query);
    next();
  } catch (err) {
    forwardZodError(err, '프로젝트 멤버 조회', next);
  }
};

const validateMeProjectQuery: RequestHandler = async (req, res, next) => {
  try {
    res.locals.meProjectQuery = meProjectQuerySchema.parse(req.query);
    next();
  } catch (err) {
    forwardZodError(err, '내 프로젝트 조회', next);
  }
};

export default {
  validateCreateProject,
  validateUpdateProject,
  validateProjectMemberQuery,
  validateMeProjectQuery,
};
