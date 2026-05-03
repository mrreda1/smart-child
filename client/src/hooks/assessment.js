import { getAssessmentTests, getAssignedAssessment, saveTestResults } from '@/services/assessment';
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

const useSaveTestResults = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveTestResults,
    onSuccess: (data) => {
      if (data.assessmentState.status === 'completed')
        queryClient.invalidateQueries({ queryKey: ['assignedAssessment'] });
    },
  });
};

export { useGetAssignedAssessment, useGetAssessmentTests, useSaveTestResults };
