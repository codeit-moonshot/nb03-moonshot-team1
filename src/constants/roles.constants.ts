export const PROJECT_ROLES = { OWNER: 'OWNER', MEMBER: 'MEMBER' } as const;
export type ProjectRole = keyof typeof PROJECT_ROLES;
