import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import RoomDetailsDialog from './RoomDetailsDialog';
import QuickBookingDialog from './QuickBookingDialog';

// Main component for room management system with state toggle
const RoomManagementSystem = () => {
    // State to track which view is active (occupied room or quick booking)
    const [activeView, setActiveView] = useState('occupied'); // 'occupied' or 'quickBooking'
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpenDialog = (viewType) => {
        setActiveView(viewType);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Box>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog('occupied')}>
                Xem phòng đang sử dụng
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => handleOpenDialog('quickBooking')}
                sx={{ ml: 2 }}
            >
                Đặt/Nhận phòng nhanh
            </Button>

            {activeView === 'occupied' ? (
                <RoomDetailsDialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                />
            ) : (
                <QuickBookingDialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                />
            )}
        </Box>
    );
};

export default RoomManagementSystem;