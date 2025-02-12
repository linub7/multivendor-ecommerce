'use server';

import { currentUser } from '@clerk/nextjs/server';
import { Category } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';

// Function: upsertCategory
// Description: upsert a category into the DB, if it exists, update it.
// Permission required: ADMIN
// Parameter: category: Category
// Return: Updated or newly created category
export const upsertCategory = async (category: Category) => {
  try {
    // get current user
    const user = await currentUser();

    // check if the user is authenticated
    if (!user) throw new Error('Unauthenticated');

    // check if the user is an admin
    if (user.privateMetadata.role !== 'ADMIN')
      throw new Error('Unauthorized. Admin privileges required');

    if (!category) throw new Error('Category data is required');

    const existedCategory = await db.category.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: category.name }, { url: category.url }],
          },
          {
            NOT: { id: category.id },
          },
        ],
      },
    });

    if (existedCategory) {
      let errorMessage = '';

      if (existedCategory.name === category.name)
        errorMessage = 'Category name already exists';
      else if (existedCategory.url === category.url)
        errorMessage = 'Category URL already exists';

      throw new Error(errorMessage);
    }

    const categoryDetails = await db.category.upsert({
      where: { id: category.id },
      update: category,
      create: category,
    });

    revalidatePath('/dashboard/admin/categories');

    return categoryDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: getAllCategories
// Description: Get all categories from the DB
// Permission level: PUBLIC
export const getAllCategories = async () => {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return categories;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: getCategory
// Description: Get One Category by ID
// Permission level: PUBLIC
export const getCategory = async (id: string) => {
  try {
    if (!id) throw new Error('Please provide category id.');
    const category = await db.category.findUnique({ where: { id } });
    return category;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: deleteCategory
// Description: Delete Category
// Permission level: ADMIN
export const deleteCategory = async (id: string) => {
  try {
    // get current user
    const user = await currentUser();

    // check if the user is authenticated
    if (!user) throw new Error('Unauthenticated');

    // check if the user is an admin
    if (user.privateMetadata.role !== 'ADMIN')
      throw new Error('Unauthorized. Admin privileges required');

    if (!id) throw new Error('Please provide category id.');

    const deletedCategory = await db.category.delete({
      where: { id },
    });
    return deletedCategory;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
