import {cookies} from 'next/headers';

const fetchWithCookie = async (url: string, options = {}) => {
  const cookieStore = await cookies();
  const Cookie = cookieStore.toString();
  return fetch(url, {
    ...options,
    headers: {
      Cookie
    },
  });
}
export default fetchWithCookie;
