import prisma from '#prisma/prisma';
import { ProjectRole, TaskStatus, SocialProvider } from '@prisma/client';

const DAYS = (n: number) => n * 24 * 60 * 60 * 1000;

const ensureUser = async (params: {
  email: string;
  name: string;
  password?: string | null;
  profileImage?: string | null;
}) => {
  const { email, name, password, profileImage = null } = params;
  return prisma.user.upsert({
    where: { email },
    update: { name, profileImage },
    create: { email, name, password, profileImage },
  });
};

const ensureTag = async (name: string) => {
  return prisma.tag.upsert({
    where: { name },
    update: {},
    create: { name },
  });
};

const main = async (): Promise<void> => {
  // user
  const user1 = await ensureUser({
    email: 'user1@test.com',
    name: 'User1',
    password: '$2a$10$PJAFbu5iwvbvCUy429XTvO5.5B2HTuiJDMHBzIlT0Rt02CT/NEjmG', // 12345678
  });

  const user2 = await ensureUser({
    email: 'user2@test.com',
    name: 'User2',
    password: '$2a$10$/UGSBBwtEt.twkDP/3NMau24CEHykn5hSOjq5LwhDoH00JtHQUdr2', //1q2w3e4r
  });

  // Project / Members
  const project =
    (await prisma.project.findFirst({ where: { name: 'Demo', ownerId: user1.id } })) ??
    (await prisma.project.create({
      data: {
        name: 'Demo',
        description: 'Demo project',
        ownerId: user1.id,
      },
    }));

  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: user1.id } },
    update: { role: ProjectRole.OWNER },
    create: { projectId: project.id, userId: user1.id, role: ProjectRole.OWNER },
  });

  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: user2.id } },
    update: { role: ProjectRole.MEMBER },
    create: { projectId: project.id, userId: user2.id, role: ProjectRole.MEMBER },
  });

  // Tags
  const [urgent, backend, design] = await Promise.all([ensureTag('urgent'), ensureTag('backend'), ensureTag('design')]);

  // Task / Subtask / Comment / Tag link
  await prisma.$transaction(async (tx) => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + DAYS(7));

    const task1 =
      (await tx.task.findFirst({ where: { projectId: project.id, title: '프로젝트 초기 세팅' } })) ??
      (await tx.task.create({
        data: {
          projectId: project.id,
          assigneeId: user1.id,
          title: '프로젝트 초기 세팅',
          description: '리포지토리 구조, TS/ESLint/Prettier, Prisma 설정',
          status: TaskStatus.in_progress,
          startDate: now,
          endDate: nextWeek,
        },
      }));

    const task2 =
      (await tx.task.findFirst({ where: { projectId: project.id, title: 'API 설계 초안' } })) ??
      (await tx.task.create({
        data: {
          projectId: project.id,
          assigneeId: user2.id,
          title: 'API 설계 초안',
          description: '인증/프로젝트/태스크/코멘트 엔드포인트 초안',
          status: TaskStatus.todo,
          startDate: now,
          endDate: new Date(now.getTime() + DAYS(10)),
        },
      }));

    // Subtask
    const ensureSubtask = async (taskId: number, title: string, status: TaskStatus) => {
      const exists = await tx.subtask.findFirst({ where: { taskId, title } });
      if (!exists) {
        await tx.subtask.create({ data: { taskId, title, status } });
      }
    };

    await ensureSubtask(task1.id, 'Prisma 스키마 정리', TaskStatus.in_progress);
    await ensureSubtask(task1.id, 'ESLint/Prettier 구성', TaskStatus.todo);

    // Comment
    const commentExists = await tx.comment.findFirst({
      where: { taskId: task1.id, authorId: user1.id, content: { startsWith: '[초기화]' } },
    });
    if (!commentExists) {
      await tx.comment.create({
        data: {
          taskId: task1.id,
          authorId: user1.id,
          content: '[초기화] 기본 규칙 및 디렉토리 구조 제안',
        },
      });
    }

    // Tag links
    const ensureTaskTag = (taskId: number, tagId: number) =>
      tx.taskTag.upsert({
        where: { taskId_tagId: { taskId, tagId } },
        update: {},
        create: { taskId, tagId },
      });

    await Promise.all([
      ensureTaskTag(task1.id, urgent.id),
      ensureTaskTag(task1.id, backend.id),
      ensureTaskTag(task2.id, design.id),
    ]);

    // Invitation
    const invExists = await tx.invitation.findFirst({
      where: { projectId: project.id, email: 'user2@test.com' },
    });
    if (!invExists) {
      await tx.invitation.create({
        data: {
          projectId: project.id,
          email: 'user2@test.com',
          token: 'demo-invite-token',
          createdBy: user1.id,
          expiresAt: new Date(now.getTime() + DAYS(3)),
        },
      });
    }
  });

  console.log('🌱 Seed Complete');
};

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
