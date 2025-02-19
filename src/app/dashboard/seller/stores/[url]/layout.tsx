import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

import AdminDashboardHeader from '@/components/admin/dashboard/header';
import DashboardSidebar from '@/components/shared/sidebar';
import { getSellerAllStores } from '@/queries/store';

interface Props {
  children: ReactNode;
}

const SellerDashboardStoreLayout = async (props: Props) => {
  const user = await currentUser();
  if (!user || user?.privateMetadata?.role !== 'SELLER') return redirect('/');

  const stores = await getSellerAllStores();
  if (stores.length === 0) return redirect('/dashboard/seller/stores/new');

  return (
    <div className="w-full h-full">
      <DashboardSidebar isSeller={true} stores={stores} />
      <div className="ml-[300px]">
        <AdminDashboardHeader />
        <div className="w-full mt-[75px] p-4">{props.children}</div>
      </div>
    </div>
  );
};

export default SellerDashboardStoreLayout;
