import AdminDashboardSubCategoryDetailsForm from '@/components/admin/dashboard/forms/sub-category-details';
import { getAllCategories } from '@/queries/category';

const AdminDashboardNewSubCategoryPage = async () => {
  const categories = await getAllCategories();
  return (
    <div className="w-full">
      <AdminDashboardSubCategoryDetailsForm categories={categories} />
    </div>
  );
};

export default AdminDashboardNewSubCategoryPage;
