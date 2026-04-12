import { getCurrentUser } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";

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

export { useGetUser };
