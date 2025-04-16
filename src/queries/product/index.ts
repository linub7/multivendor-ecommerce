'use server';

import { currentUser } from '@clerk/nextjs/server';
import slugify from 'slugify';

import { db } from '@/lib/db';
import { ProductWithVariant } from '@/lib/types';
import { generateUniqueSlug } from '@/lib/utils';

// Function: upsertProduct
// Description: upsert a product and its variant into the DB, ensure proper association with the store
// Permission required: SELLER
// Parameter:
//      - product: ProductWithVariant object containing details of the product and its variant
//      - storeUrl: The URL of the store to which the product belongs
// Return: Newly created or updated product or product variant details
export const upsertProduct = async (
  product: ProductWithVariant,
  storeUrl: string
) => {
  try {
    // get current user
    const user = await currentUser();

    // check if the user is authenticated
    if (!user) throw new Error('Unauthenticated');

    // check if the user is an seller
    if (user.privateMetadata.role !== 'SELLER')
      throw new Error('Unauthorized. SELLER privileges required');

    if (!product) throw new Error('Product data is required');

    // check if the category existed
    const existedCategory = await db.category.findUnique({
      where: {
        id: product.categoryId,
      },
    });
    if (!existedCategory) throw new Error('Category not found!');

    // check if the subcategory existed
    const existedSubCategory = await db.subCategory.findUnique({
      where: { id: product.subCategoryId },
    });
    if (!existedSubCategory) throw new Error('Sub-Category not found!');

    // check if the store existed
    const existedStore = await db.store.findUnique({
      where: { url: storeUrl },
    });
    if (!existedStore) throw new Error('Store not found!');

    const existedProduct = await db.product.findUnique({
      where: { id: product.productId },
    });

    // generate unique slugs for product and variant
    const tmpProductSlug = slugify(product.name, {
      replacement: '-',
      lower: true,
      trim: true,
    });
    const tmpVariantSlug = slugify(product.variantName, {
      replacement: '-',
      lower: true,
      trim: true,
    });
    /**
     * slug could exist already in the DB and I don't want that -> create a
     * Fn in order to goes to the DB, look for that, if it's there, change it a
     * little bit and try again till the slug is no longer existed in the DB
     */
    const mainProductSlug = await generateUniqueSlug(tmpProductSlug, 'product');
    const mainProductVariantSlug = await generateUniqueSlug(
      tmpVariantSlug,
      'productVariant'
    );

    const commonProductPayload = {
      name: product.name,
      description: product.description,
      brand: product.brand,
      slug: mainProductSlug,
      store: { connect: { id: existedStore.id } },
      category: { connect: { id: existedCategory.id } },
      subCategory: { connect: { id: existedSubCategory.id } },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
    const commonVariantPayload = {
      variantName: product.variantName,
      variantDescription: product.variantDescription,
      slug: mainProductVariantSlug,
      isSale: product.isSale,
      sku: product.sku,
      keywords: product.keywords.join(','), // convert ['str1', 'str2'] to 'str1,str2'
      productVariantImages: {
        create: product.productVariantImages.map((img) => ({
          url: img.url,
          alt: img.url.split('/').pop() || '',
        })),
      },
      variantImage: product.variantImage,
      productVariantColors: {
        create: product.productVariantColors.map((item) => ({
          name: item.color,
        })),
      },
      productVariantSizes: {
        create: product.productVariantSizes.map((item) => ({
          size: item.size,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
        })),
      },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    // if product existed, create a variant
    if (existedProduct) {
      const variantPayload = {
        ...commonVariantPayload,
        product: { connect: { id: existedProduct.id } },
      };
      const newVariant = await db.productVariant.create({
        data: variantPayload,
      });
      return newVariant;
    } else {
      // otherwise, create a new product with variants
      const productPayload = {
        ...commonProductPayload,
        id: product.productId,
        variants: {
          create: [
            {
              id: product.variantId,
              ...commonVariantPayload,
            },
          ],
        },
      };
      const newProduct = await db.product.create({ data: productPayload });
      return newProduct;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: getSingleProductMainData
// Description: get a single product main data
// Permission required: PUBLIC
// Parameter:
//      - productId: product id
// Return: Product
export const getSingleProductMainData = async (productId: string) => {
  try {
    if (!productId) throw new Error('Please provide a product id');
    const existedProduct = await db.product.findUnique({
      where: { id: productId },
    });
    if (!existedProduct) return null;
    return {
      productId: existedProduct.id,
      name: existedProduct.name,
      description: existedProduct.description,
      brand: existedProduct.brand,
      categoryId: existedProduct.categoryId,
      subCategoryId: existedProduct.subCategoryId,
      storeId: existedProduct.storeId,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: getProductsOfSingleStore
// Description: get products of one store
// Permission required: PUBLIC
// Parameter:
//      - storeUrl: store url
// Return: Products of specified store including  category, subCategory and variant details
export const getProductsOfSingleStore = async (storeUrl: string) => {
  try {
    if (!storeUrl) throw new Error('Please provide a store id');

    const existedStore = await db.store.findUnique({
      where: {
        url: storeUrl,
      },
    });
    if (!existedStore) throw new Error('store not found');

    const products = await db.product.findMany({
      where: {
        storeId: existedStore.id,
      },
      include: {
        category: true,
        subCategory: true,
        variants: {
          include: {
            productVariantColors: true,
            productVariantSizes: true,
            productVariantImages: true,
          },
        },
        store: {
          select: {
            id: true,
            url: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return products;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: deleteProduct
// Description: delete product from DB
// Permission required: SELLER only
// Parameter:
//      - productId: id of product
// Return: Response indicating success or failure
export const deleteProduct = async (productId: string) => {
  try {
    // get current user
    const user = await currentUser();

    // check if the user is authenticated
    if (!user) throw new Error('Unauthenticated');

    // check if the user is an seller
    if (user.privateMetadata.role !== 'SELLER')
      throw new Error('Unauthorized. SELLER privileges required');

    if (!productId) throw new Error('Product ID data is required');

    const deletedProduct = await db.product.delete({
      where: {
        id: productId,
      },
    });
    return deletedProduct;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
