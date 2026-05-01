import { completeAssessment, getAssessmentTests, getAssignedAssessment, saveTestResults } from '@/services/assessment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const useGetAssignedAssessment = () =>
  useQuery({
    queryFn: getAssignedAssessment,
    queryKey: ['assignedAssessment'],
    staleTime: Infinity,
  });

const useGetAssessmentTests = (assessmentId, queryConfig = {}) =>
  useQuery({
    queryFn: () => getAssessmentTests({ assessmentId }),
    queryKey: ['assessmentTests', assessmentId],
    ...queryConfig,
  });

const useSaveTestResults = () =>
  useMutation({
    mutationFn: saveTestResults,
  });

const useCompleteAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeAssessment,
    onSuccess: (data) => {
      const { TotalStarsEarned } = data;

      queryClient.setQueryData(['currentChild'], (oldProfileData) => {
        if (!oldProfileData) return oldProfileData;

        return {
          ...oldProfileData,
          num_of_stars: oldProfileData.num_of_stars + TotalStarsEarned,
        };
      });
    },
  });
};

export { useGetAssignedAssessment, useGetAssessmentTests, useSaveTestResults, useCompleteAssessment };
