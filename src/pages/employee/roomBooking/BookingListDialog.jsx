import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog as ConfirmDialog,
    DialogTitle as ConfirmDialogTitle,
    DialogContent as ConfirmDialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckinService from '../../../service/checkin.service.js';
import RoomBookingService from '../../../service/roomBooking.service.js';

const BookingListDialog = ({ open, onClose, roomData, bookings = [], updateRoomData }) => {
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notification, setNotification] = useState({ message: '', severity: 'success' });
    const [bookingsList, setBookingsList] = useState(bookings);
    const [resultDialogOpen, setResultDialogOpen] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [resultStatus, setResultStatus] = useState('success');

    // Đồng bộ danh sách booking khi props thay đổi
    useEffect(() => {
        console.log('Props bookings updated:', bookings);
        setBookingsList(bookings);
    }, [bookings]);

    if (!roomData) return null;
    
    // Hiển thị thông báo kết quả bằng dialog
    const showResultDialog = (message, status = 'success') => {
        setResultMessage(message);
        setResultStatus(status);
        setResultDialogOpen(true);
    };
    
    // Đóng dialog kết quả
    const handleResultDialogClose = () => {
        setResultDialogOpen(false);
        
        // Nếu thao tác thành công, đóng dialog chính để component cha gọi refreshRoomData
        if (resultStatus === 'success') {
            onClose(); // Đóng dialog chính, component cha sẽ gọi refreshRoomData
            console.log('Đóng BookingListDialog sau khi hủy đặt phòng thành công');
        }
    };
    
    const formatDateTime = (dateTimeArray) => {
        if (!dateTimeArray || !Array.isArray(dateTimeArray)) return 'Không xác định';
        
        const date = new Date(
            dateTimeArray[0],
            dateTimeArray[1] - 1,
            dateTimeArray[2],
            dateTimeArray[3] || 0,
            dateTimeArray[4] || 0
        );
        
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateDuration = (checkinTime, checkoutTime) => {
        if (!checkinTime || !checkoutTime || !Array.isArray(checkinTime) || !Array.isArray(checkoutTime)) {
            return 'Không xác định';
        }
        
        const checkin = new Date(
            checkinTime[0],
            checkinTime[1] - 1,
            checkinTime[2],
            checkinTime[3] || 0,
            checkinTime[4] || 0
        );
        
        const checkout = new Date(
            checkoutTime[0],
            checkoutTime[1] - 1,
            checkoutTime[2],
            checkoutTime[3] || 0,
            checkoutTime[4] || 0
        );
        
        // Tính khoảng thời gian giữa checkin và checkout
        const diffTime = Math.abs(checkout - checkin);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffDays > 0) {
            return `${diffDays} ngày ${diffHours} giờ`;
        } else {
            return `${diffHours} giờ ${diffMinutes} phút`;
        }
    };

    const getBookingStatus = (status) => {
        switch (status) {
            case 'IN_USE':
                return { label: 'Đang sử dụng', color: '#4caf50' };
            case 'CHECKOUT_SOON':
                return { label: 'Sắp trả phòng', color: '#2196f3' };
            case 'OVERDUE':
                return { label: 'Quá hạn', color: '#f44336' };
            case 'UPCOMING':
                return { label: 'Sắp nhận phòng', color: '#ff9800' };
            default:
                return { label: status, color: '#757575' };
        }
    };

    // Hiện dialog xác nhận hủy đặt phòng
    const handleCancelBooking = (booking) => {
        setSelectedBooking(booking);
        setConfirmDialogOpen(true);
    };

    // Đóng dialog xác nhận
    const handleCloseConfirmDialog = () => {
        setConfirmDialogOpen(false);
        setSelectedBooking(null);
    };

    // Đóng thông báo
    const handleNotificationClose = () => {
        setNotificationOpen(false);
    };

    // Thực hiện hủy đặt phòng
    const confirmCancelBooking = async () => {
        if (!selectedBooking) return;
        
        setIsLoading(true);
        try {
            // Lấy ID phòng từ roomNumber (ví dụ P.001 => lấy 1)
            const roomId = roomData.id || (roomData.roomNumber ? parseInt(roomData.roomNumber.replace(/\D/g, '')) : null);
            
            if (!roomId) {
                throw new Error('Không thể xác định ID phòng');
            }
            
            const cancellationData = {
                bookingId: selectedBooking.bookingId || selectedBooking.id,
                roomIdsToCheckin: [roomId]
            };
            
            console.log('Cancellation data:', cancellationData);
            await CheckinService.cancelCheckin(cancellationData);
            
            // Đóng dialog xác nhận và hiển thị thông báo thành công
            handleCloseConfirmDialog();
            showResultDialog('Hủy đặt phòng thành công!', 'success');
            
            // Component cha sẽ gọi refreshRoomData khi onClose được gọi
        } catch (error) {
            console.error('Lỗi khi hủy đặt phòng:', error);
            // Hiển thị lỗi qua dialog
            showResultDialog(`Lỗi khi hủy đặt phòng: ${error.message || 'Vui lòng thử lại'}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        Danh sách đặt phòng - {roomData.roomNumber}
                    </Typography>
                    <IconButton aria-label="close" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Thông tin phòng
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mt: 1 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Số phòng</Typography>
                                <Typography variant="body1">{roomData.roomNumber}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Loại phòng</Typography>
                                <Typography variant="body1">{roomData.roomType}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Trạng thái</Typography>
                                <Typography variant="body1">
                                    {roomData.status === 'AVAILABLE' ? 'Trống' : 
                                    roomData.status === 'IN_USE' ? 'Đang sử dụng' : 
                                    roomData.status === 'CHECKOUT_SOON' ? 'Sắp trả' : 
                                    roomData.status === 'OVERDUE' ? 'Quá hạn' :
                                    roomData.status === 'UPCOMING' ? 'Sắp nhận' : 
                                    roomData.status === 'MAINTENANCE' ? 'Bảo trì' : 
                                    roomData.status}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Vệ sinh</Typography>
                                <Typography variant="body1">{roomData.isClean ? 'Đã dọn' : 'Chưa dọn'}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                        {bookingsList.length > 0 ? `Danh sách đặt phòng (${bookingsList.length})` : 'Không có đặt phòng nào'}
                    </Typography>

                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {!isLoading && bookingsList.length > 0 ? (
                        <TableContainer component={Paper} sx={{ mb: 3 }}>
                            <Table aria-label="bookings table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell>Mã đặt phòng</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Nhận phòng</TableCell>
                                        <TableCell>Trả phòng</TableCell>
                                        <TableCell>Thời gian lưu trú</TableCell>
                                        <TableCell>Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bookingsList.map((booking, index) => {
                                        const status = getBookingStatus(booking.roomStatusInBooking);
                                        return (
                                            <TableRow key={booking.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{`DP${booking.id.toString().padStart(6, '0')}`}</TableCell>
                                                <TableCell>
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: 'white', 
                                                            backgroundColor: status.color,
                                                            borderRadius: 1,
                                                            display: 'inline-block',
                                                            px: 1,
                                                            py: 0.5
                                                        }}
                                                    >
                                                        {status.label}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{formatDateTime(booking.checkinTime)}</TableCell>
                                                <TableCell>{formatDateTime(booking.checkoutTime)}</TableCell>
                                                <TableCell>{calculateDuration(booking.checkinTime, booking.checkoutTime)}</TableCell>
                                                <TableCell>
                                                    <Button 
                                                        variant="outlined" 
                                                        color="error"
                                                        size="small" 
                                                        sx={{ textTransform: 'none' }}
                                                        onClick={() => handleCancelBooking(booking)}
                                                        disabled={isLoading}
                                                    >
                                                        Hủy
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : !isLoading && (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                Không có lịch đặt phòng nào cho phòng này
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={onClose}
                            sx={{ textTransform: 'none' }}
                        >
                            Đóng
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Dialog xác nhận hủy đặt phòng */}
            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <ConfirmDialogTitle id="alert-dialog-title">
                    Xác nhận hủy đặt phòng
                </ConfirmDialogTitle>
                <ConfirmDialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn hủy đặt phòng mã <strong>{selectedBooking ? `DP${selectedBooking.id.toString().padStart(6, '0')}` : ''}</strong>?
                        <br />
                        Hành động này không thể hoàn tác.
                    </DialogContentText>
                </ConfirmDialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary">
                        Đóng
                    </Button>
                    <Button 
                        onClick={confirmCancelBooking} 
                        color="error" 
                        autoFocus
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang hủy...' : 'Xác nhận hủy'}
                    </Button>
                </DialogActions>
            </ConfirmDialog>

            {/* Dialog thông báo kết quả */}
            <ConfirmDialog
                open={resultDialogOpen}
                onClose={handleResultDialogClose}
                aria-labelledby="result-dialog-title"
            >
                <ConfirmDialogTitle id="result-dialog-title">
                    {resultStatus === 'success' ? 'Thành công' : 'Lỗi'}
                </ConfirmDialogTitle>
                <ConfirmDialogContent>
                    <DialogContentText>
                        {resultMessage}
                    </DialogContentText>
                </ConfirmDialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleResultDialogClose} 
                        color={resultStatus === 'success' ? 'primary' : 'error'} 
                        autoFocus
                    >
                        Đồng ý
                    </Button>
                </DialogActions>
            </ConfirmDialog>

            {/* Thông báo snackbar */}
            <Snackbar
                open={notificationOpen}
                autoHideDuration={5000}
                onClose={handleNotificationClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default BookingListDialog; 