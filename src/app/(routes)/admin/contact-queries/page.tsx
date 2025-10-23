import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ContactQueriesClient from './ContactQueriesClient';

export default async function ContactQueriesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const role = cookieStore.get('auth_role')?.value;

  if (!token) {
    redirect('/authentication');
  }
  if (role !== 'admin') {
    redirect('/');
  }

  return <ContactQueriesClient />;
}