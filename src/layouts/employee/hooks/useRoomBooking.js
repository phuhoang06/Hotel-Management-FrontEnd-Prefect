import { useState } from 'react';

export default function useRoomBooking() {
    const [viewMode, setViewMode] = useState('Sơ đồ');
    const [bookingOpen, setBookingOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    const handleBookingOpen = () => {
        setBookingOpen(true);
    };

    const handleBookingClose = () => {
        setBookingOpen(false);
    };

    const handleFilterOpen = () => {
        setFilterOpen(true);
    };

    const handleFilterClose = () => {
        setFilterOpen(false);
    };

    return {
        viewMode,
        bookingOpen,
        filterOpen,
        handleViewModeChange,
        handleBookingOpen,
        handleBookingClose,
        handleFilterOpen,
        handleFilterClose,
    };
}