import apiClient from '@/api/apiClient';

const reportStartEndpoint = 'report';

const getDailyReports = async (data) => {
  const searchParams = new URLSearchParams(data.query).toString();

  return new Promise((res, rej) => {
    setTimeout(() => {
      apiClient
        .get(`${reportStartEndpoint}/daily/${data.params.childId}?${searchParams}`)
        .then((response) => res(response))
        .catch((err) => rej(err));
    }, 2000);
  });

  // return await apiClient.get(`${reportStartEndpoint}/daily/${data.params.childId}?${searchParams}`);
};

export { getDailyReports };
