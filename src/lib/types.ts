import { Prisma } from '@prisma/client';

import { getAllSubCategories } from '@/queries/sub-category';

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

// SubCategory + Parent Category
export type SubCategoryWithCategory = Prisma.PromiseReturnType<
  typeof getAllSubCategories
>[0];

// Product + variant
export type ProductWithVariant = {
  productId: string;
  variantId: string;
  name: string;
  description: string;
  variantName: string;
  variantDescription: string;
  productVariantImages: { url: string }[];
  categoryId: string;
  subCategoryId: string;
  isSale: boolean;
  brand: string;
  sku: string;
  productVariantColors: { color: string }[];
  productVariantSizes: {
    size: string;
    quantity: number;
    price: number;
    discount: number;
  }[];
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
};

export interface ProductKeyword {
  id: string;
  className: string;
  [key: string]: string;
}
