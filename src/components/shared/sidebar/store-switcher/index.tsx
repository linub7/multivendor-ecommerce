'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckIcon,
  ChevronsUpDown,
  PlusCircleIcon,
  StoreIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface Props extends PopoverTriggerProps {
  stores: Record<string, any>[];
}

const StoreSwitcher = (props: Props) => {
  const { stores, className } = props;
  const formattedItems = stores.map((store) => ({
    label: store.name,
    value: store.url,
  }));

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  // get active store
  const activeStore = formattedItems.find(
    (store) => store.value === params.url
  );

  const handleSelectItem = (url: string) => {
    setOpen(false);
    if (url !== activeStore?.value)
      router.push(`/dashboard/seller/stores/${url}`);
    else return;
  };

  const handleNavigateToNewStorePage = () => {
    setOpen(false);
    router.push(`/dashboard/seller/stores/new`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          size={'sm'}
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn('w-[250px] justify-between', className)}
        >
          <StoreIcon className="mr-2 w-4 h-4" />
          {activeStore?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No Store Selected.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => handleSelectItem(item.value)}
                  className="text-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <StoreIcon className="w-4 h-4" />
                    {item.label}
                  </div>
                  {activeStore?.value === item.value ? (
                    <CheckIcon className="ml-auto w-4 h-4" />
                  ) : (
                    <ArrowRight className="ml-auto w-4 h-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandItem
              className="cursor-pointer"
              onSelect={handleNavigateToNewStorePage}
            >
              <div className="flex items-center gap-2">
                <PlusCircleIcon className="w-4 h-4 ml-1" />
                Create a Store
              </div>
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
