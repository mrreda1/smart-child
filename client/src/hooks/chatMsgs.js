import { chatWithStream, getSessionMsgs } from '@/services/chatMsgs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetSessionMsgs = (data, queryConfig) => {
  const thirdKey = { limit: data.query.limit, sort: data.query.sort, page: data.query.page };

  return useQuery({
    queryKey: ['session-msgs', data.query.sessionId, thirdKey],
    queryFn: () => getSessionMsgs(data),

    keepPreviousData: true,
    placeholderData: (previousData) => previousData,

    ...queryConfig,
  });
};

export const useChatWithStream = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, childId, message, onChunk }) => {
      return chatWithStream({ sessionId, childId, message, onChunk });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['session-msgs', variables.sessionId],
      });
    },
  });
};
