import { redirect } from 'next/navigation';

export default function Home({ params }) {
  const { tenant } = params;
  redirect(`/${tenant}/login`);
}
// testing
