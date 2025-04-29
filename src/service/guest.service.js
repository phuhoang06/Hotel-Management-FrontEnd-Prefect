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
   * Register a guest for a booking
   * 
   * @param {Object} guestData - The guest registration data
   * @param {number} guestData.bookingId - ID of the booking
   * @param {string} guestData.fullName - Full name of the guest
   * @param {string} guestData.gender - Gender (MALE, FEMALE, OTHER)
   * @param {string} guestData.birthDate - Date of birth (YYYY-MM-DD)
   * @param {string} guestData.phoneNumber - Phone number
   * @param {string} guestData.nationality - Nationality
   * @param {string} guestData.address - Address
   * @param {string} guestData.idType - ID type (CMND, CCCD, PASSPORT)
   * @param {string} guestData.idNumber - ID number
   * @param {string} guestData.email - Email address
   * @param {string} guestData.notes - Additional notes
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
   * Get all guest registrations
   * 
   * @param {Object} params - Search parameters
   * @param {string} params.khaiBaoStartDate - Registration start date (ISO format)
   * @param {string} params.khaiBaoEndDate - Registration end date (ISO format)
   * @param {string} params.luuTruStartDate - Stay start date (ISO format)
   * @param {string} params.luuTruEndDate - Stay end date (ISO format)
   * @param {string} params.searchText - Search text for name, room, or booking
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 10)
   * @returns {Promise} - Promise containing guest registrations list
   */
  async getAllGuestRegistrations(params = {}) {
    try {
      const response = await axiosInstance.get('/guest-registrations', { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get guest registrations by booking ID
   * 
   * @param {number} bookingId - ID of the booking
   * @returns {Promise} - Promise containing guest registrations for the booking
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
   * Update a guest registration
   * 
   * @param {number} registrationId - ID of the registration
   * @param {Object} guestData - Updated guest data
   * @returns {Promise} - Promise containing the updated registration
   */
  async updateGuestRegistration(registrationId, guestData) {
    try {
      const response = await axiosInstance.put(`/guest-registrations/${registrationId}`, guestData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Delete a guest registration
   * 
   * @param {number} registrationId - ID of the registration
   * @returns {Promise} - Promise containing the response
   */
  async deleteGuestRegistration(registrationId) {
    try {
      const response = await axiosInstance.delete(`/guest-registrations/${registrationId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Export guest registrations to file
   * 
   * @param {Object} params - Export parameters
   * @param {string} params.startDate - Start date (ISO format)
   * @param {string} params.endDate - End date (ISO format)
   * @returns {Promise} - Promise containing the file data
   */
  async exportGuestRegistrations(params) {
    try {
      const response = await axiosInstance.get('/guest-registrations/export', { 
        params,
        responseType: 'blob' 
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