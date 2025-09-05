import { z } from 'zod';

export const acceptInvitationSchema = z.object({
  projectId: z.number().min(1),
  userId: z.number().min(1),
  role: z.enum(['OWNER', 'MEMBER', 'INVITED']).default('MEMBER')
})

export type AcceptInvitationDto = z.infer<typeof acceptInvitationSchema>;