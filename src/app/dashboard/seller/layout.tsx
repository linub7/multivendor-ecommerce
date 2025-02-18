import { ReactNode } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface Props {
  children: ReactNode;
}

const SellerDashboardLayout = async (props: Props) => {
  const user = await currentUser();
  if (!user || user?.privateMetadata?.role !== 'SELLER') redirect('/');
  return <div>{props.children}</div>;
};

export default SellerDashboardLayout;
