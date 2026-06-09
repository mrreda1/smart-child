import apiClient from '@/api/apiClient.js';
import { cleanChunk } from '@/utils/TextFormat';

const chatStartEndpoint = 'chat';

const getSessionMsgs = async (data) => {
  const searchParams = new URLSearchParams(data.query).toString();

  return (await apiClient.get(`${chatStartEndpoint}?${searchParams}`)).data;
};

const chatWithStream = async ({ sessionId, childId, message, onChunk }) => {
  let previousLength = 0;

  const response = await apiClient.post(
    `${chatStartEndpoint}?stream=true`,
    { sessionId, childId, message },
    {
      onDownloadProgress: (progressEvent) => {
        const currentText = progressEvent.event.target.responseText;

        const newChunk = currentText.substring(previousLength);
        previousLength = currentText.length;

        if (onChunk && newChunk) {
          onChunk(cleanChunk(newChunk));
        }
      },
    },
  );

  return response;
};

export { chatWithStream, getSessionMsgs };
