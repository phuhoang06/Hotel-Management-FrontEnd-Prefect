import { axiosInstance } from "../../configs/axios.config.js";

class UserService {
    static async updateAccountLockStatus(eId, locked) {
        return await axiosInstance.put(`/users/${eId}/lock-account`, {
            locked: locked
        });
    }
}

export default UserService;