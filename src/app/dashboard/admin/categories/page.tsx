import { Plus } from 'lucide-react';

import AdminDashboardCategoryDetailsForm from '@/components/admin/dashboard/forms/category-details';
import DataTable from '@/components/ui/data-table';
import { getAllCategories } from '@/queries/category';
import { CategoryColumns } from '@/components/columns/category';

const AdminDashboardCategoriesPage = async () => {
  const categories = await getAllCategories();
  if (!categories) return null;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create Category
        </>
      }
      isNavigate={true}
      navigatePath="/dashboard/admin/categories/new"
      modalChildren={<AdminDashboardCategoryDetailsForm />}
      filterValue="name"
      data={categories}
      searchPlaceholder="Search category name"
      columns={CategoryColumns}
    />
  );
};

export default AdminDashboardCategoriesPage;
