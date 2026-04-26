import { getTestsDesc } from '@/services/testService';
import { useQuery } from '@tanstack/react-query';

const useGetTestsConfig = () =>
  useQuery({
    queryFn: getTestsDesc,
    queryKey: ['testsConfig'],
    staleTime: Infinity,
  });

export { useGetTestsConfig };
