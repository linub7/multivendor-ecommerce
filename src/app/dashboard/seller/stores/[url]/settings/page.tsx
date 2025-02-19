import { redirect } from 'next/navigation';

import SellerDashboardStoreDetailsForm from '@/components/seller/dashboard/forms/store-details';
import { getStoreByUrl } from '@/queries/store';

interface Props {
  params: Promise<{ url: string }>;
}

const SellerDashboardStoreSettingsPage = async (props: Props) => {
  const { params } = props;
  const { url } = await params;

  const store = await getStoreByUrl(url);
  if (!store) redirect(`/dashboard/seller`);
  return (
    <div>
      <SellerDashboardStoreDetailsForm data={store} />
    </div>
  );
};

export default SellerDashboardStoreSettingsPage;
