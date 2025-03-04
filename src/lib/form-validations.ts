import * as z from 'zod';

export const CategorySchema = z.object({
  name: z
    .string({
      required_error: 'Category Name is required',
      invalid_type_error: 'Category Name must be a string',
    })
    .min(2, { message: 'Category Name must be at least 2 characters long' })
    .max(50, { message: 'Category Name must be at most 50 characters long' })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: 'Category Name must contain only letters, numbers, and spaces',
    }),
  image: z
    .object({
      url: z.string(),
    })
    .array()
    .length(1, { message: 'Choose a category image' }),
  url: z
    .string({
      required_error: 'Category URL is required',
      invalid_type_error: 'Category URL must be a string',
    })
    .min(2, { message: 'Category URL must be at least 2 characters long' })
    .max(50, {
      message: 'Category URL must be at most 50 characters long',
    })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        'Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.',
    }),
  featured: z.boolean().default(false),
});

export const SubCategorySchema = z.object({
  name: z
    .string({
      required_error: 'Sub Category Name is required',
      invalid_type_error: 'Sub Category Name must be a string',
    })
    .min(2, { message: 'Sub Category Name must be at least 2 characters long' })
    .max(50, {
      message: 'Sub Category Name must be at most 50 characters long',
    })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message:
        'Sub Category Name must contain only letters, numbers, and spaces',
    }),
  image: z
    .object({
      url: z.string(),
    })
    .array()
    .length(1, { message: 'Choose a Sub category image' }),
  url: z
    .string({
      required_error: 'Sub Category URL is required',
      invalid_type_error: 'Sub Category URL must be a string',
    })
    .min(2, { message: 'Sub Category URL must be at least 2 characters long' })
    .max(50, {
      message: 'Sub Category URL must be at most 50 characters long',
    })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        'Only letters, numbers, hyphen, and underscore are allowed in the Sub category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.',
    }),
  featured: z.boolean().default(false),
  categoryId: z
    .string({
      required_error: 'Sub Category is required',
      invalid_type_error: 'Sub Category must be a string',
    })
    .uuid(),
});

export const StoreSchema = z.object({
  name: z
    .string({
      required_error: 'Store Name is required',
      invalid_type_error: 'Store Name must be a string',
    })
    .min(2, { message: 'Store Name must be at least 2 characters long' })
    .max(50, { message: 'Store Name must be at most 50 characters long' })
    .regex(/^(?!.*(?:[-_& ]){2,})[a-zA-Z0-9_ &-]+$/, {
      message:
        'Only letters, numbers, space, hyphen, and underscore are allowed in the store name, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.',
    }),
  description: z
    .string({
      required_error: 'Store Description is required',
      invalid_type_error: 'Store Description must be a string',
    })
    .min(30, {
      message: 'Store Description must be at least 30 characters long',
    })
    .max(500, {
      message: 'Store Description must be at most 500 characters long',
    }),
  email: z
    .string({
      required_error: 'Store Email is required',
      invalid_type_error: 'Store Email must be a string',
    })
    .email({ message: 'Invalid email format.' }),
  phone: z
    .string({
      required_error: 'Store phone is required',
      invalid_type_error: 'Store phone must be a string',
    })
    .regex(/((0?9)|(\+?989))\d{2}\W?\d{3}\W?\d{4}/, {
      message: 'Please enter a valid phone',
    }),
  url: z
    .string({
      required_error: 'Store URL is required',
      invalid_type_error: 'Store URL must be a string',
    })
    .min(2, { message: 'Store URL must be at least 2 characters long' })
    .max(50, {
      message: 'Store URL must be at most 50 characters long',
    })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        'Only letters, numbers, hyphen, and underscore are allowed in the Store url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.',
    }),
  logo: z
    .object({
      url: z.string(),
    })
    .array()
    .length(1, { message: 'Choose a Store logo' }),
  cover: z
    .object({
      url: z.string(),
    })
    .array()
    .length(1, { message: 'Choose a Store cover' }),
  featured: z.boolean().default(false).optional(),
  status: z.string().default('PENDING').optional(),
});

