"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProductUpdate = exports.validateProductCreate = void 0;
const zod_1 = require("zod");
const ApiError_1 = __importDefault(require("@/errors/ApiError"));
const productCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, '상품 이름을 작성해 주세요.'),
    description: zod_1.z.string().min(1, '상품 설명을 작성해 주세요.'),
    price: zod_1.z
        .number({ invalid_type_error: '가격은 숫자로 입력해 주세요.' })
        .int('가격은 정수로 입력해 주세요.')
        .nonnegative('가격을 작성해 주세요.'),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    imageUrl: zod_1.z.string().url('이미지 URL 형식이 올바르지 않습니다.').optional(),
});
const productUpdateSchema = productCreateSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: '수정할 내용을 최소 1개 이상 입력해 주세요.',
});
const validateProductCreate = (req, _res, next) => {
    const parsedBody = {
        ...req.body,
        price: req.body.price !== undefined ? Number(req.body.price) : undefined,
    };
    try {
        productCreateSchema.parse(parsedBody);
        next();
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
            return next(new ApiError_1.default(400, `상품 등록 유효성 검사 실패: ${messages}`));
        }
        next(err);
    }
};
exports.validateProductCreate = validateProductCreate;
const validateProductUpdate = (req, _res, next) => {
    const parsedBody = {
        ...req.body,
        price: req.body.price !== undefined ? Number(req.body.price) : undefined,
    };
    try {
        productUpdateSchema.parse(parsedBody);
        next();
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
            return next(new ApiError_1.default(400, `상품 수정 유효성 검사 실패: ${messages}`));
        }
        next(err);
    }
};
exports.validateProductUpdate = validateProductUpdate;
