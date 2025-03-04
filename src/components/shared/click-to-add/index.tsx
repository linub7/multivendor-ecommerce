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
    initialDetail = {} as T, // Default value for initialDetail is an empty object
    setDetails,
  } = props;

  const handleAddDetail = () => {
    // Add a new detail object to the details array
    setDetails([
      ...details,
      {
        ...initialDetail, // Spread the initialDetail object to set initial values
      },
    ]);
  };

  const handleRemoveDetail = (index: number) => {
    // we must at least keep one detail we can not delete if it's the only detail avaiable
    if (details.length === 1) return;
    const updatedDetails = details.filter((_, idx) => idx !== index);
    setDetails(updatedDetails);
  };

  const handleDetailsChange = (
    index: number,
    property: string,
    value: string | number
  ) => {
    // Update the details array with the new property value
    const updatedDetails = details.map((detail, idx) =>
      idx === index ? { ...detail, [property]: value } : detail
    );
    setDetails(updatedDetails);
  };
  return (
    <div className="flex flex-col gap-y-4">
      <div>{header}</div>
      {details?.length === 0 && <PlusButton onClick={handleAddDetail} />}
      {details?.map((detail: any, index: number) => (
        <div
          key={index}
          className="flex items-center flex-wrap gap-y-1 gap-x-4"
        >
          {Object.keys(detail).map((property, propertyIndex) => (
            <div key={propertyIndex} className="flex items-center gap-x-4">
              <Input
                className="w-28"
                type={typeof detail[property] === 'number' ? 'number' : 'text'}
                name={property}
                placeholder={property}
                value={detail[property]}
                min={typeof detail[property] === 'number' ? 0 : undefined}
                step="0.01"
                onChange={(e) =>
                  handleDetailsChange(
                    index,
                    property,
                    e.target.type === 'number'
                      ? parseFloat(e.target.value)
                      : e.target.value
                  )
                }
              />
            </div>
          ))}
          <MinusButton onClick={() => handleRemoveDetail(index)} />
          <PlusButton onClick={handleAddDetail} />
        </div>
      ))}
    </div>
  );
};

export default ClickToAddComponent;
