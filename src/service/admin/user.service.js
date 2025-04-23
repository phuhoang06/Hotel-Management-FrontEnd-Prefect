import {axiosInstance} from "../../configs/axios.config.js";

class UserService {
    static async lockAccountEmployee(eId) {
        return await axiosInstance.put(`/users/${eId}/lock-account`, {
            locked: true
        });
    }
}

export default UserService;