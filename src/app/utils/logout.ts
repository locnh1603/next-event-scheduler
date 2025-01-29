'use server'
import {cookies} from 'next/headers';

export async function logout() {
  const cookie = await cookies();
  cookie.delete('access_token');
}
