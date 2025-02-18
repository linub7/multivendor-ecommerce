import { currentUser } from '@clerk/nextjs/server';
import { Store } from '@prisma/client';

import Logo from '../logo';
import DashboardUserInfo from './user-info';
import AdminDashboardNav from '@/components/admin/dashboard/nav';
import {
  adminDashboardSidebarOptions,
  sellerDashboardSidebarOptions,
} from '@/constants/data';
import SellerDashboardNav from '@/components/seller/dashboard/nav';

interface Props {
  isAdmin?: boolean;
  isSeller?: boolean;
  stores?: Store[];
}

const DashboardSidebar = async (props: Props) => {
  const { isAdmin, isSeller, stores } = props;

  const user = await currentUser();
  return (
    <div className="w-[300px] border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0">
      <Logo width="100%" height="180px" />
      <span className="mt-3" />
      {user && <DashboardUserInfo user={user} />}
      {isAdmin && (
        <AdminDashboardNav menuLinks={adminDashboardSidebarOptions} />
      )}
      {isSeller && (
        <SellerDashboardNav menuLinks={sellerDashboardSidebarOptions} />
      )}
    </div>
  );
};

export default DashboardSidebar;
