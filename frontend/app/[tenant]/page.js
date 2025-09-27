import { redirect } from 'next/navigation';

export default function Home({ params }) {
  const { tenant } = params;
  // Redirect to clean path; middleware rewrites internally to /<tenant>/login
  redirect(`/login`);
}
// testing
