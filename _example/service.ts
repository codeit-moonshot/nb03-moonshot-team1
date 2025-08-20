import ApiError from '@/errors/ApiError';
import { CreateProductDto, UpdateProductDto, PublicProduct } from './dto/product.dto';
import { findMany, findById, create, update, remove } from './repo';

export const getProductList = async (
  offset = 0,
  limit = 10,
  search = '',
  sort: 'asc' | 'desc' = 'desc'
): Promise<Pick<PublicProduct, 'id' | 'name' | 'price' | 'createdAt'>[]> => {
  return findMany(offset, limit, search, sort);
};

export const getProductById = async (id: number): Promise<PublicProduct> => {
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, '상품 ID가 올바르지 않습니다.');

  const product = await findById(id);
  if (!product) throw new ApiError(404, '해당 상품을 찾을 수 없습니다.');

  return product;
};

export const createProduct = (data: CreateProductDto) => create(data);

export const updateProduct = async (id: number, userId: number, data: UpdateProductDto) => {
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, '상품 ID가 올바르지 않습니다.');

  const product = await findById(id);
  if (!product) throw new ApiError(404, '상품을 찾을 수 없습니다.');
  if (product.userId !== userId) throw new ApiError(403, '해당 상품에 대한 수정 권한이 없습니다.');

  return update(id, data);
};

export const deleteProduct = async (id: number, userId: number) => {
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, '상품 ID가 올바르지 않습니다.');

  const product = await findById(id);
  if (!product) throw new ApiError(404, '상품을 찾을 수 없습니다.');
  if (product.userId !== userId) throw new ApiError(403, '해당 상품에 대한 삭제 권한이 없습니다.');

  return remove(id);
};
