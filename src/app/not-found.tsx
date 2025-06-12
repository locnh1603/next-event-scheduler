import Link from 'next/link';
import { Button } from '@/components/shadcn-ui/button';
import { ShieldX, HomeIcon } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-background animate-in fade-in duration-500">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="bg-destructive/10 p-4 rounded-full">
          <ShieldX className="h-12 w-12 text-destructive" />
        </div>
        <p className="text-sm text-muted-foreground">Error Code: 404</p>
        <h1 className="text-4xl font-bold tracking-tight">Not Found</h1>

        <p className="text-muted-foreground text-lg max-w-[400px]">
          The page you are trying to access does not exist.
        </p>

        <Link href="/">
          <Button className="mt-4" variant="default">
            <HomeIcon className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default NotFound;
