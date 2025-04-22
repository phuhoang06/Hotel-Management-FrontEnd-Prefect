import { axiosInstance } from '../configs/axios.config';

const TOKEN_KEY = 'hotel_auth_token';
const USER_INFO_KEY = 'hotel_user_info';
const PERMISSIONS_KEY = 'hotel_user_permissions';

// Permission hierarchy mapping - define parent-child relationships
const PERMISSION_HIERARCHY = {
  'SYSTEM_ADMIN': ['*'], // System admin has all permissions
  'ROLE_ADMIN': ['*'],  // Thêm dòng này
  'ROOM_MANAGEMENT': ['VIEW_ROOM', 'CREATE_ROOM', 'EDIT_ROOM', 'DELETE_ROOM'],
  'EMPLOYEE_MANAGEMENT': ['VIEW_EMPLOYEE', 'CREATE_EMPLOYEE', 'EDIT_EMPLOYEE', 'DELETE_EMPLOYEE'],
  'BOOKING_MANAGEMENT': ['VIEW_BOOKING', 'CREATE_BOOKING', 'EDIT_BOOKING', 'DELETE_BOOKING'],
  'INVOICE_MANAGEMENT': ['VIEW_INVOICE', 'CREATE_INVOICE', 'EDIT_INVOICE', 'DELETE_INVOICE']
};

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

