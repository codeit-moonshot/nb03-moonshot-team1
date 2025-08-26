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
  invitationToken: z.string(),
  inviter: z.number().min(1).optional()
});

export type ExcludeMemberDto = {
  projectId: number;
  targetUserId: number;
}
export type InvitationDto = z.infer<typeof invitationSchema>;

export const createMemberSchema = z.object({
  projectId: z.number().min(1),
  userId: z.number().min(1),
  role: z.enum(['OWNER', 'MEMBER']).default('MEMBER')
})

export const acceptInvitationSchema = z.object({
  projectId: z.number().min(1),
  email: z.email(),
  role: z.enum(['OWNER', 'MEMBER']).default('MEMBER'),
  invitationId: z.number().min(1),
  invitationToken: z.string()
})

export type CreateMemberDto = z.infer<typeof createMemberSchema>;
export type AcceptInvitationDto = z.infer<typeof acceptInvitationSchema>;