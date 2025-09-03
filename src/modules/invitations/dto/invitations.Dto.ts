import { z } from 'zod';

export const createMemberSchema = z.object({
  projectId: z.number().min(1),
  userId: z.number().min(1),
  role: z.enum(['OWNER', 'MEMBER', 'INVITED']).default('MEMBER')
})

export const acceptInvitationSchema = z.object({
  projectId: z.number().min(1),
  userId: z.number().min(1),
  role: z.enum(['OWNER', 'MEMBER', 'INVITED']).default('MEMBER')
})

export type CreateMemberDto = z.infer<typeof createMemberSchema>;
export type AcceptInvitationDto = z.infer<typeof acceptInvitationSchema>;