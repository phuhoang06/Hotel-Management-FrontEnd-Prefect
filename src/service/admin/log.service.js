import { axiosInstance } from '../../configs/axios.config';

const API_URL = '/activity-logs';

const getAllLogs = () => axiosInstance.get(API_URL);

export default {
  getAllLogs,
};
