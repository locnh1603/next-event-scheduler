'use client';
import React, { Suspense, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn-ui/card';
import { Button } from '@/components/shadcn-ui/button';
import { Label } from '@/components/shadcn-ui/label';
import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';
import { UserProfile } from '@/models/user-profile.model';
import { clientUserProfileService } from '@/services/app/client/user-profile.service';

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

const ProfileContent = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        redirect('/unauthorized');
      }
      const profile = await clientUserProfileService.getUserProfile(
        data.user.id
      );
      setUserProfile(profile);
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!userProfile) {
    return <div>Failed to load user profile.</div>;
  }

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
              <span>{userProfile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Label>First Name</Label>
              <span>{userProfile.firstname}</span>
            </div>
            <div className="flex items-center gap-2">
              <Label>Last Name</Label>
              <span>{userProfile.lastname}</span>
            </div>
            <div className="flex items-center gap-2">
              <Label>Phone Number</Label>
              <span>{userProfile.phonenumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Label>Birthday</Label>
              <span>{userProfile.birthday}</span>
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
