import Link from 'next/link';
import { Button } from '@/components/shadcn-ui/button';
import { Settings, User, LogOut, Menu } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/shadcn-ui/navigation-menu';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/shadcn-ui/alert-dialog';
import { createClient } from '@/lib/supabase/server';
import { userProfileService } from '@/services/api/user-profile.service';
import { UserProfile } from '@/models/user-profile.model';
import ThemeSwitcher from './theme-switcher';

const NavBar = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let userView;
  let profile: UserProfile | null = null;
  if (user) {
    try {
      profile = await userProfileService.getUserProfile();
    } catch (error) {
      console.error('Failed to fetch user profile', error);
    }
  }

  if (user && profile) {
    userView = (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <User className="h-5 w-5" />
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[300px] gap-3 p-4">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none"
                    href="/profile"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      {profile.firstName} {profile.lastName}
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      View and edit your profile.
                    </p>
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink
                  className="cursor-pointer hover:bg-slate-100 p-2 rounded"
                  asChild
                >
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </NavigationMenuLink>
                <form action="/api/auth/signout" method="post">
                  <NavigationMenuLink
                    asChild
                    className="cursor-pointer hover:bg-slate-100 p-2 rounded"
                  >
                    <Link href="/logout" className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Link>
                  </NavigationMenuLink>
                </form>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  } else {
    userView = (
      <AlertDialog>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <User className="h-5 w-5" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-3 p-4 md:w-[250px]">
                  <AlertDialogTrigger asChild>
                    <li>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Login
                      </NavigationMenuLink>
                    </li>
                  </AlertDialogTrigger>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Login</AlertDialogTitle>
            <AlertDialogDescription>
              Login to use any of the providers below
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <form action="/api/auth/signin" method="post">
                <Button variant="outline" className="w-full" type="submit">
                  Google
                </Button>
              </form>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return (
    <div className="w-full border-b min-h-[5vh]">
      <div className="flex h-16 items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/events" className="text-xl font-bold">
            Home
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Events</NavigationMenuTrigger>
                <NavigationMenuContent className="data-[side=bottom]:animate-slideUpAndFade">
                  <div className="grid gap-3 p-4 w-[300px]">
                    <NavigationMenuLink
                      className="cursor-pointer hover:bg-slate-100 p-2 rounded"
                      asChild
                    >
                      <Link href="/my-center">My Center</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      className="cursor-pointer hover:bg-slate-100 p-2 rounded"
                      asChild
                    >
                      <Link href="/events">Event List</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      className={`cursor-pointer hover:bg-slate-100 p-2 rounded ${user ? '' : ' disabled'}`}
                      asChild
                    >
                      <Link href="/events/create">Create Event</Link>
                    </NavigationMenuLink>

                    <NavigationMenuLink
                      className={`cursor-pointer hover:bg-slate-100 p-2 rounded ${user ? '' : ' disabled'}`}
                      asChild
                    >
                      <Link href="/calendar">My Calendar</Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <Link href="/about">About</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {userView}
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};
export default NavBar;
