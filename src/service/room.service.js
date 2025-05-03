import { axiosInstance } from '../configs/axios.config';

/**
 * Service for handling room related API calls
 */
class RoomService {
  /**
   * Get all rooms
   * 
   * @param {Object} params - Query parameters
   * @param {string} params.keyword - Search keyword (optional)
   * @param {string} params.status - Filter by room status (AVAILABLE, IN_USE, ...) (optional)
   * @param {number} params.floor - Filter by floor (optional)
   * @param {number} params.categoryId - Filter by room category ID (optional)
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 10)
   * @param {string} params.sort - Sort field and direction (e.g., "id,asc")
   * @returns {Promise} - Promise containing rooms data
   */
  async getAllRooms(params = {}) {
    try {
      const response = await axiosInstance.get('/rooms', { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get room by ID
   * 
   * @param {number} roomId - The room ID
   * @returns {Promise} - Promise containing room data
   */
  async getRoomById(roomId) {
    try {
      const response = await axiosInstance.get(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get available rooms for booking
   * 
   * @param {Object} params - Search parameters
   * @param {string} params.checkinTime - Check-in time (ISO format)
   * @param {string} params.checkoutTime - Check-out time (ISO format, optional)
   * @param {string} params.rentType - Rent type (HOURLY, DAILY, OVERNIGHT)
   * @param {number} params.duration - Duration of stay (optional)
   * @param {number} params.categoryId - Room category ID (optional)
   * @param {number} params.floor - Floor number (optional)
   * @returns {Promise} - Promise containing available rooms data
   */
  async getAvailableRooms(params) {
    try {
      const response = await axiosInstance.get('/rooms/available', { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get all room categories
   * 
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 10)
   * @param {string} params.sort - Sort field and direction (e.g., "id,asc")
   * @param {string} params.status - Filter by status (ACTIVE, INACTIVE) (optional)
   * @returns {Promise} - Promise containing room categories data
   */
  async getRoomCategories(params = {}) {
    try {
      const response = await axiosInstance.get('/room-categories', { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get room category by ID
   * 
   * @param {number} categoryId - The room category ID
   * @returns {Promise} - Promise containing room category data
   */
  async getRoomCategoryById(categoryId) {
    try {
      const response = await axiosInstance.get(`/room-categories/${categoryId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Calculate room price based on room category, rent type, and duration
   * 
   * @param {Object} params - Calculation parameters
   * @param {number} params.roomCategoryId - Room category ID
   * @param {string} params.rentType - Rent type (HOURLY, DAILY, OVERNIGHT)
   * @param {number} params.duration - Duration of stay
   * @param {number} params.adultCount - Number of adults
   * @param {number} params.childCount - Number of children
   * @param {string} params.checkinTime - Check-in time (ISO format)
   * @returns {Promise} - Promise containing price calculation result
   */
  async calculateRoomPrice(params) {
    try {
      const response = await axiosInstance.post('/rooms/calculate-price', params);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Validate guest count for a room
   * 
   * @param {Object} params - Validation parameters
   * @param {number} params.roomId - Room ID
   * @param {number} params.adultCount - Number of adults
   * @param {number} params.childCount - Number of children
   * @returns {Promise} - Promise containing validation result
   */
  async validateGuestCount(params) {
    try {
      const response = await axiosInstance.post('/rooms/validate-guest-count', params);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Update room status
   * 
   * @param {number} roomId - The room ID
   * @param {Object} statusData - Status update data
   * @param {string} statusData.status - New room status (AVAILABLE, IN_USE, MAINTENANCE, etc.)
   * @param {boolean} statusData.isClean - Room cleanliness status (optional)
   * @param {string} statusData.note - Note about the status update (optional)
   * @returns {Promise} - Promise containing the updated room data
   */
  async updateRoomStatus(roomId, statusData) {
    try {
      const response = await axiosInstance.put(`/rooms/${roomId}/status`, statusData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Handle API errors
   * 
   * @param {Error} error - The error object
   * @returns {string} - Error message
   * @throws {Error} - Throws error with proper message
   */
  handleError(error) {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // The request was made and the server responded with an error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data.message || data.status || 'Invalid request data';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again';
          break;
        case 404:
          errorMessage = data.message || data.status || 'Resource not found';
          break;
        case 409:
          errorMessage = data.message || data.status || 'Conflict with current state';
          break;
        case 500:
          errorMessage = data.message || data.status || 'Server error. Please try again later';
          break;
        default:
          errorMessage = data.message || data.status || 'An error occurred';
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your connection';
    }
    
    console.error('API Error:', errorMessage, error);
    return errorMessage;
  }
}

export default new RoomService(); 