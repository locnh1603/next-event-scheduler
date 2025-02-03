import {Card, CardContent, CardHeader } from '@/components/card';
import {auth} from '@/auth';
import React from 'react';
import {Button} from '@/components/button';
import {Label} from '@/components/label';

const Profile = async () => {
  const session = await auth();
  if (!session?.user) {
    return (
      <></>
    )
  }
  const { user } = session;
  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        {/*<Avatar className="h-20 w-20">*/}
        {/*  <AvatarImage src={user.avatar} alt={user.name} />*/}
        {/*  <AvatarFallback>{user.name[0]}</AvatarFallback>*/}
        {/*</Avatar>*/}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">User Profile</h2>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Email</Label>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Label>Full Name</Label>
            <span>{user.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Label>Phone</Label>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Label>Email</Label>
            <span>{user.email}</span>
          </div>
          <div className="flex gap-2 mt-6">
            <Button>Edit Profile</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default Profile;
