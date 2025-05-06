import { axiosInstance } from '../configs/axios.config';

/**
 * Service for handling room booking with detailed information
 */
class RoomBookingService {
  /**
   * Get all rooms with booking details
   * 
   * @param {Object} params - Query parameters
   * @param {string} params.keyword - Search keyword (optional)
   * @param {string} params.status - Filter by room status (AVAILABLE, IN_USE, ...) (optional)
   * @param {number} params.floor - Filter by floor (optional)
   * @param {number} params.categoryId - Filter by room category ID (optional)
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 10)
   * @param {string} params.sort - Sort field and direction (e.g., "id,asc")
   * @returns {Promise} - Promise containing rooms data with booking details
   */
  async getAllRoomsWithBookingDetails(params = {}) {
    try {
      const response = await axiosInstance.get('/rooms/with-booking-details', { params });
      // Transform the data to match the old API format
      const transformedData = {
        content: this.transformRoomsData(response.data)
      };
      return transformedData;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get room with booking details by ID
   * 
   * @param {number} roomId - The room ID
   * @returns {Promise} - Promise containing room data with booking details
   */
  async getRoomWithBookingDetailsById(roomId) {
    try {
      const response = await axiosInstance.get(`/rooms/with-booking-details/${roomId}`);
      // Transform the data to match the old API format
      const transformedData = this.transformRoomData(response.data);
      return transformedData;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Search rooms with booking details
   * 
   * @param {Object} params - Search parameters
   * @param {string} params.keyword - Search keyword (optional)
   * @param {string} params.status - Filter by room status (optional)
   * @param {number} params.floor - Filter by floor (optional)
   * @param {number} params.categoryId - Filter by category ID (optional)
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 10)
   * @returns {Promise} - Promise containing rooms data with booking details
   */
  async searchRoomsWithBookingDetails(params = {}) {
    try {
      const response = await axiosInstance.get('/rooms/with-booking-details/search', { params });
      // Transform the data to match the old API format
      const transformedData = {
        content: this.transformRoomsData(response.data)
      };
      return transformedData;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Update room clean status
   * 
   * @param {number} roomId - The room ID
   * @param {boolean} isClean - Whether the room is clean or not
   * @returns {Promise} - Promise containing updated room data
   */
  async updateRoomCleanStatus(roomId, isClean) {
    try {
      const response = await axiosInstance.patch(`/rooms/${roomId}/is_clean`, { isClean });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Transform room data from new API format to old API format
   * 
   * @param {Object} room - Room data in new API format
   * @returns {Object} - Room data in old API format for UI compatibility
   */
  transformRoomData(room) {
    if (!room) return null;

    // Estimate room category prices from bookings if available
    const estimatedPrices = this.estimatePrices(room);

    // Create a compatible room object that matches the old structure
    return {
      id: room.id,
      status: room.status,
      isClean: room.isClean,
      note: room.note,
      floor: room.floor,
      startDate: room.startDate,
      checkInDuration: room.checkInDuration,
      // Transform roomCategoryName into roomCategory object
      roomCategory: {
        name: room.roomCategoryName,
        code: `P${room.id.toString().padStart(3, '0')}`,
        description: room.note || 'Phòng tiêu chuẩn',
        dailyPrice: estimatedPrices.dailyPrice,
        hourlyPrice: estimatedPrices.hourlyPrice,
        overnightPrice: estimatedPrices.overnightPrice
      },
      // Add additional booking information from new API
      bookings: room.bookings || [],
      hasUpcomingBookings: room.bookings && room.bookings.length > 0
    };
  }

  /**
   * Transform an array of room data from new API format to old API format
   * 
   * @param {Array} rooms - Array of room data in new API format
   * @returns {Array} - Array of room data in old API format
   */
  transformRoomsData(rooms) {
    if (!Array.isArray(rooms)) return [];
    return rooms.map(room => this.transformRoomData(room));
  }

  /**
   * Estimate room prices based on available data
   * This is a fallback when actual prices are not available in the API
   * 
   * @param {Object} room - Room data
   * @returns {Object} - Estimated prices object
   */
  estimatePrices(room) {
    // Default prices for different room categories
    const defaultPrices = {
      'Phòng Deluxe Hướng Vườn': { daily: 1800000, hourly: 300000, overnight: 1200000 },
      'Phòng Standard': { daily: 1200000, hourly: 200000, overnight: 800000 },
      'Phòng Superior': { daily: 1500000, hourly: 250000, overnight: 1000000 },
      'Phòng Suite': { daily: 2500000, hourly: 400000, overnight: 1800000 },
      'Phòng Family': { daily: 2000000, hourly: 350000, overnight: 1500000 }
    };

    // Get default prices for this room category, or use generic default
    const prices = defaultPrices[room.roomCategoryName] || 
                  { daily: 1000000, hourly: 200000, overnight: 800000 };

    return {
      dailyPrice: prices.daily,
      hourlyPrice: prices.hourly,
      overnightPrice: prices.overnight
    };
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

export default new RoomBookingService(); 