import prisma from '#prisma/prisma';

export const create = async (projectId: Number, email: String, token: String):
Promise<{ id: number}> => {
  return await prisma.invitation.create({
    data: {
      project: {
        connect: {
          id: projectId
        }
      },
      email,
      token
    },
    select: { id: true }
  });
}
  