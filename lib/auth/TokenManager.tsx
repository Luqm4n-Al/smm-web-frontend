'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function TokenManager() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.accessToken) {
      localStorage.setItem('token', session.user.accessToken);
    } else {
      localStorage.removeItem('token');
    }
  }, [session]);

  return null;
}