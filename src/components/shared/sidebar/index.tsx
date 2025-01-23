import { currentUser } from '@clerk/nextjs/server';

import Logo from '../logo';
import DashboardUserInfo from './user-info';
import AdminDashboardNav from '@/components/admin/dashboard/nav';
import { adminDashboardSidebarOptions } from '@/constants/data';

interface Props {
  isAdmin?: boolean;
}

const DashboardSidebar = async (props: Props) => {
  const { isAdmin } = props;

  const user = await currentUser();
  return (
    <div className="w-[300px] border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0">
      <Logo width="100%" height="180px" />
      <span className="mt-3" />
      {user && <DashboardUserInfo user={user} />}
      {isAdmin && (
        <AdminDashboardNav menuLinks={adminDashboardSidebarOptions} />
      )}
    </div>
  );
};

export default DashboardSidebar;
