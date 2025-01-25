import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

import AdminDashboardHeader from '@/components/admin/dashboard/header';
import DashboardSidebar from '@/components/shared/sidebar';

interface Props {
  children: ReactNode;
}

const AdminDashboardLayout = async (props: Props) => {
  // block non-admin from accessing this dashboard
  const user = await currentUser();
  if (!user || user?.privateMetadata?.role !== 'ADMIN') redirect('/');

  return (
    <div className="w-full h-full">
      {/* Sidebar */}
      <DashboardSidebar isAdmin={true} />
      <div className="ml-[300px]">
        {/* Header */}
        <AdminDashboardHeader />
        <div className="w-full mt-[75px] p-4">{props.children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
