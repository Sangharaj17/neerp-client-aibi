import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function TenantRoot({ params }) {
  const { tenant } = params;
  redirect(`/${tenant}/login`);
}
