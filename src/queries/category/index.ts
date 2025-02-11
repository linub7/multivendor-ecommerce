'use server';

import { currentUser } from '@clerk/nextjs/server';
import { Category } from '@prisma/client';

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

    return categoryDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
