import React, { useState } from 'react';
import { 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Typography, 
  Divider, 
  Grid, 
  Button, 
  IconButton, 
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import RoomBookingService from "../../../service/roomBooking.service.js";

// Styled components
const PreBooked = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff2e6',
  color: '#ff8000',
  padding: '4px 10px',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: 400,
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#666',
  marginBottom: '5px',
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '15px',
  fontWeight: 500,
}));

const HoursWarning = styled(Typography)(({ theme }) => ({
  marginLeft: '10px',
  color: '#ff0000',
  fontSize: '14px',
}));

const PriceSummary = styled(Paper)(({ theme }) => ({
  backgroundColor: '#f9f9f9',
  padding: '15px',
  borderRadius: '6px',
  marginTop: '20px',
}));

const NoteField = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#666',
  padding: '10px 0',
}));

const PriceRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px',
}));

const TotalRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  fontWeight: 700,
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 20px',
}));

function BookingDialog({ open, onClose, roomData }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Xử lý trường hợp roomData là null hoặc undefined
  if (!roomData) {
    return null;
  }

  // Lấy thông tin booking sắp tới (UPCOMING)
  const upcomingBooking = roomData.bookings?.find(booking => booking.roomStatusInBooking === 'UPCOMING');
  
  if (!upcomingBooking) {
    // Không tìm thấy booking UPCOMING
    return null;
  }

  // Định dạng thời gian check-in và check-out
  const formatDateTime = (dateTimeArray) => {
    if (!dateTimeArray || !Array.isArray(dateTimeArray)) return 'Chưa xác định';
    
    const date = new Date(
      dateTimeArray[0],
      dateTimeArray[1] - 1,
      dateTimeArray[2],
      dateTimeArray[3] || 0,
      dateTimeArray[4] || 0
    );
    
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Tính thời gian lưu trú
  const calculateStayDuration = () => {
    if (!upcomingBooking.checkinTime || !upcomingBooking.checkoutTime) return 'Chưa xác định';
    
    const checkinTime = new Date(
      upcomingBooking.checkinTime[0],
      upcomingBooking.checkinTime[1] - 1,
      upcomingBooking.checkinTime[2],
      upcomingBooking.checkinTime[3] || 0,
      upcomingBooking.checkinTime[4] || 0
    );
    
    const checkoutTime = new Date(
      upcomingBooking.checkoutTime[0],
      upcomingBooking.checkoutTime[1] - 1,
      upcomingBooking.checkoutTime[2],
      upcomingBooking.checkoutTime[3] || 0,
      upcomingBooking.checkoutTime[4] || 0
    );
    
    const diffTime = Math.abs(checkoutTime - checkinTime);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} ngày ${diffHours > 0 ? `${diffHours} giờ` : ''}`;
    } else {
      return `${diffHours} giờ`;
    }
  };

  // Kiểm tra nếu thời gian hiện tại đã quá thời gian check-in
  const isLateCheckin = () => {
    if (!upcomingBooking.checkinTime) return false;
    
    const checkinTime = new Date(
      upcomingBooking.checkinTime[0],
      upcomingBooking.checkinTime[1] - 1,
      upcomingBooking.checkinTime[2],
      upcomingBooking.checkinTime[3] || 0,
      upcomingBooking.checkinTime[4] || 0
    );
    
    const now = new Date();
    return now > checkinTime;
  };

  // Xử lý nhận phòng
  const handleCheckin = async () => {
    try {
      setIsProcessing(true);
      
      // Gọi API để cập nhật trạng thái booking
      await RoomBookingService.checkInBooking(upcomingBooking.id);
      
      setSnackbar({
        open: true,
        message: 'Nhận phòng thành công!',
        severity: 'success'
      });
      
      // Đóng dialog sau khi hiển thị thông báo thành công
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Lỗi khi nhận phòng:', error);
      
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi nhận phòng. Vui lòng thử lại!',
        severity: 'error'
      });
      
      setIsProcessing(false);
    }
  };

  // Đóng thông báo
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <StyledDialogTitle>
          <Typography variant="h6" component="div">
            Chi tiết {roomData.roomCategory?.code || `P.${roomData.id?.toString().padStart(3, '0')}`}
          </Typography>
          <Box>
            <IconButton aria-label="close" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </StyledDialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" component="div">
              {roomData.roomCategory?.name || roomData.roomCategoryName || 'Phòng tiêu chuẩn'}
            </Typography>
            <PreBooked>Đã đến giờ nhận phòng</PreBooked>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <InfoLabel>Khách hàng</InfoLabel>
              <InfoValue>{upcomingBooking.customerName || 'Khách lẻ'}</InfoValue>
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoLabel>Khách lưu trú</InfoLabel>
              <InfoValue>{upcomingBooking.guestCount || 1} người lớn, {upcomingBooking.childCount || 0} trẻ em</InfoValue>
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoLabel>Mã đặt phòng</InfoLabel>
              <InfoValue>DP{upcomingBooking.id?.toString().padStart(6, '0') || roomData.id?.toString().padStart(6, '0')}</InfoValue>
            </Grid>
          </Grid>
          
          <Grid container spacing={2} sx={{ my: 2 }}>
            <Grid item xs={12} md={4}>
              <InfoLabel>Nhận phòng</InfoLabel>
              <InfoValue>{formatDateTime(upcomingBooking.checkinTime)}</InfoValue>
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoLabel>Trả phòng</InfoLabel>
              <InfoValue>{formatDateTime(upcomingBooking.checkoutTime)}</InfoValue>
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoLabel>Thời gian lưu trú</InfoLabel>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoValue>{calculateStayDuration()}</InfoValue>
                {isLateCheckin() && (
                  <HoursWarning>Quá giờ nhận phòng dự kiến</HoursWarning>
                )}
              </Box>
            </Grid>
          </Grid>
          
          <NoteField>
            <EditIcon fontSize="small" />
            <Typography variant="body2">{upcomingBooking.note || 'Chưa có ghi chú'}</Typography>
          </NoteField>
          
          <PriceSummary elevation={0}>
            <PriceRow>
              <Typography fontWeight={500}>{roomData.roomCategory?.code || `P.${roomData.id?.toString().padStart(3, '0')}`}</Typography>
              <Typography fontWeight={500}>
                {roomData.roomCategory?.dailyPrice?.toLocaleString('vi-VN') || '0'} đ
              </Typography>
            </PriceRow>
            <TotalRow>
              <Typography>Khách đã trả</Typography>
              <Typography>{upcomingBooking.prepaidAmount?.toLocaleString('vi-VN') || '0'} đ</Typography>
            </TotalRow>
          </PriceSummary>
        </DialogContent>
        
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={{ 
              color: '#00a06d', 
              borderColor: '#00a06d',
              '&:hover': {
                borderColor: '#008f5e',
                backgroundColor: 'rgba(0, 160, 109, 0.04)'
              }
            }}
          >
            Hủy
          </Button>
          <Button 
            variant="contained"
            onClick={handleCheckin}
            disabled={isProcessing}
            sx={{ 
              backgroundColor: '#00a06d',
              '&:hover': {
                backgroundColor: '#008f5e'
              }
            }}
          >
            Nhận phòng ngay
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default BookingDialog;