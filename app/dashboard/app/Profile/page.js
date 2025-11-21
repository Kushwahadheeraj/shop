"use client";
import ProfilePage from './Profile';
import SellerRoute from '@/components/SellerRoute';

export default function Profile() {
  return (
    <SellerRoute>
      <ProfilePage />
    </SellerRoute>
  );
}