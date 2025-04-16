'use server';

import { db } from '@/lib/db';

/**
 * IMPORTANT NOTE: keep in your mind, you have to restart your server to
 *  run these scripts
 */
export const updateVariantImage = async () => {
  try {
    const variants = await db.productVariant.findMany({
      include: {
        productVariantImages: true,
      },
    });
    // update each variant with the first image URL
    for (const variant of variants) {
      if (variant.productVariantImages.length > 0) {
        const firstImage = variant.productVariantImages[0];
        await db.productVariant.update({
          where: {
            id: variant.id,
          },
          data: {
            variantImage: firstImage.url,
          },
        });
        console.log(
          `updated variant ${variant.id} with image ${firstImage.url}`
        );
      }
    }
    console.log(
      'All product variants has been updated with their first image.'
    );
  } catch (error) {
    console.log('Error updating variant images ', error);
  }
  //   finally {
  //     await db.$disconnect();
  //   }
};
