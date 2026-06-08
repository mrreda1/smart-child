import apiClient from '@/api/apiClient.js';

const sessionStartEndpoint = 'session';

const getSessions = async (data) => {
  const searchParams = new URLSearchParams(data.query).toString();

  return new Promise(async (res, rej) => {
    setTimeout(async () => {
      res((await apiClient.get(`${sessionStartEndpoint}?${searchParams}`)).data);
    }, 2000);
  });

  //   return (await apiClient.get(`${sessionStartEndpoint}?${searchParams}`)).data;
};

const deleteSession = async (sessionId) => {
  await apiClient.delete(`${sessionStartEndpoint}/${sessionId}`);
};

// setTimeout(async () => {
//   const query = { childId: '6a12b6db249a5a5fecee315f', sort: '-createdAt', limit: 1, page: 1 };

//   console.log(await getSessions({ query }));
// }, 2000);

export { getSessions, deleteSession };
