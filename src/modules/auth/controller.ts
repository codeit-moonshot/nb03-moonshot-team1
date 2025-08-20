import type { RequestHandler } from 'express';
import authService from '@/modules/auth/service';
import { RegisterDto } from '@/modules/auth/dto/register.dto';

const register: RequestHandler = async (req, res, next) => {
  const registerDto: RegisterDto = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    profileImage: req.body.profileImage ?? null
  };
  const user = await authService.register(registerDto);
  res.status(201).json(user);
};

export default {
  register
};
