import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

const DashboardPage = async () => {
  // get user and redirect based on his role
  const user = await currentUser();

  if (!user?.privateMetadata?.role || user?.privateMetadata?.role === 'USER')
    redirect('/');
  if (user?.privateMetadata?.role === 'ADMIN') redirect('/dashboard/admin');
  if (user?.privateMetadata?.role === 'SELLER') redirect('/dashboard/seller');
};

export default DashboardPage;
