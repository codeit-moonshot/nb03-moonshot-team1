import type { RequestHandler } from 'express';
import * as productService from './service';
import { isTargetLiked } from '../services/likeService.js';
import { CreateProductDto, ListProductsQueryDto, UpdateProductDto } from './dto/product.dto';

/**
 * @function createProducts
 * @description 상품을 생성합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {201} 생성된 상품 반환
 */
export const createProducts: RequestHandler = async (req, res) => {
  const dto: CreateProductDto = {
    ...req.body,
    userId: req.user.id,
  };

  const product = await productService.createProduct(dto);
  res.status(201).json(product);
};

/**
 * @function listProducts
 * @description 상품 목록을 조회합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 상품 목록 반환
 */
export const listProducts: RequestHandler = async (req, res) => {
  const dto: ListProductsQueryDto = {
    offset: Number(req.query.offset) || 0,
    limit: Number(req.query.limit) || 10,
    search: typeof req.query.search === 'string' ? req.query.search : '',
  };

  const products = await productService.getProductList(dto.offset, dto.limit, dto.search);
  res.status(200).json(products);
};

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
export const getProductById: RequestHandler = async (req, res) => {
  const product = await productService.getProductById(Number(req.params.id));

  const userId = req.user?.id;
  const isLiked = userId ? await isTargetLiked(userId, product.id, 'product') : false;

  res.status(200).json({ ...product, isLiked });
};

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
export const updateProduct: RequestHandler = async (req, res) => {
  const dto: UpdateProductDto = req.body;

  const updated = await productService.updateProduct(Number(req.params.id), req.user.id, dto);

  res.status(200).json(updated);
};

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
export const deleteProduct: RequestHandler = async (req, res) => {
  await productService.deleteProduct(Number(req.params.id), req.user.id);
  res.status(204).end();
};
