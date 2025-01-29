'use server'

import {cookies} from 'next/headers';

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) return null;

  try {
    const Cookie = cookieStore.toString();
    const response = await fetch(`${process.env.API_URL}/auth/verify`, {
      headers: { Cookie },
      cache: 'no-store',
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Invalid session');
    }
    return await response.json();
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}
