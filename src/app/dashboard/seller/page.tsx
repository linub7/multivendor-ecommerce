import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

import { getSellerAllStores } from '@/queries/store';

const SellerDashboardPage = async () => {
  const user = await currentUser();
  if (!user) return redirect('/');

  const stores = await getSellerAllStores();
  // if (stores.length === 0) return redirect('/dashboard/seller/stores/new');

  redirect(`/dashboard/seller/stores/${stores[0].url}`);
};

export default SellerDashboardPage;
