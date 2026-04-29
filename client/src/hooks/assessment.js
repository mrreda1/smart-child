import { getAssessmentTests, getAssignedAssessment, saveTestResults } from '@/services/assessment';
import { useMutation, useQuery } from '@tanstack/react-query';

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

export { useGetAssignedAssessment, useGetAssessmentTests, useSaveTestResults };