const authService = {
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        usernameOrEmail: username,
        password
      });
      
      const data = response.data;
      
      if (data.success) {
        // Log full response for debugging
        console.log('API response:', data);
        
        // Extract token and user info based on the correct API structure
        const token = data.data.token;
        
        // Save token in localStorage
        setAuthToken(token);
        
        // Extract userInfo from the correct path in the response
        const userInfo = data.data.userInfo;
        
        // Save individual user properties in localStorage for direct access
        if (userInfo) {
          localStorage.setItem('username', userInfo.username || '');
          
          // Handle roles - make sure we can handle both string and array formats
          if (userInfo.roles) {
            const roles = Array.isArray(userInfo.roles) 
              ? userInfo.roles 
              : [userInfo.roles];
            localStorage.setItem('roles', JSON.stringify(roles));
          }
          
          // Also save permissions if they exist in the response
          if (userInfo.permissions) {
            localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(userInfo.permissions));
          } else {
            // If permissions aren't in the login response, fetch them separately
            authService.fetchUserPermissions();
          }
          
          // Also save full user object
          localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
        }
        
        return userInfo;
      } else {
        throw new Error(data.message || 'Đăng nhập không thành công');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.message || error.message || 'Lỗi kết nối đến server';
    }
  },
  
  // Fetch user permissions from server
  fetchUserPermissions: async () => {
    try {
      const response = await axiosInstance.get('/auth/permissions');
      if (response.data && response.data.success) {
        // Cấu trúc response từ API như hướng dẫn: {permissions: [], roles: []}
        const { permissions, roles } = response.data.data || { permissions: [], roles: [] };
        
        // Lưu permissions vào localStorage
        localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions || []));
        
        // Cập nhật roles nếu có sẵn từ API
        if (roles && Array.isArray(roles)) {
          localStorage.setItem('roles', JSON.stringify(roles));
        }
        
        console.log('Permissions loaded:', permissions);
        console.log('Roles loaded:', roles);
        
        return permissions;
      }
      return [];
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }
  },
  
  // Check if user has a specific permission
  hasPermission: (permission) => {
    const permissionsStr = localStorage.getItem(PERMISSIONS_KEY);
    if (!permissionsStr) return false;
    
    try {
      const userPermissions = JSON.parse(permissionsStr);
      
      // Direct permission check
      if (userPermissions.includes(permission)) {
        return true;
      }
      
      // Check for wildcard permission (SYSTEM_ADMIN)
      if (userPermissions.includes('SYSTEM_ADMIN')) {
        return true;
      }
      
      // Check if any of the user's permissions is a parent of the requested permission
      for (const userPermission of userPermissions) {
        if (PERMISSION_HIERARCHY[userPermission] && 
            (PERMISSION_HIERARCHY[userPermission].includes('*') || 
             PERMISSION_HIERARCHY[userPermission].includes(permission))) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  },
  
  // Get all permissions including inherited ones
  getAllPermissions: () => {
    const permissionsStr = localStorage.getItem(PERMISSIONS_KEY);
    if (!permissionsStr) return [];
    
    try {
      const userPermissions = JSON.parse(permissionsStr);
      const allPermissions = [...userPermissions];
      
      // Add inherited permissions
      for (const permission of userPermissions) {
        if (PERMISSION_HIERARCHY[permission]) {
          if (PERMISSION_HIERARCHY[permission].includes('*')) {
            // User has all permissions
            return ['*'];
          }
          
          // Add child permissions
          for (const childPermission of PERMISSION_HIERARCHY[permission]) {
            if (!allPermissions.includes(childPermission)) {
              allPermissions.push(childPermission);
            }
          }
        }
      }
      
      return allPermissions;
    } catch (error) {
      console.error('Error getting all permissions:', error);
      return [];
    }
  },
  
  // Get direct permissions (without inheritance)
  getPermissions: () => {
    const permissionsStr = localStorage.getItem(PERMISSIONS_KEY);
    if (permissionsStr) {
      try {
        return JSON.parse(permissionsStr);
      } catch (error) {
        console.error('Error parsing permissions:', error);
        return [];
      }
    }
    return [];
  },
  
  register: async (username, email, password, confirmPassword) => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        username,
        email,
        password,
        confirmPassword,
        roles: ['ROLE_USER'] // Default role
      });
      
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error) {
      console.error('Register error:', error);
      throw error.response?.data?.message || error.message || 'Lỗi đăng ký tài khoản';
    }
  },
  
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await axiosInstance.post('/auth/change-password', {
        oldPassword,
        newPassword
      });
      
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error) {
      console.error('Change password error:', error);
      throw error.response?.data?.message || error.message || 'Lỗi đổi mật khẩu';
    }
  },
  
  logout: () => {
    // Call logout API endpoint if required by backend
    axiosInstance.post('/auth/logout')
      .catch(error => console.error('Logout error:', error))
      .finally(() => {
        // Clear token and user info from localStorage
        setAuthToken(null);
        localStorage.removeItem(USER_INFO_KEY);
        localStorage.removeItem(PERMISSIONS_KEY);
        localStorage.removeItem('username');
        localStorage.removeItem('roles');
      });
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem(USER_INFO_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  },
  
  getUserRole: () => {
    // Try to get from direct roles item first
    const rolesStr = localStorage.getItem('roles');
    if (rolesStr) {
      try {
        const roles = JSON.parse(rolesStr);
        return roles[0] || null;
      } catch (error) {
        console.error('Error parsing roles:', error);
      }
    }
    
    // Fall back to user object
    const user = authService.getCurrentUser();
    return user && user.roles ? user.roles[0] : null;
  },
  
  getRoles: () => {
    const rolesStr = localStorage.getItem('roles');
    if (rolesStr) {
      try {
        return JSON.parse(rolesStr);
      } catch (error) {
        console.error('Error parsing roles:', error);
        return [];
      }
    }
    return [];
  },
  
  hasRole: (role) => {
    // Try to get from direct roles item first
    const rolesStr = localStorage.getItem('roles');
    if (rolesStr) {
      try {
        const roles = JSON.parse(rolesStr);
        return roles.includes(role);
      } catch (error) {
        console.error('Error parsing roles:', error);
      }
    }
    
    // Fall back to user object
    const user = authService.getCurrentUser();
    return user && user.roles && user.roles.includes(role);
  },
  
  hasAnyRole: (roleList) => {
    const roles = authService.getRoles();
    return roleList.some(role => roles.includes(role));
  },
  
  canAccessAdminPage: () => {
    return authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_MANAGER']);
  },
  
  canAccessEmployeePage: () => {
    return authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_RECEPTIONIST', 'ROLE_VIEWER']);
  },
  
  // Initialize authentication state from localStorage on app load
  initAuth: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      setAuthToken(token);
      return true;
    }
    return false;
  }
};

export default authService; 