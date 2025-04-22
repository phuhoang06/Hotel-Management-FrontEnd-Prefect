import React from 'react';
import { Box } from '@mui/material';
import SchematicView from './SchematicView';
import GridView from './GridView';
import ListView from './ListView';
import BookingDialog from './BookingDialog';
import FilterDialog from './FilterDialog';
import useRoomBooking from "../../../layouts/employee/hooks/useRoomBooking.js";

export default function RoomBookingView() {
    const {
        viewMode,
        bookingOpen,
        filterOpen,
        handleViewModeChange,
        handleBookingOpen,
        handleBookingClose,
        handleFilterOpen,
        handleFilterClose,
    } = useRoomBooking();

    return (
        <Box sx={{ flexGrow: 1, mt: 0 }}>
            {viewMode === 'Sơ đồ' && (
                <SchematicView
                    onBookingOpen={handleBookingOpen}
                    onFilterOpen={handleFilterOpen}
                    onViewModeChange={handleViewModeChange}
                />
            )}
            {viewMode === 'Lưới' && (
                <GridView
                    onBookingOpen={handleBookingOpen}
                    onFilterOpen={handleFilterOpen}
                    onViewModeChange={handleViewModeChange}
                />
            )}
            {viewMode === 'Danh sách' && (
                <ListView
                    onBookingOpen={handleBookingOpen}
                    onFilterOpen={handleFilterOpen}
                    onViewModeChange={handleViewModeChange}
                />
            )}

            <BookingDialog open={bookingOpen} onClose={handleBookingClose} />
            <FilterDialog open={filterOpen} onClose={handleFilterClose} />
        </Box>
    );
}