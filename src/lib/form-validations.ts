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
