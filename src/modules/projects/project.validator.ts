import type { RequestHandler } from 'express';
import forwardZodError from '#utils/zod';
import { createProjectSchema, updateProjectSchema } from './dto/project.dto';

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
}

export default {
  validateCreateProject,
  validateUpdateProject
}
