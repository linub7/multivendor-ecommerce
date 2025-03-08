import SellerDashboardProductDetailsForm from '@/components/seller/dashboard/forms/product-details';
import { getAllCategories } from '@/queries/category';
import { getSingleProductMainData } from '@/queries/product';

interface Props {
  params: Promise<{ url: string; productId: string }>;
}

const SellerDashboardStoreProductNewVariantPage = async (props: Props) => {
  const { params } = props;
  const { url, productId } = await params;

  const categories = await getAllCategories();

  const product = await getSingleProductMainData(productId);
  if (!product) return null;
  return (
    <div className="py-4 overflow-y-scroll scrollbar">
      <SellerDashboardProductDetailsForm
        categories={categories}
        storeUrl={url}
        data={product}
      />
    </div>
  );
};

export default SellerDashboardStoreProductNewVariantPage;
