import { getStoreByUrl } from '@/queries/store';

interface Props {
  params: Promise<{ url: string }>;
}

const SellerDashboardStorePage = async (props: Props) => {
  const { params } = props;
  const { url } = await params;

  // const store = await getStoreByUrl(url);

  return <div></div>;
};

export default SellerDashboardStorePage;
