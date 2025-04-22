import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { BookingTransition } from '../common/Transitions';

export default function BookingDialog({ open, onClose }) {
    return (
        <Dialog
            open={open}
            TransitionComponent={BookingTransition}
            keepMounted
            onClose={onClose}
            aria-describedby="booking-dialog-slide-description"
        >
            <DialogTitle>{"Xác nhận đặt phòng?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="booking-dialog-slide-description">
                    Vui lòng xác nhận thông tin đặt phòng. Bạn có muốn tiếp tục đặt phòng này không?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={onClose}>Đồng ý</Button>
            </DialogActions>
        </Dialog>
    );
}