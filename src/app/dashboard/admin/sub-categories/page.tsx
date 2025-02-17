import { Plus } from 'lucide-react';

import DataTable from '@/components/ui/data-table';
import { getAllSubCategories } from '@/queries/sub-category';
import AdminDashboardSubCategoryDetailsForm from '@/components/admin/dashboard/forms/sub-category-details';
import { getAllCategories } from '@/queries/category';
import { SubCategoryColumns } from '@/components/columns/sub-category';

const AdminDashboardSubCategoriesPage = async () => {
  const subCategories = await getAllSubCategories();
  const categories = await getAllCategories();

  if (!subCategories) return null;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create Sub-Category
        </>
      }
      isNavigate={true}
      navigatePath="/dashboard/admin/sub-categories/new"
      modalChildren={
        <AdminDashboardSubCategoryDetailsForm categories={categories} />
      }
      filterValue="name"
      data={subCategories}
      searchPlaceholder="Search sub category name"
      columns={SubCategoryColumns}
    />
  );
};

export default AdminDashboardSubCategoriesPage;
