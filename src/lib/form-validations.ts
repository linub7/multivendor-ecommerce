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
