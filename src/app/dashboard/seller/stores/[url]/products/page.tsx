import { ProductColumns } from '@/components/columns/product';
import DataTable from '@/components/ui/data-table';
import { getProductsOfSingleStore } from '@/queries/product';

interface Props {
  params: Promise<{ url: string }>;
}

const SellerDashboardStoreProductsPage = async (props: Props) => {
  const { params } = props;
  const { url } = await params;

  const products = await getProductsOfSingleStore(url);

  return (
    <DataTable
      filterValue="name"
      columns={ProductColumns}
      data={products}
      searchPlaceholder="Search products by name..."
    />
  );
};

export default SellerDashboardStoreProductsPage;
