import React from 'react';
import {
    Dialog,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Divider,
    Grid,
    Button,
    Chip,
    Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import AlarmIcon from '@mui/icons-material/Alarm';
import EditIcon from '@mui/icons-material/Edit';

// Component for the Room Details Dialog (Occupied Room)
const RoomDetailsDialog = ({ open, onClose, roomData }) => {
    // Default room data if not provided
    const defaultData = {
        roomNumber: 'P.202',
        roomType: 'Phòng 01 giường đôi cho 2 người',
        status: 'IN_USE',
        isClean: true,
        customerType: 'Khách lẻ',
        guestInfo: '0 người lớn, 0 trẻ em, 0 giấy tờ',
        bookingId: 'DP000002',
        checkIn: '23 Thg 04, 11:30',
        checkOut: '23 Thg 04, 23:30',
        stayDuration: '12 giờ',
        timeUsed: 'Đã sử dụng: 69 giờ 59 phút',
        price: '2,160,000',
        amountPaid: '0',
        notes: 'Chưa có ghi chú'
    };

    const data = roomData || defaultData;

    // Determine the status display
    let statusIcon = <CheckCircleIcon fontSize="small" />;
    let statusLabel = 'Đang sử dụng';
    let statusColor = 'success';
    
    if (data.status === 'CHECKOUT_SOON') {
        statusIcon = <AlarmIcon fontSize="small" />;
        statusLabel = 'Sắp trả phòng';
        statusColor = 'primary';
    } else if (data.status === 'OVERDUE') {
        statusIcon = <WarningIcon fontSize="small" />;
        statusLabel = 'Quá hạn trả phòng';
        statusColor = 'error';
    }
    
    // Determine cleaning status display
    const cleaningStatusIcon = data.isClean ? 
        <CheckCircleIcon color="success" /> : 
        <WarningIcon color="warning" />;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
                <Typography variant="h6">Chi tiết {data.roomNumber}</Typography>
                <Box>
                    <IconButton aria-label="delete">
                        <DeleteOutlineIcon />
                    </IconButton>
                    <IconButton aria-label="close" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>

            <DialogContent sx={{ px: 3, py: 2 }}>
                <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {data.roomType}
                        </Typography>
                        <Chip
                            icon={statusIcon}
                            label={statusLabel}
                            color={statusColor}
                            size="small"
                            sx={{ borderRadius: 1 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                            {cleaningStatusIcon}
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">Khách hàng</Typography>
                            <Typography variant="body1">{data.customerType}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">Khách lưu trú</Typography>
                            <Typography variant="body1">{data.guestInfo}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">Mã đặt phòng</Typography>
                            <Typography variant="body1">{data.bookingId}</Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">Nhận phòng</Typography>
                            <Typography variant="body1">{data.checkIn}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">Trả phòng</Typography>
                            <Typography variant="body1">{data.checkOut}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">Thời gian lưu trú</Typography>
                            <Box>
                                <Typography variant="body1">{data.stayDuration}</Typography>
                                <Typography variant="body2" color="text.secondary">{data.timeUsed}</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <EditIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">{data.notes}</Typography>
                    </Box>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                    <Box>
                        <Typography variant="h6">{data.roomNumber}</Typography>
                        <Typography variant="body2" color="text.secondary">Khách đã trả</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6">{data.price}</Typography>
                        <Typography variant="body1">{data.amountPaid}</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    <Button
                        variant="outlined"
                        sx={{ borderRadius: 1, textTransform: 'none' }}
                    >
                        Sửa đặt phòng
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ borderRadius: 1, textTransform: 'none' }}
                    >
                        {data.status === 'IN_USE' ? 'Thanh toán' : 'Trả phòng'}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default RoomDetailsDialog;