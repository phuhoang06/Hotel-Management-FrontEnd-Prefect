import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Typography, Alert } from '@mui/material';
import authService from '../../../service/auth.service.js'; // Import authService (thay đường dẫn phù hợp)

function PasswordChangeDialog({ open, onClose }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleClose = () => {
        resetForm();
        if (onClose) onClose();
    };

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess(false);
    };

    const handleSubmit = async () => {
        // Kiểm tra các trường bắt buộc
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Vui lòng điền đầy đủ tất cả các trường');
            return;
        }

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
            return;
        }

        // Kiểm tra độ dài mật khẩu mới
        if (newPassword.length < 8) {
            setError('Mật khẩu mới phải có ít nhất 8 ký tự');
            return;
        }

        try {
            // Gọi API đổi mật khẩu từ authService với payload phù hợp với backend DTO
            const response = await authService.changePassword({
                oldPassword: currentPassword,
                newPassword: newPassword,
                confirmNewPassword: confirmPassword
            });

            if (response.success) {
                setSuccess(true);
                setError('');
                console.log('Đổi mật khẩu thành công:', response.message);

                // Tự động đóng dialog sau 2 giây
                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else {
                setError(response.message || 'Đổi mật khẩu không thành công');
            }
        } catch (error) {
            setError(error.message || 'Lỗi khi đổi mật khẩu. Vui lòng thử lại.');
            console.error('Error changing password:', error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Typography variant="h6" component="div" align="center">
                    Đổi Mật Khẩu
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Để đổi mật khẩu, vui lòng nhập mật khẩu hiện tại của bạn và mật khẩu mới.
                </DialogContentText>
                <Box sx={{ mt: 2 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Đổi mật khẩu thành công!
                        </Alert>
                    )}
                    <TextField
                        margin="dense"
                        label="Mật khẩu hiện tại"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Mật khẩu mới"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        helperText="Mật khẩu phải có ít nhất 8 ký tự"
                    />
                    <TextField
                        margin="dense"
                        label="Xác nhận mật khẩu mới"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        error={confirmPassword !== '' && newPassword !== confirmPassword}
                        helperText={
                            confirmPassword !== '' && newPassword !== confirmPassword
                                ? 'Mật khẩu không khớp'
                                : ''
                        }
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleClose} color="primary" variant="outlined">
                    Hủy
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PasswordChangeDialog;