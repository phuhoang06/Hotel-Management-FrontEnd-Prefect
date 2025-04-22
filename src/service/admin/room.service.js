import {axiosInstance} from "../../configs/axios.config.js";

class RoomViewService {
    /**
     * Lấy tất cả phòng
     */
    static async getAllRoomView(page = 0, size = 10) {
        return await axiosInstance.get(`/rooms?page=${page}&size=${size}`);
    }

    /**
     * Tìm kiếm phòng theo điều kiện
     * @param {Object} params - Các tham số tìm kiếm
     * @param {string} params.keyword - Từ khóa tìm kiếm (số phòng, tầng)
     * @param {string} params.status - Trạng thái phòng (AVAILABLE, IN_USE, CHECKOUT_SOON, MAINTENANCE)
     * @param {string} params.floor - Tầng
     * @param {number} params.page - Số trang (mặc định là 0)
     * @param {number} params.size - Kích thước trang (mặc định là 10)
     */
    static async searchRoomView({ keyword = "", status = "", floor = "", page = 0, size = 10 }) {
        let query = `/rooms/search?page=${page}&size=${size}`;
        
        if (keyword) query += `&keyword=${encodeURIComponent(keyword)}`;
        if (status) query += `&status=${status}`;
        if (floor) query += `&floor=${floor}`;
        
        return await axiosInstance.get(query);
    }

    /**
     * Lấy chi tiết phòng theo ID
     */
    static async getRoomById(id) {
        return await axiosInstance.get(`/rooms/${id}`);
    }

    /**
     * Thêm phòng mới
     */
    static async addRoom(roomData) {
        return await axiosInstance.post('/rooms', roomData);
    }

    /**
     * Cập nhật thông tin phòng
     */
    static async updateRoom(id, roomData) {
        return await axiosInstance.put(`/rooms/${id}`, roomData);
    }

    /**
     * Xóa phòng
     */
    static async deleteRoom(id) {
        return await axiosInstance.delete(`/rooms/${id}`);
    }

    /**
     * Lấy danh sách loại phòng
     */
    static async getRoomCategories() {
        return await axiosInstance.get('/room-categories');
    }
    
    /**
     * Cập nhật trạng thái phòng
     */
    static async updateRoomStatus(id, status, isClean) {
        return await axiosInstance.patch(`/rooms/${id}/status`, { status, isClean });
    }
}

export default RoomViewService;