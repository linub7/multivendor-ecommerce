import { Plus } from 'lucide-react';

import { ProductColumns } from '@/components/columns/product';
import DataTable from '@/components/ui/data-table';
import { getProductsOfSingleStore } from '@/queries/product';
import SellerDashboardProductDetailsForm from '@/components/seller/dashboard/forms/product-details';
import { getAllCategories } from '@/queries/category';

interface Props {
  params: Promise<{ url: string }>;
}

const SellerDashboardStoreProductsPage = async (props: Props) => {
  const { params } = props;
  const { url } = await params;

  const products = await getProductsOfSingleStore(url);
  const categories = await getAllCategories();

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create Product
        </>
      }
      isNavigate={true}
      navigatePath={`/dashboard/seller/stores/${url}/products/new`}
      modalChildren={
        <SellerDashboardProductDetailsForm
          storeUrl={url}
          categories={categories}
        />
      }
      filterValue="name"
      columns={ProductColumns}
      data={products}
      searchPlaceholder="Search products by name..."
    />
  );
};

export default SellerDashboardStoreProductsPage;
