import { getCurrentUser, updateCurrentUser } from "@/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useGetUser = ({
  refetchOnUnVerified = false,
  refetchIntervalSec = 5,
}) => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
    refetchInterval: ({ state }) => {
      if (!refetchOnUnVerified) return false;

      const isError = state.status === "error";

      const isVerified = state.data?.verifiedEmail;

      return isVerified || isError ? false : refetchIntervalSec * 1000;
    },
    retry: false,
  });
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);

      toast.success("Updated");
    },
  });
};

export { useGetUser, useUpdateUser };
