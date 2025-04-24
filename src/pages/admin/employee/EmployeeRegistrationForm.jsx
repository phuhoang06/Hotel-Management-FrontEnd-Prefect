import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Box,
    Typography,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    PersonOutline,
    Email,
    VpnKey
} from '@mui/icons-material';
import roleService from '../../../service/admin/role.service.js';
import authService from '../../../service/auth.service';

function RegistrationDialog({ open, onClose }) {
    // Form data states
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    });

    // Error states
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
    });

    // Password visibility states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Success notification state
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Roles state
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoadingRoles(true);
                roleService.getAllRoles()
                    .then(response => {
                        const apiData = response.data?.content || response.data?.data || response.data;
                        if (Array.isArray(apiData)) {
                            setRoles(apiData.map(role => ({
                                value: role.id,
                                label: role.name
                            })));
                        } else {
                            console.error('Dữ liệu roles không hợp lệ:', apiData);
                        }
                    })
                    .catch(error => console.error('Lỗi tải roles:', error));
            } catch (error) {
                console.error('Lỗi khi tải vai trò:', error);
            } finally {
                setLoadingRoles(false);
            }
        };

        fetchRoles();
    }, []);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // Toggle password visibility
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Toggle confirm password visibility
    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Form validation
    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        // Validate username
        if (!formData.username.trim()) {
            newErrors.username = 'Vui lòng nhập tên người dùng';
            isValid = false;
        } else if (formData.username.length < 3) {
            newErrors.username = 'Tên người dùng phải có ít nhất 3 ký tự';
            isValid = false;
        }

        // Validate email
        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
            isValid = false;
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            isValid = false;
        }

        // Validate confirmPassword
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            isValid = false;
        }

        // Validate role
        if (!formData.role) {
            newErrors.role = 'Vui lòng chọn vai trò';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                // Find the selected role object to get the name
                const selectedRole = roles.find(r => r.value === formData.role);
                let roleName = selectedRole ? selectedRole.label : null;

                if (!roleName) {
                    setSnackbar({ open: true, message: 'Lỗi: Không tìm thấy vai trò đã chọn.', severity: 'error' });
                    return;
                }

                // Add ROLE_ prefix if not already present
                if (!roleName.startsWith('ROLE_')) {
                    roleName = `ROLE_${roleName}`;
                }

                // Format roles as an array of objects as required by the API
                const rolesPayload = [{ name: roleName }];

                // Call the register endpoint with the correct payload structure
                const response = await authService.register(
                    formData.username,
                    formData.email,
                    formData.password,
                    formData.confirmPassword,
                    rolesPayload
                );

                if (response.success) {
                    setSnackbar({ open: true, message: response.message || 'Đăng ký thành công!', severity: 'success' });
                    onClose();
                    resetForm();
                } else {
                    setSnackbar({ open: true, message: response.message || 'Lỗi đăng ký không xác định', severity: 'error' });
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || 'Lỗi kết nối hoặc đăng ký không thành công';
                setSnackbar({ open: true, message: errorMessage, severity: 'error' });
            }
        }
    };

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: ''
        });
    };

    // Handle close success notification
    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ open: false, message: '', severity: 'success' });
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontSize: 24, textAlign: 'center', pt: 3 }}>
                    Đăng Ký Tài Khoản
                </DialogTitle>

                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Vui lòng điền đầy đủ thông tin để tạo tài khoản mới
                    </DialogContentText>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        {/* Username field */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Tên người dùng"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={!!errors.username}
                            helperText={errors.username}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutline />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Email field */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            xca                            error={!!errors.email}
                            helperText={errors.email}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Password field */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mật khẩu"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VpnKey />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleTogglePassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Confirm Password field */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Xác nhận mật khẩu"
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VpnKey />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleToggleConfirmPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Role selection */}
                        <FormControl
                            fullWidth
                            margin="normal"
                            required
                            error={!!errors.role}
                        >
                            <InputLabel id="role-label">Vai trò</InputLabel>
                            <Select
                                labelId="role-label"
                                id="role"
                                name="role"
                                value={formData.role}
                                label="Vai trò"
                                onChange={handleChange}
                            >
                                {loadingRoles ? (
                                    <MenuItem value="">Đang tải...</MenuItem>
                                ) : (
                                    roles.map((role) => (
                                        <MenuItem key={role.value} value={role.value}>
                                            {role.label}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                            {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                        </FormControl>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={onClose} color="inherit">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                    >
                        Đăng Ký
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSuccess} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}

// App component để sử dụng Dialog
function App() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Mở Dialog Đăng Ký
            </Button>
            <RegistrationDialog open={open} onClose={handleClose} />
        </div>
    );
}

export default App;
export { RegistrationDialog };