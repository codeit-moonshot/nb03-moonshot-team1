import tasksRepo from '#modules/tasks/tasks.repo';
import { UpdateGoogleAccessTokenDto } from '#modules/tasks/dto/googleEvent.dto';

const updateGoogleAccessToken = async (updateGoogleAccessTokenDto: UpdateGoogleAccessTokenDto) => {
  const updatedAccount = await tasksRepo.updateGoogleAccessToken(updateGoogleAccessTokenDto);
  return updatedAccount;
};

export default {
  updateGoogleAccessToken,
};
