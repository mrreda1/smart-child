import { deleteSession, getSessions } from '@/services/chatSession';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetChatSessions = (data, queryConfig) => {
  const thirdKey = { sort: data.query.sort, limit: data.query.limit, page: data.query.page };

  return useQuery({
    queryKey: ['chat-sessions', data.query.childId, thirdKey],

    queryFn: () => getSessions(data),

    keepPreviousData: true,
    placeholderData: (previousData) => previousData,

    ...queryConfig,
  });
};

export const useDeleteChatSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId }) => deleteSession(sessionId),

    onSuccess: async (_, variables) => {
      console.log(variables.childId);

      await queryClient.invalidateQueries([['chat-sessions', variables.childId]]);
    },
  });
};
