import { UserButton } from '@clerk/nextjs';

import ThemeToggle from '@/components/shared/theme-toggle';

export default function Home() {
  return (
    <div className="p-5">
      <div className="w-100 flex gap-x-5 justify-end">
        <UserButton />
        <ThemeToggle />
      </div>
      <h1 className="text-blue-500 font-barlow">Home</h1>
    </div>
  );
}
