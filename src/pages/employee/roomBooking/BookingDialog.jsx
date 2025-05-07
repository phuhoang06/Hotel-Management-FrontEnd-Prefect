import React from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Divider, Grid, Button, IconButton, Paper, Snackbar, Alert
} from '@mui/material';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // Không thấy sử dụng
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import { useBookingDialog } from '../../../service/useBookingDialog.js'; // Điều chỉnh đường dẫn nếu cần

// Styled components (có thể tách ra file BookingDialog.styles.js)
const PreBooked = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff2e6', color: '#ff8000', padding: '4px 10px',
  borderRadius: '4px', fontSize: '14px', fontWeight: 400,
}));

const InUseStatus = styled(Box)(({ theme }) => ({
  backgroundColor: '#e6f7ff', color: '#0080ff', padding: '4px 10px',
  borderRadius: '4px', fontSize: '14px', fontWeight: 400,
}));

const AvailableStatus = styled(Box)(({ theme }) => ({
  backgroundColor: '#e6ffe6', color: '#00cc00', padding: '4px 10px',
  borderRadius: '4px', fontSize: '14px', fontWeight: 400,
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: '14px', color: '#666', marginBottom: '5px',
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '15px', fontWeight: 500,
}));

const HoursWarning = styled(Typography)(({ theme }) => ({
  marginLeft: '10px', color: '#ff0000', fontSize: '14px',
}));

const PriceSummary = styled(Paper)(({ theme }) => ({
  backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px', marginTop: '20px',
}));

const NoteField = styled(Box)(({ theme }) => ({
  display: 'flex', alignItems: 'center', gap: '10px',
  color: '#666', padding: '10px 0',
}));

const PriceRow = styled(Box)(({ theme }) => ({
  display: 'flex', justifyContent: 'space-between', marginBottom: '10px',
}));

const TotalRow = styled(Box)(({ theme }) => ({
  display: 'flex', justifyContent: 'space-between', fontWeight: 700,
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '14px 20px',
}));

