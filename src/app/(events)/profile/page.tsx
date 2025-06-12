import React, { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn-ui/card';
import { Button } from '@/components/shadcn-ui/button';
import { Label } from '@/components/shadcn-ui/label';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const ProfileSkeleton = () => (
  <div>
    <div className="max-w-2xl mx-auto mb-6">
      <div className="animate-pulse">
        <div className="h-10 w-2/3 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
      </div>
    </div>
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
          <div className="flex gap-2 mt-6">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ProfileContent = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect('/unauthorized');
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
};

const Profile = () => (
  <Suspense fallback={<ProfileSkeleton />}>
    <ProfileContent />
  </Suspense>
);

export default Profile;
