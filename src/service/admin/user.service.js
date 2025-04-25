import { axiosInstance } from "../../configs/axios.config.js";

class UserService {
    static async updateAccountLockStatus(eId, locked) {
        return await axiosInstance.put(`/users/${eId}/lock-account`, {
            locked: locked
        });
    }

    static async getByIdLock(id){
        return await axiosInstance.get(`users/${id}`);
    }
}

export default UserService;