import apiClient from '@/api/apiClient.js';

const assessmentStartEndpoint = 'assessment';

const getAssignedAssessment = async () => {
  const res = await apiClient.get(`${assessmentStartEndpoint}/assigned`);

  return res.data.assignedAssessment;
};

const getAssessmentTests = async ({ assessmentId }) => {
  const res = await apiClient.get(`${assessmentStartEndpoint}/${assessmentId}/tests`);

  return res.data.assessmentTests;
};

export { getAssignedAssessment, getAssessmentTests };
