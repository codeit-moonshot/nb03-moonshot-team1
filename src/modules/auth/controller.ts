import type { RequestHandler } from 'express';
import authService from '#modules/auth/service';
import { RegisterDto } from '#modules/auth/dto/register.dto';
import { LoginDto } from '#modules/auth/dto/login.dto';

const register: RequestHandler = async (req, res, next) => {
  const registerDto: RegisterDto = {
    email: req.body.email.toLowerCase(),
    name: req.body.name,
    password: req.body.password,
    profileImage: req.body.profileImage ?? null
  };
  const user = await authService.register(registerDto);
  res.status(201).json(user);
};

const login: RequestHandler = async (req, res, next) => {
  const loginDto: LoginDto = {
    email: req.body.email.toLowerCase(),
    password: req.body.password
  };
  const token = await authService.login(loginDto);
  res.status(200).json(token);
};


export default {
  register,
  login
};
