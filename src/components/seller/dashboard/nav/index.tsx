'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { icons } from '@/constants/icons';
import { DashboardSidebarMenuInterface } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  menuLinks: DashboardSidebarMenuInterface[];
}

const SellerDashboardNav = (props: Props) => {
  const { menuLinks } = props;

  const pathname = usePathname();
  const storeUrlStart = pathname.split('/stores/')[1];
  const activeStore = storeUrlStart ? storeUrlStart.split('/')[0] : '';

  return (
    <nav className="relative grow overflow-y-auto scrollbar">
      <Command className="rounded-lg overflow-visible bg-transparent">
        <CommandInput placeholder="Search..." />
        <CommandList className="py-2 overflow-visible">
          <CommandEmpty>No Links found</CommandEmpty>
          <CommandGroup className="relative pt-0 overflow-visible">
            {menuLinks?.map((item, index) => {
              let icon;
              const iconSearch = icons.find((el) => el.value === item.icon);
              if (iconSearch) icon = <iconSearch.path />;
              return (
                <CommandItem
                  key={index}
                  className={cn(`w-full h-12 cursor-pointer mt-1`, {
                    'bg-accent text-accent-foreground':
                      item.link === ''
                        ? pathname === `/dashboard/seller/stores/${activeStore}`
                        : pathname ===
                          `/dashboard/seller/stores/${activeStore}/${item.link}`,
                  })}
                >
                  <Link
                    href={`/dashboard/seller/stores/${activeStore}/${item.link}`}
                    className={`flex items-center gap-2 hover:bg-transparent transition-all w-full`}
                  >
                    {icon}
                    <span
                      className={`${
                        pathname === item.link ? 'text-primary font-bold' : ''
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </nav>
  );
};

export default SellerDashboardNav;
