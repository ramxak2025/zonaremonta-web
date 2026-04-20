'use client';
import { StaffLogin } from '../master/page';

export default function AdminLogin() {
  return <StaffLogin roleLabel="директора" redirectTo="/admin/dashboard" />;
}
