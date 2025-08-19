import type { Product } from '@prisma/client';

/**
 * Product 기본 모델
 */
export type DBProduct = Product;

/**
 * Product 조회
 */
export type PublicProduct = Omit<DBProduct, 'updatedAt' | 'userId'>;

/**
 * 상품 생성 DTO
 */
export interface CreateProductDto extends Omit<DBProduct, 'id' | 'createdAt' | 'updatedAt' | 'userId'> {
  userId: NonNullable<DBProduct['userId']>;
}

/**
 * 상품 수정 DTO
 */
export interface UpdateProductDto {
  name?: DBProduct['name'];
  description?: DBProduct['description'];
  price?: DBProduct['price'];
  tags?: DBProduct['tags'];
  imageUrl?: DBProduct['imageUrl'];
}

/**
 * 상품 목록 조회 DTO
 */
export interface ListProductsQueryDto {
  offset: number;
  limit: number;
  search: string;
}
