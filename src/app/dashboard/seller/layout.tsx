import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const SellerDashboardLayout = (props: Props) => {
  return <div>{props.children}</div>;
};

export default SellerDashboardLayout;
