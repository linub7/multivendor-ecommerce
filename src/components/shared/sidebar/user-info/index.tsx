import { User } from '@clerk/nextjs/server';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Props {
  user: User | null;
}

const DashboardUserInfo = (props: Props) => {
  const { user } = props;
  const role = user?.privateMetadata?.role?.toString()?.toLocaleLowerCase();
  return (
    <div>
      <div>
        <Button
          variant={'ghost'}
          className="w-full mt-5 mb-4 flex items-center justify-between py-10"
        >
          <div className="flex items-center text-left gap-2">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={user?.imageUrl}
                alt={`${user?.firstName} ${user?.lastName}`}
              />
              <AvatarFallback className="bg-primary text-white">
                {user?.firstName} {user?.lastName}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-y-1">
              {user?.firstName} {user?.lastName}
              <span className="text-muted-foreground">
                {user?.emailAddresses[0].emailAddress}
              </span>
              <span className="w-fit">
                <Badge variant={'secondary'} className="capitalize">
                  {role} Dashboard
                </Badge>
              </span>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default DashboardUserInfo;
