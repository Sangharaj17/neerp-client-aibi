import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function Home() {
  const headersList = headers();
  const hostHeader = headersList.get('host') || '';
  const [hostName] = hostHeader.split(':');
  const tenant = hostName.replace(/^www\./i, '');

  // If we have a valid tenant (not localhost), redirect to tenant-specific login
  if (tenant && !tenant.includes('localhost')) {
    redirect(`/${tenant}/login`);
  }

  // For localhost or no tenant, redirect to general login
  redirect('/login');
}