function BookingDialog({ open, onClose, roomData, updateRoomData }) {
  const {
    isProcessing,
    snackbar,
    selectedBooking,
    handleCloseSnackbar,
    formatDateTime,
    calculateStayDuration,
    isLateCheckin,
    isRoomActuallyInUse,
    isRoomActuallyUpcoming,
    handleCheckin,
    handleCheckout,
    dialogTitle,
    totalPrice
  } = useBookingDialog({ roomData, onClose, updateRoomData });

  if (!roomData) { // Hoặc !selectedBooking nếu bạn muốn dialog chỉ hiện khi có booking được chọn
    return null;
  }

  const currentRoomName = roomData?.roomCategory?.name || roomData?.roomCategoryName || 'Phòng tiêu chuẩn';
  const currentRoomCode = roomData?.roomCategory?.code || `P.${roomData?.id?.toString().padStart(3, '0') || '???'}`;
  const dailyPrice = roomData?.roomCategory?.dailyPrice?.toLocaleString('vi-VN') || '0';

  return (
      <>
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <StyledDialogTitle>
            {dialogTitle}
            <IconButton aria-label="close" onClick={onClose}><CloseIcon /></IconButton>
          </StyledDialogTitle>

          <DialogContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" component="div">
                {currentRoomName}
              </Typography>
              {selectedBooking ? (
                  isRoomActuallyInUse() ? (
                      <InUseStatus>Đang sử dụng</InUseStatus>
                  ) : isRoomActuallyUpcoming() ? (
                      <PreBooked>Đã đặt (chờ nhận phòng)</PreBooked>
                  ) : (
                      <AvailableStatus>Có thể có lỗi trạng thái</AvailableStatus> // Trường hợp này không nên xảy ra nếu selectedBooking có dữ liệu
                  )
              ) : (
                  <AvailableStatus>Phòng trống</AvailableStatus>
              )}
            </Box>
            <Divider sx={{ my: 2 }} />

            {selectedBooking ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <InfoLabel>Khách hàng</InfoLabel>
                      <InfoValue>{selectedBooking.customerName || 'Khách lẻ'}</InfoValue>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <InfoLabel>Khách lưu trú</InfoLabel>
                      <InfoValue>{selectedBooking.guestCount || 1} người lớn, {selectedBooking.childCount || 0} trẻ em</InfoValue>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <InfoLabel>Mã đặt phòng</InfoLabel>
                      <InfoValue>DP{selectedBooking.id?.toString().padStart(6, '0')}</InfoValue>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={{ my: 2 }}>
                    <Grid item xs={12} md={4}>
                      <InfoLabel>Nhận phòng</InfoLabel>
                      <InfoValue>{formatDateTime(selectedBooking.checkinTime)}</InfoValue>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <InfoLabel>Trả phòng</InfoLabel>
                      <InfoValue>{formatDateTime(selectedBooking.checkoutTime)}</InfoValue>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <InfoLabel>Thời gian lưu trú</InfoLabel>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <InfoValue>{calculateStayDuration()}</InfoValue>
                        {isLateCheckin() && <HoursWarning>Quá giờ nhận phòng</HoursWarning>}
                      </Box>
                    </Grid>
                  </Grid>

                  <NoteField>
                    <EditIcon fontSize="small" />
                    <Typography variant="body2">{selectedBooking.note || 'Chưa có ghi chú'}</Typography>
                  </NoteField>

                  <PriceSummary elevation={0}>
                 
                    <PriceRow>
                      <Typography>Thời gian lưu trú</Typography>
                      <Typography>{calculateStayDuration()}</Typography>
                    </PriceRow>
                    <Divider sx={{ my: 1 }} />
                    <TotalRow>
                      <Typography>Tổng tiền phòng</Typography>
                      <Typography color="primary">{totalPrice.toLocaleString('vi-VN')} đ</Typography>
                    </TotalRow>
                    <Divider sx={{ my: 1 }} />
                    <TotalRow>
                      <Typography>Khách đã trả</Typography>
                      <Typography>{selectedBooking.prepaidAmount?.toLocaleString('vi-VN') || '0'} đ</Typography>
                    </TotalRow>
                    {selectedBooking.prepaidAmount > 0 && (
                      <TotalRow sx={{ mt: 1 }}>
                        <Typography>Còn lại</Typography>
                        <Typography color="error">{(totalPrice - (selectedBooking.prepaidAmount || 0)).toLocaleString('vi-VN')} đ</Typography>
                      </TotalRow>
                    )}
                  </PriceSummary>
                </>
            ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', my: 3 }}>
                  Không có thông tin đặt phòng cho phòng này hoặc phòng đang trống.
                </Typography>
            )}
          </DialogContent>

          <DialogActions sx={{ padding: '16px 24px' }}>
            <Button
                variant="outlined"
                onClick={onClose}
                sx={{ color: '#00a06d', borderColor: '#00a06d', '&:hover': { borderColor: '#008f5e', backgroundColor: 'rgba(0, 160, 109, 0.04)' } }}
            >
              Đóng
            </Button>
            {selectedBooking && isRoomActuallyUpcoming() && (
                <Button
                    variant="contained"
                    onClick={handleCheckin}
                    disabled={isProcessing}
                    sx={{ backgroundColor: '#00a06d', '&:hover': { backgroundColor: '#008f5e' } }}
                >
                  {isProcessing ? 'Đang xử lý...' : 'Nhận phòng ngay'}
                </Button>
            )}
            {selectedBooking && isRoomActuallyInUse() && (
                <Button
                    variant="contained"
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    sx={{ backgroundColor: '#ff6666', '&:hover': { backgroundColor: '#ff4d4d' } }}
                >
                  {isProcessing ? 'Đang xử lý...' : 'Trả phòng'}
                </Button>
            )}
            {/* Nút Debug Checkout có thể không cần thiết nữa nếu logic đã ổn định */}
          </DialogActions>
        </Dialog>

        <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </>
  );
}

export default BookingDialog;