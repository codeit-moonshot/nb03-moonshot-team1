"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.findById = exports.findMany = void 0;
const prisma_1 = __importDefault(require("@/prisma/prisma"));
const findMany = (offset = 0, limit = 10, search = '', sort = 'desc') => prisma_1.default.product.findMany({
    where: search
        ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ],
        }
        : {},
    orderBy: { createdAt: sort },
    skip: offset,
    take: limit,
    select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
    },
});
exports.findMany = findMany;
const findById = (id) => prisma_1.default.product.findUnique({
    where: { id },
    select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        imageUrl: true,
        createdAt: true,
        userId: true,
    },
});
exports.findById = findById;
const create = (data) => {
    const { userId, ...rest } = data;
    return prisma_1.default.product.create({
        data: {
            ...rest,
            user: { connect: { id: userId } },
        },
    });
};
exports.create = create;
const update = (id, data) => prisma_1.default.product.update({
    where: { id },
    data,
});
exports.update = update;
const remove = (id) => prisma_1.default.product.delete({
    where: { id },
});
exports.remove = remove;
