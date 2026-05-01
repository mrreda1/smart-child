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

const saveTestResults = async ({ assessmentTestId, rawData }) => {
  return await apiClient.post(`${assessmentStartEndpoint}/test/${assessmentTestId}`, rawData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

const completeAssessment = async ({ assessmentTestId }) => {
  const res = await apiClient.patch(`${assessmentStartEndpoint}/${assessmentTestId}/complete`);

  return res.data;
};

export { getAssignedAssessment, getAssessmentTests, saveTestResults, completeAssessment };
