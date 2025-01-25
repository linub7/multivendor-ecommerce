import AdminDashboardCategoryDetailsForm from '@/components/admin/dashboard/forms/category-details';

const AdminDashboardNewCategoryPage = () => {
  const CLOUDINARY_CLOUD_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!;
  return (
    <div className="w-full">
      <AdminDashboardCategoryDetailsForm cloudinaryKey={CLOUDINARY_CLOUD_KEY} />
    </div>
  );
};

export default AdminDashboardNewCategoryPage;
