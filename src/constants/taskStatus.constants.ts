/**
 * Task 상태
 */
export const TASK_STATUS = ['todo', 'in_progress', 'done'] as const;

/**
 * Task 상태 Type
 */
export type TaskStatus = (typeof TASK_STATUS)[number];
