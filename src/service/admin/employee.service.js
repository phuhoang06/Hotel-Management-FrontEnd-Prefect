import {axiosInstance} from "../../configs/axios.config.js";

class EmployeeService {
    /**
     * Lấy danh sách nhân viên có phân trang
     * @param {number} page - Số trang (bắt đầu từ 0)
     * @param {number} size - Số lượng nhân viên mỗi trang
     */
    static async getAllEmployee(page = 0, size = 10) {
        return await axiosInstance.get(`/employees?page=${page}&size=${size}`);
    }

    /**
     * Xóa nhân viên theo ID
     * @param {number} id - ID nhân viên 
     */
    static async deleteEmployee(id) {
        return await axiosInstance.delete(`/employees/${id}`);
    }

    /**
     * Lấy thông tin nhân viên theo ID
     * @param {number} id - ID nhân viên
     */
    static async getUserById(id) {
        return await axiosInstance.get(`/employees/${id}`);
    }

    /**
     * Tìm kiếm nhân viên theo tên hoặc các thông tin khác
     * @param {string} keyword - Từ khóa tìm kiếm 
     * @param {number} page - Số trang
     * @param {number} size - Số lượng kết quả mỗi trang
     */
    static async searchEmployees(keyword, page = 0, size = 10) {
        return await axiosInstance.get(`/employees/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
    }

    /**
     * Thêm nhân viên mới
     * @param {Object} employee - Thông tin nhân viên
     */
    static async addEmployee(employee) {
        return await axiosInstance.post(`/employees`, employee);
    }


    static async updateEmployee(id, employee) {
        return await axiosInstance.put(`/employees/${id}`, employee);
    }

    static async getAllUsers() {
        return await axiosInstance.get('api/users');
    }

    /**
     * Lấy danh sách phòng ban
     */
    static async getDepartments() {
        return await axiosInstance.get('/departments');
    }
    

    /**
     * Lấy danh sách chức vụ
     */
    static async getPositions() {
        return await axiosInstance.get('/positions');
    }


}

export default EmployeeService;