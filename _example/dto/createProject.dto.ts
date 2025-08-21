import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(1000).optional(),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
