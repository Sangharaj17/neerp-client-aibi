import { redirect } from 'next/navigation';

export default function Home() {
  // Middleware will rewrite to /<tenant>/..., so redirect to /login which will be rewritten
  redirect('/login');
}
