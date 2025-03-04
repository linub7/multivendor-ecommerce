import { Dispatch, SetStateAction } from 'react';

interface Props {
  color: string;
  setActiveColor: Dispatch<SetStateAction<string>>;
  onClick: (color: string) => void;
}

const CustomColor = (props: Props) => {
  const { color, setActiveColor, onClick } = props;
  return (
    <div
      className="w-20 h-[80px] cursor-pointer transition-all duration-100 ease-linear relative hover:w-[120px] hover:duration-300"
      style={{ backgroundColor: color }}
      onMouseEnter={() => setActiveColor(color)}
      onClick={() => onClick(color)}
    >
      {/* Color Label */}
      <div className="w-full h-8 text-center text-xs font-semibold absolute -top-6 text-black">
        {color}
      </div>
    </div>
  );
};

export default CustomColor;
