import { axiosInstance } from '../configs/axios.config'; // Đảm bảo đường dẫn này đúng

/**
 * Dịch vụ xử lý các chức năng liên quan đến checkout
 */
class CheckoutService {
  /**
   * Thực hiện API checkout (trả phòng)
   * @param {Object} checkoutData Dữ liệu checkout bao gồm roomId, bookingId, isClean
   * @returns {Promise} Kết quả từ API
   */
  async checkout(checkoutData) {
    console.log('=== CHECKOUT SERVICE CALLED ===');
    console.log('Checkout data received:', JSON.stringify(checkoutData, null, 2));
    if (!checkoutData || !checkoutData.bookingId) {
      console.error('Invalid checkout data: Missing bookingId');
      throw new Error('Missing required bookingId for checkout');
    }
    if (!checkoutData.roomId) {
      console.error('Invalid checkout data: Missing roomId');
      throw new Error('Missing required roomId for checkout');
    }

    try {
      const response = await axiosInstance.post('/checkouts', checkoutData);
      console.log('API response received:', JSON.stringify(response.data, null, 2));

      if (response.data && response.data.status === 'error') {
        console.error('API returned error status:', response.data.message);
        throw new Error(response.data.message || 'Checkout failed due to API error status');
      }
      console.log('Checkout successful:', response.data?.message);
      return response.data;
    } catch (error) {
      console.error('Checkout service error:', error);
      if (error.response) {
        console.error('Response error data:', JSON.stringify(error.response.data, null, 2));
        console.error('Response status:', error.response.status);
        throw new Error(error.response.data?.message || error.message || 'Network error during checkout');
      }
      // Nếu lỗi không phải từ response (vd: lỗi mạng client-side, lỗi trong logic trước request)
      throw error;
    }
  }

  /**
   * Lấy thông tin chi phí của một booking
   * @param {string|number} bookingId ID của booking cần tính chi phí
   * @returns {Promise} Thông tin chi phí
   */
  async getFee(bookingId) {
    if (!bookingId) {
      console.error('Error getting fee: bookingId is required.');
      throw new Error('Booking ID is required to get fee.');
    }
    try {
      const response = await axiosInstance.get(`/checkouts/${bookingId}/fee`);
      return response.data;
    } catch (error) {
      console.error(`Error getting fee for booking ${bookingId}:`, error);
      throw error;
    }
  }

  /**
   * Lấy thông tin hóa đơn của một booking
   * @param {string|number} bookingId ID của booking cần lấy hóa đơn
   * @returns {Promise} Thông tin hóa đơn
   */
  async getInvoice(bookingId) {
    if (!bookingId) {
      console.error('Error getting invoice: bookingId is required.');
      throw new Error('Booking ID is required to get invoice.');
    }
    try {
      const response = await axiosInstance.get(`/checkouts/${bookingId}/invoice`);
      return response.data;
    } catch (error) {
      console.error(`Error getting invoice for booking ${bookingId}:`, error);
      throw error;
    }
  }

  /**
   * Lấy danh sách phòng sắp phải checkout
   * @param {number} minutesThreshold Ngưỡng thời gian tính bằng phút
   * @returns {Promise} Danh sách phòng sắp phải checkout
   */
  async getRoomsDueSoon(minutesThreshold = 30) {
    try {
      const response = await axiosInstance.get(`/checkouts/due-soon?minutesThreshold=${minutesThreshold}`);
      return response.data;
    } catch (error) {
      console.error('Error getting rooms due soon:', error);
      throw error;
    }
  }
}

export default new CheckoutService();