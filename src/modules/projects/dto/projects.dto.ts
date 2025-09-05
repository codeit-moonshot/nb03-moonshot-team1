import { z } from 'zod';
import dns from 'dns/promises';

const emailWithMX = z.string().refine(
  async (email) => {
    const domain = email.split('@')[1];
    try {
      const records = await dns.resolveMx(domain);
      return records && records.length > 0;
    } catch {
      return false;
    }
  },
  {
    message: '유효한 이메일 주소가 아닙니다.',
  }
);

export const createProjectSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500),
});

export const updateProjectSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
});

export type createProjectDto = z.infer<typeof createProjectSchema>;
export type updateProjectDto = z.infer<typeof updateProjectSchema>;

export const projectMemberQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(5),
});
export type projectMemberQueryDto = z.infer<typeof projectMemberQuerySchema>;

export const invitationSchema = z.object({
  projectId: z.number().min(1),
  targetEmail: emailWithMX,
  invitationToken: z.string().optional(),
  inviter: z.number().min(1).optional(),
});

export type ExcludeMemberDto = {
  projectId: number;
  targetUserId: number;
};
export type InvitationDto = z.infer<typeof invitationSchema>;
