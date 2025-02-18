import {auth, signIn, signOut} from "@/auth";
import Link from 'next/link';
import {Button} from '@/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { Settings, User, LogOut, Menu } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/navigation-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/alert-dialog"
import Image from "next/image";
import {redirect} from 'next/navigation';

const NavBar = async () => {
  const session = await auth();
  let user = <></>;
  if (session?.user) {
    user = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <DropdownMenuItem className="cursor-pointer" onClick={async () => {
            "use server"
            redirect('/profile');
          }}>
            <User className="mr-2 h-4 w-4"/>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={async () => {
            "use server"
            redirect('/settings');
          }}>
            <Settings className="mr-2 h-4 w-4"/>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator/>
          <DropdownMenuItem className="cursor-pointer" onClick={async () => {
            "use server"
            await signOut();
          }}>
            <LogOut className="mr-2 h-4 w-4"/>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  } else {
    user = (
      <div>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Guest</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4"/>
                <AlertDialogTrigger asChild>
                  <div>Login</div>
                </AlertDialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Login</AlertDialogTitle>
              <AlertDialogDescription>
                Login to use any of the providers below
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="w-full" onClick={async() => {
                  'use server'
                  await signIn('google');
                }}>
                  Google
                </Button>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }
  return (
    <div className="w-full border-b min-h-[5vh]">
      <div className="flex h-16 items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5"/>
          </Button>
          <span className="text-xl font-bold">
            <Image src="/next.svg" alt="Logo" width="50" height="50"/>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Events</NavigationMenuTrigger>
                <NavigationMenuContent className="data-[side=bottom]:animate-slideUpAndFade">
                  <div className="grid gap-3 p-4 w-[400px]">
                    <Link href='/events' passHref legacyBehavior>
                      <NavigationMenuLink className="cursor-pointer hover:bg-slate-100 p-2 rounded">
                        Event List
                      </NavigationMenuLink>
                    </Link>
                    <Link href='/events/create' passHref legacyBehavior>
                      <NavigationMenuLink className={
                        `cursor-pointer hover:bg-slate-100 p-2 rounded ${session?.user ? '' : ' disabled'}`
                      }>
                        Create Event
                      </NavigationMenuLink>
                    </Link>
                    <Link href='/calendar' passHref legacyBehavior>
                      <NavigationMenuLink className={`cursor-pointer hover:bg-slate-100 p-2 rounded ${session?.user ? '' : ' disabled'}`}>
                        My Calendar
                      </NavigationMenuLink>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {user}
        </div>
      </div>
    </div>
  )
}
export default NavBar
