import { useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { createApiClient } from '@/lib/api';

export function useApi() {
  const { getToken } = useAuth();
  console.log(getToken())
  return useMemo(() => createApiClient(getToken), [getToken]);
}
