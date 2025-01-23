import Image from 'next/image';

import LogoImg from '../../../../public/assets/icons/logo-1.png';

interface Props {
  width: string;
  height: string;
}

const Logo = (props: Props) => {
  const { height, width } = props;

  return (
    <div className="z-50" style={{ width, height }}>
      <Image
        src={LogoImg}
        alt="GoShop"
        className="w-full h-full object-cover overflow-visible"
      />
    </div>
  );
};

export default Logo;
