import apiClient from "@/api/apiClient";

const userStartEndpoint = "user";

const getCurrentUser = async () => {
  const res = await apiClient.get(`${userStartEndpoint}/me`);

  return res.data.user;
};

const updateCurrentUser = async (newData) => {
  const res = await apiClient.patch(`${userStartEndpoint}/me`, newData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.user;
};

export { getCurrentUser, updateCurrentUser };
