import { Navigate, Outlet } from 'react-router-dom';
import authService from '../service/auth.service';

/**
 * A component that protects routes based on permissions
 * 
 * @param {object} props
 * @param {string|string[]} props.requiredPermissions - A single permission or array of permissions to check
 * @param {boolean} props.requireAll - Whether the user needs ALL the permissions (true) or ANY of them (false, default)
 * @returns {ReactNode}
 */
const PermissionRoute = ({ requiredPermissions, requireAll = false }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Convert to array if single permission
  const permissionList = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions];
  
  // Default to true if no permissions required
  if (!permissionList.length) {
    return <Outlet />;
  }
  
  // Check permissions
  const hasPermission = requireAll
    ? permissionList.every(permission => authService.hasPermission(permission))
    : permissionList.some(permission => authService.hasPermission(permission));
  
  // If doesn't have permission, redirect to forbidden page
  if (!hasPermission) {
    return <Navigate to="/forbidden" replace />;
  }

  // If authenticated and has permission, render children
  return <Outlet />;
};

export default PermissionRoute; 