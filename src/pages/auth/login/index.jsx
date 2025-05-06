import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper, 
  InputAdornment, 
  IconButton, 
  FormControlLabel, 
  Checkbox,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, Person } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import authService from '../../../service/auth.service';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Kiểm tra xem có URL chuyển hướng trong query params không
  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (authService.isAuthenticated()) {
      const redirectRoles = () => {
        const roles = authService.getRoles();
        if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_MANAGER')) {
          navigate('/admin');
        } else if (roles.includes('ROLE_RECEPTIONIST') || roles.includes('ROLE_VIEWER')) {
          navigate('/employee');
        }
      };
      
      // Kiểm tra nếu có URL chuyển hướng
      const redirectUrl = sessionStorage.getItem('redirectUrl');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectUrl');
        navigate(redirectUrl);
      } else {
        redirectRoles();
      }
    }
    
    // Kiểm tra nếu có thông báo expired trong URL
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('expired') === 'true') {
      setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
  }, [navigate, location]);
  
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      rememberMe: false
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Tên đăng nhập hoặc email là bắt buộc'),
      password: Yup.string().required('Mật khẩu là bắt buộc')
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        
        const user = await authService.login(values.username, values.password);
        
        // Save remember me preference
        if (values.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }
        
        // Lấy quyền và vai trò người dùng từ API
        try {
          console.log("eeeeee")
          await authService.fetchUserPermissions();
          console.log('Permissions and roles loaded successfully');
        } catch (permError) {
          console.error('Error loading permissions:', permError);
          // Vẫn tiếp tục đăng nhập ngay cả khi không lấy được quyền
        }
        
        toast.success('Đăng nhập thành công!');
        
        // Kiểm tra nếu có redirect URL trong sessionStorage
        const redirectUrl = sessionStorage.getItem('redirectUrl');
        if (redirectUrl) {
          sessionStorage.removeItem('redirectUrl');
          navigate(redirectUrl);
          return;
        }
        
        // Lấy vai trò từ localStorage để điều hướng
        const rolesStr = localStorage.getItem('roles');
        let roles = [];
        
        if (rolesStr) {
          try {
            roles = JSON.parse(rolesStr);
          } catch (e) {
            console.error('Error parsing roles:', e);
          }
        }
        
        // Điều hướng dựa trên vai trò người dùng
        // ROLE_ADMIN và ROLE_MANAGER có thể truy cập /admin
        if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_MANAGER')) {
          navigate('/admin');
        } 
        // ROLE_RECEPTIONIST và ROLE_VIEWER chỉ có thể truy cập /employee
        else if (roles.includes('ROLE_RECEPTIONIST') || roles.includes('ROLE_VIEWER')) {
          navigate('/employee');
        } 
        // Fallback mặc định nếu quyền không được đặt đúng
        else {
          // Kiểm tra quyền thay vì vai trò (dự phòng)
          const permissions = authService.getPermissions();
          if (permissions.some(p => p.startsWith('ROOM_') || p.startsWith('EMPLOYEE_'))) {
            navigate('/admin');
          } else {
          toast.warning('Không xác định được quyền truy cập, chuyển đến trang nhân viên');
          navigate('/employee');
          }
        }
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Đăng nhập không thành công. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
        console.error('Login error:', err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={6}
        sx={{ 
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: '15px'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
          Đăng nhập
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2, mt: 1 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%', mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            name="username"
            label="Tên đăng nhập hoặc Email"
            autoComplete="username email"
            autoFocus
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
            sx={{ borderRadius: '5px' }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ borderRadius: '5px' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox 
                  name="rememberMe" 
                  color="primary" 
                  checked={formik.values.rememberMe}
                  onChange={formik.handleChange}
                />
              }
              label="Ghi nhớ đăng nhập"
              sx={{ '& .MuiTypography-root': { fontSize: '0.9rem' } }}
            />
            <Typography 
              variant="body2" 
              color="primary" 
              sx={{ cursor: 'pointer', fontSize: '0.9rem' }}
              onClick={() => {/* Add forgot password handler */}}
            >
              Quên mật khẩu?
            </Typography>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2, 
              p: 1.5,
              fontSize: '1rem',
              borderRadius: '10px',
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Đăng nhập'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage; 