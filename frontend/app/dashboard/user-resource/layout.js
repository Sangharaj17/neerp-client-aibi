'use client';

import { usePathname } from 'next/navigation';
import PageHeader from '@/components/UI/PageHeader';

// Page title mapping
const pageTitles = {
  '/dashboard/user-resource/employee-list': 'Employee List',
  '/dashboard/user-resource/add-user-role': 'Add User Role',
  '/dashboard/user-resource/assign-role': 'Assign Role',
  '/dashboard/user-resource/change-password': 'Change Password',
  '/dashboard/user-resource/add-required-document': 'Add Required Document',
  '/dashboard/user-resource/add-tax-type': 'Add Tax Type',
  '/dashboard/user-resource/employee-in-time': 'Employee In Time',
  '/dashboard/user-resource/employee-out-time': 'Employee Out Time',
  '/dashboard/user-resource/employee-leave-entry': 'Employee Leave Entry',
  '/dashboard/user-resource/employee-attendance-list': 'All Employee Attendance',
};

export default function UserResourceLayout({ children }) {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || 'User Resource';

  return (
    <>
      <PageHeader title={pageTitle} showBack />
      {children}
    </>
  );
}

