import { getAssessmentTests, getAssignedAssessment } from '@/services/assessment';
import { useQuery } from '@tanstack/react-query';

const useGetAssignedAssessment = () =>
  useQuery({
    queryFn: getAssignedAssessment,
    queryKey: ['assignedAssessment'],
    staleTime: Infinity,
  });

const useGetAssessmentTests = (assessmentId, queryConfig) =>
  useQuery({
    queryFn: () => getAssessmentTests({ assessmentId }),
    queryKey: ['assessmentTests', assessmentId],
  });

export { useGetAssignedAssessment, useGetAssessmentTests };
