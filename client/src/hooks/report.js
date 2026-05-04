import { useQuery } from '@tanstack/react-query';

import { getDailyReports } from '@/services/report';

const useGetDailyReports = (data, queryOptions) =>
  useQuery({
    queryFn: () => getDailyReports(data),
    queryKey: ['dailyReports', data.params.childId, data.query.page],
    ...queryOptions,
  });

export { useGetDailyReports };
