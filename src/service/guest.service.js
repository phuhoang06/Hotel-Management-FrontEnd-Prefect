import { axiosInstance } from '../configs/axios.config';

/**
 * Service for handling guest and customer related API calls
 */
class GuestService {
  /**
   * Create a new customer
   * 
   * @param {Object} customerData - The customer data
   * @param {string} customerData.fullName - Full name of the customer (required)
   * @param {string} customerData.phone - Phone number (required)
   * @param {string} customerData.email - Email address
   * @param {string} customerData.gender - Gender (MALE, FEMALE, OTHER)
   * @param {string} customerData.dob - Date of birth (YYYY-MM-DD)
   * @param {string} customerData.address - Address
   * @param {string} customerData.idCard - ID card number
   * @param {string} customerData.nationality - Nationality
   * @param {string} customerData.note - Additional notes
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
   * Update an existing customer
   * 
   * @param {number} customerId - The customer ID
   * @param {Object} customerData - The customer data to update
   * @returns {Promise} - Promise containing the updated customer
   */
  async updateCustomer(customerId, customerData) {
    try {
      const response = await axiosInstance.put(`/customers/${customerId}`, customerData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get customer by ID
   * 
   * @param {number} customerId - The customer ID
   * @returns {Promise} - Promise containing the customer data
   */
  async getCustomerById(customerId) {
    try {
      const response = await axiosInstance.get(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Search customers by query
   * 
   * @param {string} keyword - Search keyword
   * @param {Object} params - Additional query parameters
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 10)
   * @param {string} params.sort - Sort field and direction (e.g., "id,asc")
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
   * Register a guest for a booking - WARNING: This method might not be supported
   * as the documentation doesn't mention a specific endpoint for guest registrations.
   * 
   * @param {Object} guestData - The guest registration data
   * @returns {Promise} - Promise containing the registration response
   * @deprecated - Consider using performWalkInCheckin or createCustomer instead
   */
  async registerGuest(guestData) {
    console.warn('WARNING: registerGuest method might not be supported by the API. Consider using performWalkInCheckin instead.');
    try {
      // This endpoint might not actually exist according to the documentation
      const response = await axiosInstance.post('/customers', {
        ...guestData,
        // Map guestData fields to customer fields
        fullName: guestData.fullName,
        phone: guestData.phoneNumber,
        gender: guestData.gender,
        dob: guestData.birthDate,
        nationality: guestData.nationality,
        address: guestData.address,
        idCard: guestData.idNumber,
        email: guestData.email,
        note: guestData.notes
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Perform a walk-in check-in
   * 
   * @param {Object} walkInData - The walk-in check-in data
   * @param {number} walkInData.customerId - ID of the customer
   * @param {string} walkInData.note - Optional notes
   * @param {number} walkInData.paidAmount - Amount paid upfront
   * @param {Array} walkInData.rooms - Array of room booking requests
   * @returns {Promise} - Promise containing the booking response
   */
  async performWalkInCheckin(walkInData) {
    try {
      const response = await axiosInstance.post('/checkins/walkin', walkInData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get available rooms
   * 
   * @param {Object} params - Search parameters
   * @param {string} params.status - Room status (e.g., AVAILABLE)
   * @param {string} params.keyword - Search keyword
   * @param {number} params.floor - Floor number
   * @param {number} params.page - Page number
   * @param {number} params.size - Page size
   * @returns {Promise} - Promise containing available rooms list
   */
  async getAvailableRooms(params = {}) {
    try {
      const response = await axiosInstance.get('/rooms', { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get room details
   * 
   * @param {number} roomId - Room ID
   * @returns {Promise} - Promise containing room details
   */
  async getRoomDetails(roomId) {
    try {
      const response = await axiosInstance.get(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Update room status
   * 
   * @param {number} roomId - Room ID
   * @param {string} status - New room status
   * @returns {Promise} - Promise containing update response
   */
  async updateRoomStatus(roomId, status) {
    try {
      const response = await axiosInstance.put(`/rooms/${roomId}/status`, { status });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get all guest registrations - WARNING: This method might not be supported
   * as the documentation doesn't mention a specific endpoint for listing guest registrations.
   * 
   * @param {Object} params - Search parameters
   * @returns {Promise} - Promise containing guest registrations list
   * @deprecated - Consider using other methods from the documentation
   */
  async getAllGuestRegistrations(params = {}) {
    console.warn('WARNING: getAllGuestRegistrations method might not be supported by the API.');
    try {
      // This is a fallback to customers endpoint, which might not provide the expected data
      const response = await axiosInstance.get('/customers', { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get guest registrations by booking ID - WARNING: This method might not be supported
   * as the documentation doesn't mention a specific endpoint for getting guests by booking.
   * 
   * @param {number} bookingId - ID of the booking
   * @returns {Promise} - Promise containing guest registrations for the booking
   * @deprecated - Consider using other methods from the documentation
   */
  async getGuestRegistrationsByBooking(bookingId) {
    console.warn('WARNING: getGuestRegistrationsByBooking method might not be supported by the API.');
    try {
      // This endpoint probably doesn't exist according to the documentation
      throw new Error('API endpoint not available in documentation');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Update a guest registration - WARNING: This method might not be supported
   * as the documentation doesn't mention a specific endpoint for updating guest registrations.
   * 
   * @param {number} registrationId - ID of the registration
   * @param {Object} guestData - Updated guest data
   * @returns {Promise} - Promise containing the updated registration
   * @deprecated - Consider using other methods from the documentation
   */
  async updateGuestRegistration(registrationId, guestData) {
    console.warn('WARNING: updateGuestRegistration method might not be supported by the API.');
    try {
      // This is a fallback to customers endpoint, which might not provide the expected behavior
      const response = await axiosInstance.put(`/customers/${registrationId}`, {
        ...guestData,
        // Map guestData fields to customer fields
        fullName: guestData.fullName,
        phone: guestData.phoneNumber,
        gender: guestData.gender,
        dob: guestData.birthDate,
        nationality: guestData.nationality,
        address: guestData.address,
        idCard: guestData.idNumber,
        email: guestData.email,
        note: guestData.notes
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Delete a guest registration - WARNING: This method might not be supported
   * as the documentation doesn't mention a specific endpoint for deleting guest registrations.
   * 
   * @param {number} registrationId - ID of the registration
   * @returns {Promise} - Promise containing the response
   * @deprecated - Consider using other methods from the documentation
   */
  async deleteGuestRegistration(registrationId) {
    console.warn('WARNING: deleteGuestRegistration method might not be supported by the API.');
    try {
      // This endpoint probably doesn't exist according to the documentation
      throw new Error('API endpoint not available in documentation');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Export guest registrations to file - WARNING: This method might not be supported
   * as the documentation doesn't mention a specific endpoint for exporting guest registrations.
   * 
   * @param {Object} params - Export parameters
   * @returns {Promise} - Promise containing the file data
   * @deprecated - Consider using other methods from the documentation
   */
  async exportGuestRegistrations(params) {
    console.warn('WARNING: exportGuestRegistrations method might not be supported by the API.');
    try {
      // This endpoint probably doesn't exist according to the documentation
      throw new Error('API endpoint not available in documentation');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  /**
   * Get most recently added customers
   * 
   * @param {number} limit - Maximum number of recent customers to return
   * @returns {Promise} - Promise containing recent customers list
   */
  async getRecentCustomers(limit = 10) {
    try {
      const response = await axiosInstance.get('/customers', { 
        params: { 
          sort: 'createdAt,desc', 
          size: limit 
        } 
      });
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

export default new GuestService(); 