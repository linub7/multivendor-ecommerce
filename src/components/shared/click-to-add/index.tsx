/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction } from 'react';

import PlusButton from '../buttons/plus';
import { Input } from '@/components/ui/input';
import MinusButton from '../buttons/minus';

// Define the interface for each detail object
export interface Detail<T = { [key: string]: string | number | undefined }> {
  [key: string]: T[keyof T];
}

// Define props for the ClickToAddInputs component
interface Props<T extends Detail> {
  details: T[]; // Array of detail objects
  initialDetail?: T; // Optional initial detail object
  header?: string; // Header text for the component
  colorPicker?: boolean; // Is color picker needed
  containerClassName?: string;
  inputClassName?: string;
  setDetails: Dispatch<SetStateAction<T[]>>; // Setter function for details
}

const ClickToAddComponent = <T extends Detail>(props: Props<T>) => {
  const {
    details,
    header,
    initialDetail = {}, // Default value for initialDetail is an empty object
    setDetails,
  } = props;
  return (
    <div className="flex flex-col gap-y-4">
      <div>{header}</div>
      {details?.length === 0 && <PlusButton onClick={() => {}} />}
      {details?.map((detail: any, index: number) => (
        <div key={index} className="flex items-center gap-x-4">
          {Object.keys(detail).map((property, propertyIndex) => (
            <div key={propertyIndex} className="flex items-center gap-x-4">
              <Input
                className="w-28"
                type={typeof detail[property] === 'number' ? 'number' : 'text'}
                name={property}
                placeholder={property}
                value={detail[property]}
                min={typeof detail[property] === 'number' ? 0 : undefined}
              />
            </div>
          ))}
          <MinusButton onClick={() => {}} />
          <PlusButton onClick={() => {}} />
        </div>
      ))}
    </div>
  );
};

export default ClickToAddComponent;
