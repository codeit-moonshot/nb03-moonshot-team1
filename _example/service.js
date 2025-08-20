"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProductList = void 0;
const ApiError_1 = __importDefault(require("@/errors/ApiError"));
const repo_1 = require("./repo");
const getProductList = async (offset = 0, limit = 10, search = '', sort = 'desc') => {
    return (0, repo_1.findMany)(offset, limit, search, sort);
};
exports.getProductList = getProductList;
const getProductById = async (id) => {
    if (!Number.isInteger(id) || id <= 0)
        throw new ApiError_1.default(400, '상품 ID가 올바르지 않습니다.');
    const product = await (0, repo_1.findById)(id);
    if (!product)
        throw new ApiError_1.default(404, '해당 상품을 찾을 수 없습니다.');
    return product;
};
exports.getProductById = getProductById;
const createProduct = (data) => (0, repo_1.create)(data);
exports.createProduct = createProduct;
const updateProduct = async (id, userId, data) => {
    if (!Number.isInteger(id) || id <= 0)
        throw new ApiError_1.default(400, '상품 ID가 올바르지 않습니다.');
    const product = await (0, repo_1.findById)(id);
    if (!product)
        throw new ApiError_1.default(404, '상품을 찾을 수 없습니다.');
    if (product.userId !== userId)
        throw new ApiError_1.default(403, '해당 상품에 대한 수정 권한이 없습니다.');
    return (0, repo_1.update)(id, data);
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id, userId) => {
    if (!Number.isInteger(id) || id <= 0)
        throw new ApiError_1.default(400, '상품 ID가 올바르지 않습니다.');
    const product = await (0, repo_1.findById)(id);
    if (!product)
        throw new ApiError_1.default(404, '상품을 찾을 수 없습니다.');
    if (product.userId !== userId)
        throw new ApiError_1.default(403, '해당 상품에 대한 삭제 권한이 없습니다.');
    return (0, repo_1.remove)(id);
};
exports.deleteProduct = deleteProduct;
