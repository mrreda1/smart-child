import apiClient from "@/api/apiClient";

const userStartEndpoint = "user";

const getCurrentUser = async () => {
  const res = await apiClient.get(`${userStartEndpoint}/me`);

  return res.data.user;
};

export { getCurrentUser };
