import apiClient from '@/api/apiClient.js';

const chatStartEndpoint = 'chat';

const getSessionMsgs = async (data) => {
  const searchParams = new URLSearchParams(data.query).toString();

  return new Promise(async (res, rej) => {
    setTimeout(async () => {
      res((await apiClient.get(`${chatStartEndpoint}?${searchParams}`)).data);
    }, 2000);
  });

  //   return (await apiClient.get(`${sessionStartEndpoint}?${searchParams}`)).data;
};

// setTimeout(async () => {
//   const query = { sessionId: '6a25c75e0d9ae3918dda4175', limit: 2, page: 2 };

//   console.log(await getSessionMsgs({ query }));
// }, 2000);

export { getSessionMsgs };
