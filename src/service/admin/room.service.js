import { axiosInstance } from "../../configs/axios.config.js";

class RoomViewService {
    /**
     * Lấy tất cả phòng
     */
    static async getAllRoomView(page = 0, size = 3) {
        return await axiosInstance.get(`/rooms?page=${page}&size=${size}`);
    }

    /**
     * Tìm kiếm phòng theo điều kiện
     */
    static async searchRoomView({ keyword = "", status = "", floor = "", categoryId = "", page = 0, size = 10 }) {
        let query = `/rooms/search?page=${page}&size=${size}`;
        if (keyword) query += `&keyword=${encodeURIComponent(keyword)}`;
        if (status) query += `&status=${status}`;
        if (floor) query += `&floor=${floor}`;
        if (categoryId) query += `&categoryId=${categoryId}`;
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
    static async addRoom(roomData, images = {}) {
        const formData = new FormData();
        // Gửi room data dưới dạng chuỗi JSON
        formData.append('room', JSON.stringify(roomData));
        // Gửi các file ảnh (nếu có)
        if (images.img1) formData.append('img1', images.img1);
        if (images.img2) formData.append('img2', images.img2);
        if (images.img3) formData.append('img3', images.img3);
        if (images.img4) formData.append('img4', images.img4);

        return await axiosInstance.post('/rooms', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    static async addRoomCategory(roomCategoryData, imageFile) {
        const formData = new FormData();
        formData.append('roomCategory', JSON.stringify(roomCategoryData));
        if (imageFile) {
            formData.append('img', imageFile);
        }
        return await axiosInstance.post('/room-categories', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
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
        return await axiosInstance.delete(`/rooms/${id}/delete`);
    }

    /**
     * Lấy danh sách loại phòng
     */
    static async getRoomCategories() {
        return await axiosInstance.get('/room-categories');
    }

    /**
     * Lấy chi tiết loại phòng theo ID
     */
    static async getRoomCategoryById(id) {
        return await axiosInstance.get(`/room-categories/${id}`);
    }

    /**
     * Tìm kiếm loại phòng theo điều kiện
     */
    static async searchRoomCategories({
                                          keyword = "",
                                          status = "",
                                          minHourlyPrice = "",
                                          maxHourlyPrice = "",
                                          minDailyPrice = "",
                                          maxDailyPrice = "",
                                          minOvernightPrice = "",
                                          maxOvernightPrice = "",
                                          page = 0,
                                          size = 10
                                      }) {
        let query = `/room-categories/search?page=${page}&size=${size}`;
        if (keyword) query += `&keyword=${encodeURIComponent(keyword)}`;
        if (status) query += `&status=${status}`;
        if (minHourlyPrice) query += `&minHourlyPrice=${minHourlyPrice}`;
        if (maxHourlyPrice) query += `&maxHourlyPrice=${maxHourlyPrice}`;
        if (minDailyPrice) query += `&minDailyPrice=${minDailyPrice}`;
        if (maxDailyPrice) query += `&maxDailyPrice=${maxDailyPrice}`;
        if (minOvernightPrice) query += `&minOvernightPrice=${minOvernightPrice}`;
        if (maxOvernightPrice) query += `&maxOvernightPrice=${maxOvernightPrice}`;
        return await axiosInstance.get(query);
    }

    /**
     * Xóa loại phòng
     */
    static async deleteRoomCategory(id) {
        return await axiosInstance.delete(`/room-categories/${id}/delete`);
    }

    /**
     * Cập nhật trạng thái loại phòng (Ngừng kinh doanh)
     * Note: API này hiện chưa có trong backend, cần thêm.
     */
    static async updateRoomCategoryStatus(id, status) {
        return await axiosInstance.patch(`/room-categories/${id}/status`, { status });
    }

    /**
     * Cập nhật trạng thái phòng
     */
    static async updateRoomStatus(id, status, isClean) {
        return await axiosInstance.patch(`/rooms/${id}/status`, { status, isClean });
    }

    /**
     * Cập nhật trạng thái vệ sinh phòng
     */
    static async updateRoomCleanStatus(roomId, isClean) {
        return await axiosInstance.put(`/rooms/${roomId}/clean-status`, { isClean });
    }
}

export default RoomViewService;