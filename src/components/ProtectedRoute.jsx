import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../service/auth.service';
import usePermission from '../hooks/usePermission';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Component Loading tối giản, hiển thị chỉ ở khu vực nội dung, không chiếm toàn màn hình
 */
const InlineLoading = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 4,
      minHeight: 200
    }}
  >
    <CircularProgress size={40} thickness={4} />
    <Typography variant="body2" sx={{ mt: 2 }}>
      Đang tải...
    </Typography>
  </Box>
);

/**
 * Component bảo vệ route yêu cầu xác thực và phân quyền
 * Cải tiến để tránh hiệu ứng tải lại toàn trang
 * @param {Object} props - Props của component
 * @param {React.ReactNode} props.children - Component con cần bảo vệ
 * @param {string|string[]} [props.requiredPermissions] - Quyền yêu cầu để truy cập
 * @param {string|string[]} [props.requiredRoles] - Vai trò yêu cầu để truy cập
 * @param {boolean} [props.requireAll=false] - Yêu cầu tất cả quyền/vai trò thay vì chỉ một
 * @returns {React.ReactNode} Component đã bảo vệ hoặc chuyển hướng
 */
function ProtectedRoute({ 
  children, 
  requiredPermissions,
  requiredRoles,
  requireAll = false
}) {
  const { hasPermission, hasRole, isLoading } = usePermission();
  const [isVerifying, setIsVerifying] = useState(true);
  const location = useLocation();
  
  // Bỏ phần cache để đảm bảo luôn kiểm tra quyền truy cập mới nhất
  useEffect(() => {
    const verifyAccess = async () => {
      try {
        if (!authService.isAuthenticated()) {
          // Chưa đăng nhập
          setIsVerifying(false);
          return;
        }

        // Đã hoàn thành xác minh
        setIsVerifying(false);
      } catch (error) {
        console.error('Error verifying access:', error);
        setIsVerifying(false);
      }
    };

    // Chỉ kiểm tra nếu đã tải xong thông tin quyền hạn
    if (!isLoading) {
      verifyAccess();
    }
  }, [location.pathname, isLoading]);

  // Đang kiểm tra quyền - hiển thị loading nhỏ gọn
  if (isVerifying || isLoading) {
    // Nếu đang tại cùng một route, hiển thị loading nhỏ gọn
    return children ? <InlineLoading /> : <InlineLoading />;
  }

  // Kiểm tra đăng nhập
  if (!authService.isAuthenticated()) {
    console.log('Chưa đăng nhập, chuyển hướng đến trang đăng nhập');
    // Lưu lại đường dẫn hiện tại để sau khi đăng nhập sẽ quay lại
    sessionStorage.setItem('redirectUrl', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền và vai trò trực tiếp, không sử dụng cache
  console.log('Đang kiểm tra quyền truy cập vào:', location.pathname);
  console.log('Yêu cầu vai trò:', requiredRoles);
  console.log('Yêu cầu quyền:', requiredPermissions);
  console.log('Vai trò của người dùng:', authService.getRoles());
  
  // Kiểm tra quyền
  let hasPermissionAccess = true;
  if (requiredPermissions) {
    hasPermissionAccess = hasPermission(requiredPermissions, requireAll);
    console.log('Kết quả kiểm tra quyền:', hasPermissionAccess);
  }
  
  // Kiểm tra vai trò
  let hasRoleAccess = true;
  if (requiredRoles) {
    hasRoleAccess = hasRole(requiredRoles, requireAll);
    console.log('Kết quả kiểm tra vai trò:', hasRoleAccess);
  }
  
  // Chỉ cho phép truy cập nếu cả hai điều kiện đều đạt
  const hasAccess = hasPermissionAccess && hasRoleAccess;
  
  if (!hasAccess) {
    console.log('Từ chối truy cập - chuyển hướng đến trang bị cấm');
    toast.error('Bạn không có quyền truy cập vào trang này');
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }
  
  console.log('Cho phép truy cập vào:', location.pathname);
  return children;
}

export default ProtectedRoute; 