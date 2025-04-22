import { useState, useEffect } from 'react';
import authService from '../service/auth.service';

/**
 * Hook để kiểm tra quyền của người dùng hiện tại
 * @returns {Object} Các phương thức và state cho phân quyền
 */
export default function usePermission() {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lấy quyền và vai trò từ localStorage khi component mount
    const loadPermissions = () => {
      try {
        const perms = authService.getPermissions();
        const userRoles = authService.getRoles();
        setPermissions(perms);
        setRoles(userRoles);
        
        // Kiểm tra nếu là admin (có SYSTEM_ADMIN hoặc ROLE_ADMIN)
        setIsAdmin(
          perms.includes('SYSTEM_ADMIN') || 
          userRoles.includes('ROLE_ADMIN')
        );
      } catch (error) {
        console.error('Error loading permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPermissions();

    // Thêm listener để cập nhật khi localStorage thay đổi
    const handleStorageChange = () => {
      loadPermissions();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  /**
   * Kiểm tra xem người dùng có quyền cụ thể không
   * @param {string|string[]} requiredPermissions - Quyền cần kiểm tra
   * @param {boolean} requireAll - Yêu cầu tất cả quyền (true) hoặc chỉ một quyền (false)
   * @returns {boolean} Kết quả kiểm tra quyền
   */
  const hasPermission = (requiredPermissions, requireAll = false) => {
    // Nếu là admin hệ thống, luôn trả về true
    if (isAdmin) return true;

    // Nếu không có quyền nào được yêu cầu
    if (!requiredPermissions) return true;

    // Chuyển đơn quyền thành mảng
    const permList = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

    // Nếu không có quyền nào được yêu cầu sau khi chuyển đổi
    if (permList.length === 0) return true;

    if (requireAll) {
      // Người dùng phải có TẤT CẢ quyền
      return permList.every(perm => authService.hasPermission(perm));
    } else {
      // Người dùng chỉ cần có MỘT trong các quyền
      return permList.some(perm => authService.hasPermission(perm));
    }
  };

  /**
   * Kiểm tra xem người dùng có vai trò cụ thể không
   * @param {string|string[]} requiredRoles - Vai trò cần kiểm tra
   * @param {boolean} requireAll - Yêu cầu tất cả vai trò (true) hoặc chỉ một vai trò (false)
   * @returns {boolean} Kết quả kiểm tra vai trò
   */
  const hasRole = (requiredRoles, requireAll = false) => {
    // QUAN TRỌNG: KHÔNG tự động cho phép admin truy cập mọi vai trò
    // Nếu không có vai trò nào được yêu cầu
    if (!requiredRoles) return true;

    // Chuyển đơn vai trò thành mảng
    const roleList = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    // Nếu không có vai trò nào được yêu cầu sau khi chuyển đổi
    if (roleList.length === 0) return true;

    console.log('Kiểm tra vai trò:', roleList, 'Người dùng có vai trò:', roles);

    if (requireAll) {
      // Người dùng phải có TẤT CẢ vai trò
      return roleList.every(role => roles.includes(role));
    } else {
      // Người dùng chỉ cần có MỘT trong các vai trò
      return roleList.some(role => roles.includes(role));
    }
  };

  /**
   * Tải lại quyền từ server
   * @returns {Promise} Promise chứa kết quả tải quyền
   */
  const refreshPermissions = async () => {
    setIsLoading(true);
    try {
      await authService.fetchUserPermissions();
      const perms = authService.getPermissions();
      const userRoles = authService.getRoles();
      setPermissions(perms);
      setRoles(userRoles);
      setIsAdmin(
        perms.includes('SYSTEM_ADMIN') || 
        userRoles.includes('ROLE_ADMIN')
      );
      return { success: true };
    } catch (error) {
      console.error('Error refreshing permissions:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    permissions,
    roles,
    isAdmin,
    isLoading,
    hasPermission,
    hasRole,
    refreshPermissions
  };
} 