export const ProductSchema = z.object({
  name: z
    .string({
      required_error: 'Product name is mandatory.',
      invalid_type_error: 'Product name must be a valid string.',
    })
    .min(2, { message: 'Product name should be at least 2 characters long.' })
    .max(200, { message: 'Product name cannot exceed 200 characters.' })
    .regex(/^(?!.*(?:[-_ &' ]){2,})[a-zA-Z0-9_ '&-]+$/, {
      message:
        'Product name may only contain letters, numbers, spaces, hyphens, underscores, ampersands, and apostrophes, without consecutive special characters.',
    }),
  description: z
    .string({
      required_error: 'Product description is mandatory.',
      invalid_type_error: 'Product description must be a valid string.',
    })
    .min(200, {
      message: 'Product description should be at least 200 characters long.',
    }),
  variantName: z
    .string({
      required_error: 'Product variant name is mandatory.',
      invalid_type_error: 'Product variant name must be a valid string.',
    })
    .min(2, {
      message: 'Product variant name should be at least 2 characters long.',
    })
    .max(100, {
      message: 'Product variant name cannot exceed 100 characters.',
    })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
      message:
        'Product variant name may only contain letters, numbers, spaces, hyphens, and underscores, without consecutive special characters.',
    }),
  variantDescription: z
    .string({
      required_error: 'Product variant description is mandatory.',
      invalid_type_error: 'Product variant description must be a valid string.',
    })
    .optional(),
  productVariantImages: z
    .object({ url: z.string() })
    .array()
    .min(3, 'Please upload at least 3 images for the product.')
    .max(6, 'You can upload up to 6 images for the product.'),
  categoryId: z
    .string({
      required_error: 'Product category ID is mandatory.',
      invalid_type_error: 'Product category ID must be a valid UUID.',
    })
    .uuid(),
  subCategoryId: z
    .string({
      required_error: 'Product sub-category ID is mandatory.',
      invalid_type_error: 'Product sub-category ID must be a valid UUID.',
    })
    .uuid(),
  isSale: z.boolean().default(false),
  brand: z
    .string({
      required_error: 'Product brand is mandatory.',
      invalid_type_error: 'Product brand must be a valid string.',
    })
    .min(2, {
      message: 'Product brand should be at least 2 characters long.',
    })
    .max(50, {
      message: 'Product brand cannot exceed 50 characters.',
    }),
  sku: z
    .string({
      required_error: 'Product SKU is mandatory.',
      invalid_type_error: 'Product SKU must be a valid string.',
    })
    .min(6, {
      message: 'Product SKU should be at least 6 characters long.',
    })
    .max(50, {
      message: 'Product SKU cannot exceed 50 characters.',
    }),
  keywords: z
    .string({
      required_error: 'Product keywords are mandatory.',
      invalid_type_error: 'Keywords must be valid strings.',
    })
    .array()
    .min(5, {
      message: 'Please provide at least 5 keywords.',
    })
    .max(10, {
      message: 'You can provide up to 10 keywords.',
    }),
  productVariantColors: z
    .object({ color: z.string() })
    .array()
    .min(1, 'Please provide at least one color.')
    .refine((colors) => colors.every((c) => c.color.length > 0), {
      message: 'All color inputs must be filled.',
    }),
  productVariantSizes: z
    .object({
      size: z.string(),
      quantity: z
        .number()
        .min(1, { message: 'Quantity must be greater than 0.' }),
      price: z.number().min(0.01, { message: 'Price must be greater than 0.' }),
      discount: z.number().min(0).default(0),
    })
    .array()
    .min(1, 'Please provide at least one size.')
    .refine(
      (sizes) =>
        sizes.every((s) => s.size.length > 0 && s.price > 0 && s.quantity > 0),
      {
        message: 'All size inputs must be filled correctly.',
      }
    ),
});
