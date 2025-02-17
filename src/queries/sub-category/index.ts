'use server';

import { currentUser } from '@clerk/nextjs/server';
import { SubCategory } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';

// Function: upsertSubCategory
// Description: upsert a sub-category into the DB, if it exists, update it.
// Permission required: ADMIN
// Parameter: subCategory: SubCategory
// Return: Updated or newly created sub-category
export const upsertSubCategory = async (subCategory: SubCategory) => {
  try {
    // get current user
    const user = await currentUser();

    // check if the user is authenticated
    if (!user) throw new Error('Unauthenticated');

    // check if the user is an admin
    if (user.privateMetadata.role !== 'ADMIN')
      throw new Error('Unauthorized. Admin privileges required');

    if (!subCategory) throw new Error('Sub-Category data is required');

    const existedCategory = await db.category.findUnique({
      where: { id: subCategory.categoryId },
    });

    if (!existedCategory) throw new Error('Category not found.');

    const existedSubCategory = await db.subCategory.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: subCategory.name }, { url: subCategory.url }],
          },
          {
            NOT: {
              id: subCategory.id,
            },
          },
        ],
      },
    });

    if (existedSubCategory) {
      let errorMessage = '';

      if (existedSubCategory.name === subCategory.name)
        errorMessage = 'Sub Category name already exists';
      else if (existedSubCategory.url === subCategory.url)
        errorMessage = 'Sub Category URL already exists';

      throw new Error(errorMessage);
    }

    const subCategoryDetails = await db.subCategory.upsert({
      where: { id: subCategory.id },
      update: subCategory,
      create: subCategory,
    });

    revalidatePath('/dashboard/admin/sub-categories');

    return subCategoryDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: getAllSubCategories
// Description: Get all sub-categories from the DB
// Permission level: PUBLIC
export const getAllSubCategories = async () => {
  try {
    const subCategories = await db.subCategory.findMany({
      include: {
        category: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return subCategories;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: getSubCategory
// Description: Get One SubCategory by ID
// Permission level: PUBLIC
export const getSubCategory = async (id: string) => {
  try {
    if (!id) throw new Error('Please provide sub-category id.');
    const subCategory = await db.subCategory.findUnique({ where: { id } });
    return subCategory;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: deleteSubCategory
// Description: Delete SubCategory
// Permission level: ADMIN
export const deleteSubCategory = async (id: string) => {
  try {
    // get current user
    const user = await currentUser();

    // check if the user is authenticated
    if (!user) throw new Error('Unauthenticated');

    // check if the user is an admin
    if (user.privateMetadata.role !== 'ADMIN')
      throw new Error('Unauthorized. Admin privileges required');

    if (!id) throw new Error('Please provide sub-category id.');

    const deletedSubCategory = await db.subCategory.delete({
      where: { id },
    });
    return deletedSubCategory;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
