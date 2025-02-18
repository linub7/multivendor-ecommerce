'use server';

import { Store } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

import { db } from '@/lib/db';

// Function: upsertStore
// Description: upsert a store into the DB, if it exists, update it.
// Permission required: SELLER
// Parameter: category: Store
// Return: Updated or newly created store
// you're trying to create one, but it can also take only a few because we are trying to update, so it's gonna be a partial
export const upsertStore = async (store: Partial<Store>) => {
  try {
    // get current user
    const user = await currentUser();

    // check if the user is authenticated
    if (!user) throw new Error('Unauthenticated');

    // check if the user is an admin
    if (user.privateMetadata.role !== 'SELLER')
      throw new Error('Unauthorized. SELLER privileges required');

    if (!store) throw new Error('Store data is required');

    const existedStore = await db.store.findFirst({
      where: {
        AND: [
          {
            OR: [
              { name: store.name },
              { url: store.url },
              { email: store.email },
              { phone: store.phone },
            ],
          },
          {
            NOT: { id: store.id },
          },
        ],
      },
    });

    if (existedStore) {
      let errorMessage = '';

      if (existedStore.name === store.name)
        errorMessage = 'Store name already exists';
      else if (existedStore.url === store.url)
        errorMessage = 'Store URL already exists';
      else if (existedStore.email === store.email)
        errorMessage = 'Store Email already exists';
      else if (existedStore.phone === store.phone)
        errorMessage = 'Store Phone already exists';
      throw new Error(errorMessage);
    }

    const storeDetails = await db.store.upsert({
      where: { id: store.id },
      update: store,
      create: {
        ...store,
        user: {
          connect: { id: user.id },
        },
      },
    });

    return storeDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: getSellerAllStores
// Description: Get all stores of seller from the DB
// Permission level: SELLER
export const getSellerAllStores = async () => {
  try {
    // get current user
    const user = await currentUser();

    // check if the user is authenticated
    if (!user) throw new Error('Unauthenticated');

    // check if the user is an admin
    if (user.privateMetadata.role !== 'SELLER')
      throw new Error('Unauthorized. SELLER privileges required');

    const sellerStores = await db.store.findMany({
      where: {
        userId: user.id,
      },
    });

    return sellerStores;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: getStoreByUrl
// Description: Get store of seller from the DB by url
// Permission level: SELLER
export const getStoreByUrl = async (url: string) => {
  try {
    // get current user
    const user = await currentUser();

    // check if the user is authenticated
    if (!user) throw new Error('Unauthenticated');

    // check if the user is an admin
    if (user.privateMetadata.role !== 'SELLER')
      throw new Error('Unauthorized. SELLER privileges required');

    const store = await db.store.findUnique({
      where: { url },
    });

    return store;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
