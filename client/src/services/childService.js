import apiClient from '@/api/apiClient';

const childStartEndpoint = 'child';

const getChildren = async () => {
  const { data } = await apiClient.get(childStartEndpoint);

  return { children: data.parent.children };
};

const createChild = async (data) => {
  return await apiClient.post(childStartEndpoint, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

const updateChild = async (id, newData) => {
  return await apiClient.patch(`${childStartEndpoint}/${id}`, newData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

const deleteChild = async (id) => {
  await apiClient.delete(`${childStartEndpoint}/${id}`);
};

export { getChildren, createChild, updateChild, deleteChild };
