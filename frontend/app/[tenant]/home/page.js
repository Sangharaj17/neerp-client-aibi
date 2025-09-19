// ✅ Server component
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import HomePageClient from './client'; 

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  //const username = cookieStore.get('username')?.value;
 
          console.log("------in home page----11111---->");
  let username = '';
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("======decoded token=====>",decoded);
      username = decoded.username;
    } catch (e) {
      console.error('Invalid token', e);
    }
  }
console.log("======username in homepage=====>",username);
  return <HomePageClient token={token} token_username={username} />;
}
