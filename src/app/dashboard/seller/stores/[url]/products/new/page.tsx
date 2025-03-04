import SellerDashboardProductDetailsForm from '@/components/seller/dashboard/forms/product-details';
import { getAllCategories } from '@/queries/category';

interface Props {
  params: Promise<{ url: string }>;
}

const SellerDashboardStoreNewProductPage = async (props: Props) => {
  const { params } = props;
  const { url } = await params;

  const categories = await getAllCategories();
  return (
    <div className="py-4 overflow-y-scroll scrollbar">
      <SellerDashboardProductDetailsForm
        storeUrl={url}
        categories={categories}
      />
    </div>
  );
};

export default SellerDashboardStoreNewProductPage;
