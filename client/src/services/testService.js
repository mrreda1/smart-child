import apiClient from '@/api/apiClient';

const testStartEndpoint = 'test';

const getTestsDesc = async () => {
  // const res = await apiClient.get(`${testStartEndpoint}/desc`);

  return new Promise((res, rej) => {
    setTimeout(async () => {
      res((await apiClient.get(`${testStartEndpoint}/desc`)).data);
    }, 2000);
  });

  // return res.data;
};

export { getTestsDesc };
