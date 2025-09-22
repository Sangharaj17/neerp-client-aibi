import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/aibi/login'); // Redirect to a default tenant's login page
}
