'use server';

import { currentUser } from '@clerk/nextjs/server';
import slugify from 'slugify';

import { db } from '@/lib/db';
import { ProductWithVariant } from '@/lib/types';
import { generateUniqueSlug } from '@/lib/utils';

// Function: upsertProduct
// Description: upsert a product and its variant into the DB, ensure proper association with the store
// Permission required: SELLER
// Parameter: product:
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

    // check if the user is an admin
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

    // const existedStore = await db.store.findFirst({
    //   where: {
    //     AND: [
    //       {
    //         OR: [
    //           { name: store.name },
    //           { url: store.url },
    //           { email: store.email },
    //           { phone: store.phone },
    //         ],
    //       },
    //       {
    //         NOT: { id: store.id },
    //       },
    //     ],
    //   },
    // });

    // if (existedStore) {
    //   let errorMessage = '';

    //   if (existedStore.name === store.name)
    //     errorMessage = 'Store name already exists';
    //   else if (existedStore.url === store.url)
    //     errorMessage = 'Store URL already exists';
    //   else if (existedStore.email === store.email)
    //     errorMessage = 'Store Email already exists';
    //   else if (existedStore.phone === store.phone)
    //     errorMessage = 'Store Phone already exists';
    //   throw new Error(errorMessage);
    // }

    // const storeDetails = await db.store.upsert({
    //   where: { id: store.id },
    //   update: store,
    //   create: {
    //     ...store,
    //     user: {
    //       connect: { id: user.id },
    //     },
    //   },
    // });

    // return storeDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
