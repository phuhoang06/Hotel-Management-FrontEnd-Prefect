import { axiosInstance } from '../configs/axios.config';

/**
 * Dịch vụ xử lý các chức năng liên quan đến checkout
 */
class CheckoutService {
  /**
   * Thực hiện API checkout (trả phòng)
   * @param {Object} checkoutData Dữ liệu checkout bao gồm roomId, bookingId, isClean
   * @returns {Promise} Kết quả từ API
   */
  checkout(checkoutData) {
    return axiosInstance.post(`/checkouts`, checkoutData);
  }

  /**
   * Lấy thông tin chi phí của một booking
   * @param {number} bookingId ID của booking cần tính chi phí
   * @returns {Promise} Thông tin chi phí
   */
  getFee(bookingId) {
    return axiosInstance.get(`/checkouts/${bookingId}/fee`);
  }

  /**
   * Lấy thông tin hóa đơn của một booking
   * @param {number} bookingId ID của booking cần lấy hóa đơn
   * @returns {Promise} Thông tin hóa đơn
   */
  getInvoice(bookingId) {
    return axiosInstance.get(`/checkouts/${bookingId}/invoice`);
  }

  /**
   * Lấy danh sách phòng sắp phải checkout
   * @param {number} minutesThreshold Ngưỡng thời gian tính bằng phút
   * @returns {Promise} Danh sách phòng sắp phải checkout
   */
  getRoomsDueSoon(minutesThreshold = 30) {
    return axiosInstance.get(`/checkouts/due-soon?minutesThreshold=${minutesThreshold}`);
  }
}

export default new CheckoutService(); 