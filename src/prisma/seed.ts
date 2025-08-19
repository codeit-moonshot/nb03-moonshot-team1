import prisma from '@/prisma/prisma';
import { ProjectRole, TaskStatus } from '@prisma/client';

const main = async (): Promise<void> => {
  const alice = await prisma.user.upsert({
    where: { email: 'user1@test.com' },
    update: {},
    create: {
      email: 'user1@test.com',
      name: 'User1',
      password: 'hashed', // TODO: bcrypt 해시 적용 예정
    },
  });

  await prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name: 'Demo',
        description: 'Demo project',
        ownerId: alice.id,
      },
    });

    await tx.projectMember.create({
      data: {
        projectId: project.id,
        userId: alice.id,
        role: ProjectRole.OWNER,
      },
    });

    await tx.task.create({
      data: {
        projectId: project.id,
        assigneeId: alice.id,
        title: '첫 할 일',
        status: TaskStatus.TODO,
        tags: [],
      },
    });
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
