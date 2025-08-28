import tasksRepo from '#modules/tasks/tasks.repo';
import { de } from 'zod/v4/locales/index.cjs';

const updateGoogleAccessToken = async (userId: number, accessToken: string, expiryDate: Date) => {
  const updatedAccount = await tasksRepo.updateGoogleAccessToken(userId, accessToken, expiryDate);
  return updatedAccount;
};

export default {
  updateGoogleAccessToken,
};
