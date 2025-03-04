import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import { Trash } from 'lucide-react';

import NoImage from '../../../../public/assets/images/no_image_2.png';
import { cn, getDominantColors, getGridClassName } from '@/lib/utils';
import ColorPalette from '../color-palette';

interface Props {
  images: { url: string }[];
  imgColors?: { color: string }[]; // List of colors from form
  setImgColors?: Dispatch<
    SetStateAction<
      {
        color: string;
      }[]
    >
  >;
  onRemove: (value: string) => void;
}

const ImagesPreviewGrid = (props: Props) => {
  const { images, imgColors, setImgColors, onRemove } = props;
  const imagesLength = images?.length;

  const [extractedImageColors, setExtractedImageColors] = useState<string[][]>(
    []
  );

  useEffect(() => {
    if (imagesLength > 0) fetchImagesColors();

    return () => {
      setExtractedImageColors([]);
    };
  }, [images]);

  const fetchImagesColors = async () => {
    const palettes = await Promise.all(
      images.map(async (img) => {
        try {
          const colors = await getDominantColors(img.url);
          return colors;
        } catch (error) {
          console.log(error);
          return [];
        }
      })
    );
    setExtractedImageColors(palettes);
  };

  const gridClassName = getGridClassName(imagesLength);

  if (imagesLength === 0)
    return (
      <div>
        <Image
          src={NoImage}
          alt="no images"
          width={500}
          height={600}
          className="rounded-md"
        />
      </div>
    );
  return (
    <div className="max-w-4xl">
      <div
        className={cn(
          'grid h-[800px] overflow-hidden bg-white rounded-md',
          gridClassName
        )}
      >
        {images?.map((item, index) => (
          <div
            key={index}
            className={cn(
              'relative group h-full w-full border border-gray-300',
              `grid_${imagesLength}_image_${index + 1}`,
              {
                // 800px / 3 = 266.66px
                'h-[266.66px]': images.length === 6,
              }
            )}
          >
            <Image
              src={item.url}
              alt="Image"
              height={800}
              width={800}
              className="w-full h-full object-cover object-top"
            />
            {/* Actions */}
            <div
              className={cn(
                'absolute top-0 left-0 right-0 bottom-0 hidden group-hover:flex bg-white/55 cursor-pointer  items-center justify-center flex-col gap-y-3 transition-all duration-500',
                {
                  '!pb-[40%]': imagesLength === 1,
                }
              )}
            >
              {/* Color Palette */}
              <ColorPalette
                extractedColors={extractedImageColors[index]}
                imgColors={imgColors}
                setImgColors={setImgColors}
              />
              {/* Delete Button */}
              <button
                className="Btn"
                type="button"
                onClick={() => onRemove(item.url)}
              >
                <div className="sign">
                  <Trash size={18} />
                </div>
                <div className="text">Delete</div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagesPreviewGrid;
