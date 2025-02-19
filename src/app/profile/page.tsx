import {Card, CardContent, CardHeader, CardTitle} from '@/components/card';
import {auth} from '@/auth';
import React from 'react';
import {Button} from '@/components/button';
import {Label} from '@/components/label';
import {redirect} from 'next/navigation';

const Profile = async () => {
  const session = await auth()
  if (!session?.user) {
    redirect('/unauthorized')
  }
  const { user } = session;
  return (
    <div>
      <div className="max-w-2xl mx-auto mb-6">
        <h1 className="text-4xl font-bold mb-2">User Profile</h1>
        <p className="text-gray-600">User details and additional information</p>
      </div>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
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
    </div>
  );
}
export default Profile;
