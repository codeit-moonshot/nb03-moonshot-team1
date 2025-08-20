"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.listProducts = exports.createProducts = void 0;
const productService = __importStar(require("./service"));
const likeService_js_1 = require("../services/likeService.js");
/**
 * @function createProducts
 * @description 상품을 생성합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {201} 생성된 상품 반환
 */
const createProducts = async (req, res) => {
    const dto = {
        ...req.body,
        userId: req.user.id,
    };
    const product = await productService.createProduct(dto);
    res.status(201).json(product);
};
exports.createProducts = createProducts;
/**
 * @function listProducts
 * @description 상품 목록을 조회합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 상품 목록 반환
 */
const listProducts = async (req, res) => {
    const dto = {
        offset: Number(req.query.offset) || 0,
        limit: Number(req.query.limit) || 10,
        search: typeof req.query.search === 'string' ? req.query.search : '',
    };
    const products = await productService.getProductList(dto.offset, dto.limit, dto.search);
    res.status(200).json(products);
};
exports.listProducts = listProducts;
/**
 * @function getProductById
 * @description ID로 특정 상품을 조회합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 상품 반환 (좋아요 여부 포함)
 * @throws {400} 잘못된 ID
 * @throws {404} 상품을 찾을 수 없는 경우
 */
const getProductById = async (req, res) => {
    const product = await productService.getProductById(Number(req.params.id));
    const userId = req.user?.id;
    const isLiked = userId ? await (0, likeService_js_1.isTargetLiked)(userId, product.id, 'product') : false;
    res.status(200).json({ ...product, isLiked });
};
exports.getProductById = getProductById;
/**
 * @function updateProduct
 * @description 상품 정보를 수정합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 수정된 상품 반환
 * @throws {400} 잘못된 ID
 * @throws {403} 권한 없음
 * @throws {404} 상품을 찾을 수 없는 경우
 */
const updateProduct = async (req, res) => {
    const dto = req.body;
    const updated = await productService.updateProduct(Number(req.params.id), req.user.id, dto);
    res.status(200).json(updated);
};
exports.updateProduct = updateProduct;
/**
 * @function deleteProduct
 * @description 상품을 삭제합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {204} 삭제 성공
 * @throws {400} 잘못된 ID
 * @throws {403} 권한 없음
 * @throws {404} 상품을 찾을 수 없는 경우
 */
const deleteProduct = async (req, res) => {
    await productService.deleteProduct(Number(req.params.id), req.user.id);
    res.status(204).end();
};
exports.deleteProduct = deleteProduct;
