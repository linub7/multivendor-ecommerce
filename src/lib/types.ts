import { Prisma } from '@prisma/client';

import { getAllSubCategories } from '@/queries/sub-category';

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
}

// SubCategory + Parent Category
export type SubCategoryWithCategory = Prisma.PromiseReturnType<
  typeof getAllSubCategories
>[0];
