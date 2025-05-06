import React from 'react';
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
    Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BookingListDialog = ({ open, onClose, roomData, bookings = [] }) => {
    if (!roomData) return null;
    
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

    return (
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
                    {bookings.length > 0 ? `Danh sách đặt phòng (${bookings.length})` : 'Không có đặt phòng nào'}
                </Typography>

                {bookings.length > 0 ? (
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
                                {bookings.map((booking, index) => {
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
                                                    size="small" 
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Chi tiết
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
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
    );
};

export default BookingListDialog; 