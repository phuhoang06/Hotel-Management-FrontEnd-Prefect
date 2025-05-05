import { axiosInstance } from '../configs/axios.config';

/**
 * Service for handling check-in related API calls
 */
class CheckinService {
  /**
   * Create a walk-in booking (for guests arriving without prior reservation)
   * 
   * @param {Object} walkInData - The booking data
   * @param {number} walkInData.customerId - ID of the customer in the system
   * @param {string} walkInData.note - Optional note for the booking
   * @param {number} walkInData.paidAmount - Amount already paid (default: 0)
   * @param {Array} walkInData.rooms - Array of room booking requests
   * @returns {Promise} - Promise containing the booking response
   */
  async createWalkInBooking(walkInData) {
    try {
      const response = await axiosInstance.post('/checkins/walkin', walkInData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get available rooms for booking based on check-in time and rent type
   * 
   * @param {Object} params - Search parameters
   * @param {string} params.checkinTime - Check-in time (ISO format)
   * @param {string} params.checkoutTime - Check-out time (ISO format, optional)
   * @param {string} params.rentType - Rent type (HOURLY, DAILY, OVERNIGHT)
   * @param {number} params.duration - Duration of stay (optional)
   * @param {number} params.categoryId - Room category ID (optional)
   * @param {number} params.floor - Floor number (optional)
   * @returns {Promise} - Promise containing available rooms
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
   * Get room categories
   * 
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 10)
   * @param {string} params.status - Filter by status (ACTIVE, INACTIVE)
   * @returns {Promise} - Promise containing room categories
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
   * Search customers by name, phone, or ID card
   * 
   * @param {string} keyword - Search keyword (name, phone, or ID card)
   * @param {Object} params - Additional params
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 10)
   * @returns {Promise} - Promise containing customer search results
   */
  async searchCustomers(keyword, params = {}) {
    try {
      const searchParams = { 
        ...params,
        keyword 
      };
      const response = await axiosInstance.get('/customers', { params: searchParams });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get customer by ID
   * 
   * @param {number} id - The customer ID
   * @returns {Promise} - Promise containing customer data
   */
  async getCustomerById(id) {
    try {
      const response = await axiosInstance.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Create a new customer
   * 
   * @param {Object} customerData - The customer data
   * @returns {Promise} - Promise containing the created customer
   */
  async createCustomer(customerData) {
    try {
      const response = await axiosInstance.post('/customers', customerData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get all rooms with filter options
   * 
   * @param {Object} params - Query parameters
   * @param {string} params.keyword - Search keyword (optional)
   * @param {string} params.status - Filter by room status (AVAILABLE, IN_USE, etc.) (optional)
   * @param {number} params.floor - Filter by floor (optional)
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 10)
   * @returns {Promise} - Promise containing rooms data
   */
  async getRooms(params = {}) {
    try {
      const response = await axiosInstance.get('/rooms', { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Calculate price for a room
   * 
   * @param {Object} priceParams - Price calculation parameters
   * @param {number} priceParams.roomCategoryId - Room category ID
   * @param {string} priceParams.rentType - Rent type (HOURLY, DAILY, OVERNIGHT)
   * @param {number} priceParams.duration - Duration of stay
   * @param {number} priceParams.adultCount - Number of adults
   * @param {number} priceParams.childCount - Number of children
   * @param {string} priceParams.checkinTime - Check-in time (ISO format)
   * @returns {Promise} - Promise containing price calculation
   */
  async calculateRoomPrice(priceParams) {
    try {
      const response = await axiosInstance.post('/rooms/calculate-price', priceParams);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get booking by ID
   * 
   * @param {number} bookingId - The booking ID
   * @returns {Promise} - Promise containing booking data
   */
  async getBookingById(bookingId) {
    try {
      const response = await axiosInstance.get(`/bookings/${bookingId}`);
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
   * @param {string} statusData.status - New room status
   * @returns {Promise} - Promise containing updated room data
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
   * Get guest registration details by booking ID
   * 
   * @param {number} bookingId - The booking ID
   * @returns {Promise} - Promise containing guest registration details
   */
  async getGuestRegistrationsByBooking(bookingId) {
    try {
      const response = await axiosInstance.get(`/guest-registrations/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Register a guest for a booking
   * 
   * @param {Object} guestData - The guest registration data
   * @returns {Promise} - Promise containing the registration response
   */
  async registerGuest(guestData) {
    try {
      const response = await axiosInstance.post('/guest-registrations', guestData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Check if the number of guests is valid for a room
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

export default new CheckinService(); 