import { z } from 'zod';
import dns from 'dns/promises';

const emailWithMX = z.string().refine(async (email) => {
  const domain = email.split('@')[1];
  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch {
    return false;
  }
}, {
  message: '유효한 이메일 주소가 아닙니다.'
});

export const invitationSchema = z.object({
  projectId: z.number().min(1),
  targetEmail: emailWithMX,
  invitationToken: z.string().min(10).optional()
});

export type InvitationDto = z.infer<typeof invitationSchema>;