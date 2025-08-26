import { z } from 'zod';

export const taskIdParamsSchema = z.object({
  taskId: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0, 'taskId must be > 0'),
});

export type TaskIdParamsDto = z.infer<typeof taskIdParamsSchema>;
