import { axiosInstance } from '../../configs/axios.config';

const API_URL = '/roles';

const getAllRoles = () => axiosInstance.get(API_URL);

export default {
  getAllRoles
};
