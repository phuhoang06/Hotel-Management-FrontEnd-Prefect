import { useState, useEffect, useCallback } from 'react';
import CheckoutService from "./checkout.service.js"; 
import CheckinService from "./checkin.service.js";

export const useBookingDialog = ({ roomData, onClose, updateRoomData }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // console.log('=== useBookingDialog: roomData useEffect triggered ===');
        // console.log('roomData:', roomData);

        if (!roomData || !roomData.bookings || roomData.bookings.length === 0) {
            // console.log('useBookingDialog: roomData is invalid or no bookings, clearing selectedBooking');
            setSelectedBooking(null);
            return;
        }

        // console.log('useBookingDialog: Processing bookings:', roomData.bookings);
        const upcomingBooking = roomData.bookings.find(b => b.roomStatusInBooking === 'UPCOMING');
        const inUseBooking = roomData.bookings.find(b => b.roomStatusInBooking === 'IN_USE');

        // console.log('useBookingDialog: Found upcomingBooking:', upcomingBooking);
        // console.log('useBookingDialog: Found inUseBooking:', inUseBooking);

        if (inUseBooking) {
            // console.log('useBookingDialog: Setting selectedBooking to inUseBooking:', inUseBooking);
            setSelectedBooking(inUseBooking);
        } else if (upcomingBooking) {
            // console.log('useBookingDialog: Setting selectedBooking to upcomingBooking:', upcomingBooking);
            setSelectedBooking(upcomingBooking);
        } else {
            // console.log('useBookingDialog: No valid booking found, setting selectedBooking to null');
            setSelectedBooking(null);
        }
    }, [roomData]);

    // Effect to calculate total price when selected booking changes
    useEffect(() => {
        if (selectedBooking && roomData?.roomCategory) {
            calculateTotalPrice();
        }
    }, [selectedBooking, roomData]);

    const handleCloseSnackbar = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    const formatDateTime = useCallback((dateTimeArray) => {
        if (!dateTimeArray || !Array.isArray(dateTimeArray) || dateTimeArray.length < 5) return 'Chưa xác định';
        const date = new Date(
            dateTimeArray[0],
            dateTimeArray[1] - 1,
            dateTimeArray[2],
            dateTimeArray[3] || 0,
            dateTimeArray[4] || 0
        );
        return date.toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }, []);

    const calculateStayDuration = useCallback(() => {
        if (!selectedBooking || !selectedBooking.checkinTime || !selectedBooking.checkoutTime) return 'Chưa xác định';
        const checkin = new Date(selectedBooking.checkinTime[0], selectedBooking.checkinTime[1] - 1, selectedBooking.checkinTime[2], selectedBooking.checkinTime[3] || 0, selectedBooking.checkinTime[4] || 0);
        const checkout = new Date(selectedBooking.checkoutTime[0], selectedBooking.checkoutTime[1] - 1, selectedBooking.checkoutTime[2], selectedBooking.checkoutTime[3] || 0, selectedBooking.checkoutTime[4] || 0);
        const diffTime = Math.abs(checkout - checkin);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (diffDays > 0) return `${diffDays} ngày ${diffHours > 0 ? `${diffHours} giờ` : ''}`;
        return `${diffHours} giờ`;
    }, [selectedBooking]);

    // Function to calculate total price based on room category and booking parameters
    const calculateTotalPrice = useCallback(() => {
        if (!selectedBooking || !roomData?.roomCategory) {
            setTotalPrice(0);
            return 0;
        }

        const roomCategory = roomData.roomCategory;
        const rentType = selectedBooking.rentType || 'HOURLY';
        
        // Get base price based on booking type
        let basePrice = 0;
        if (rentType === 'HOURLY') {
            basePrice = roomCategory.hourlyPrice || 0;
        } else if (rentType === 'DAILY') {
            basePrice = roomCategory.dailyPrice || 0;
        } else if (rentType === 'OVERNIGHT') {
            basePrice = roomCategory.overnightPrice || 0;
        }

        // Extract duration from the calculateStayDuration function
        const durationText = calculateStayDuration();
        const daysMatch = durationText.match(/(\d+) ngày/);
        const hoursMatch = durationText.match(/(\d+) giờ/);
        
        let duration = 0;
        
        if (daysMatch && daysMatch[1]) {
            duration += parseInt(daysMatch[1], 10) * 24; // Convert days to hours
        }
        
        if (hoursMatch && hoursMatch[1]) {
            duration += parseInt(hoursMatch[1], 10);
        }
        
        // Default to 1 hour if unable to parse duration
        duration = duration || 1;

        // Calculate price based on rent type and duration
        let calculatedPrice = 0;
        
        if (rentType === 'HOURLY') {
            calculatedPrice = basePrice * duration;
        } else if (rentType === 'DAILY') {
            // For daily rentals, calculate based on days
            const days = Math.ceil(duration / 24);
            calculatedPrice = basePrice * days;
        } else if (rentType === 'OVERNIGHT') {
            // Overnight is typically a fixed price
            calculatedPrice = basePrice;
        }

        setTotalPrice(calculatedPrice);
        return calculatedPrice;
    }, [selectedBooking, roomData, calculateStayDuration]);

    const isLateCheckin = useCallback(() => {
        if (!selectedBooking || !selectedBooking.checkinTime || selectedBooking.roomStatusInBooking !== 'UPCOMING') return false;
        const checkinTime = new Date(selectedBooking.checkinTime[0], selectedBooking.checkinTime[1] - 1, selectedBooking.checkinTime[2], selectedBooking.checkinTime[3] || 0, selectedBooking.checkinTime[4] || 0);
        return new Date() > checkinTime;
    }, [selectedBooking]);

    const isRoomActuallyInUse = useCallback(() => {
        return selectedBooking?.roomStatusInBooking === 'IN_USE';
    }, [selectedBooking]);

    const isRoomActuallyUpcoming = useCallback(() => {
        return selectedBooking?.roomStatusInBooking === 'UPCOMING';
    }, [selectedBooking]);

    const handleCheckin = useCallback(async () => {
        if (!roomData || !selectedBooking || !selectedBooking.id) {
            console.error('Cannot checkin: roomData or selectedBooking ID is missing');
            setSnackbar({ open: true, message: 'Dữ liệu không hợp lệ để nhận phòng.', severity: 'error' });
            return;
        }
        setIsProcessing(true);
        try {
            await CheckinService.performCheckin({
                bookingId: selectedBooking.id,
                roomIdsToCheckin: [roomData.id]
            });
            setSnackbar({ open: true, message: 'Nhận phòng thành công!', severity: 'success' });
            if (typeof updateRoomData === 'function') updateRoomData();
            setTimeout(() => {
                if (typeof onClose === 'function') onClose();
            }, 1500);
        } catch (error) {
            console.error('Lỗi khi nhận phòng:', error);
            setSnackbar({ open: true, message: `Có lỗi khi nhận phòng: ${error.message || 'Vui lòng thử lại!'}`, severity: 'error' });
        } finally {
            setIsProcessing(false);
        }
    }, [roomData, selectedBooking, onClose, updateRoomData]);

    const handleCheckout = useCallback(async () => {
        if (isProcessing) return;
        if (!roomData || !roomData.id) {
            setSnackbar({ open: true, message: "Không thể trả phòng: Dữ liệu phòng không hợp lệ", severity: 'error' });
            return;
        }

        const bookingToCheckout = roomData.bookings?.find(b => b.roomStatusInBooking === 'IN_USE');
        if (!bookingToCheckout || !bookingToCheckout.id) {
            setSnackbar({ open: true, message: "Không thể trả phòng: Không tìm thấy đặt phòng đang hoạt động", severity: 'error' });
            return;
        }

        console.log('Found booking for checkout:', bookingToCheckout);
        console.log('Booking ID:', bookingToCheckout.id);
        console.log('Room ID:', roomData.id);

        setIsProcessing(true);
        try {
            // Sử dụng bookingId.bookingId nếu là object, nếu không thì sử dụng bookingId trực tiếp
            const bookingId = typeof bookingToCheckout.bookingId !== 'undefined' 
                ? bookingToCheckout.bookingId 
                : bookingToCheckout.id;

            const checkoutData = {
                bookingId: bookingId,
                roomId: roomData.id,
                isClean: false
            };
            
            console.log('Checkout data being sent:', checkoutData);
            await CheckoutService.checkout(checkoutData);
            setSnackbar({ open: true, message: "Trả phòng thành công!", severity: 'success' });
            if (typeof updateRoomData === 'function') updateRoomData();
            setTimeout(() => {
                if (typeof onClose === 'function') onClose();
            }, 1500);
        } catch (error) {
            console.error("Lỗi khi trả phòng:", error);
            setSnackbar({ open: true, message: `Lỗi khi trả phòng: ${error.message || 'Vui lòng thử lại!'}`, severity: 'error' });
        } finally {
            setIsProcessing(false);
        }
    }, [roomData, isProcessing, onClose, updateRoomData]);

    const dialogTitle = selectedBooking 
        ? `Chi tiết P.${roomData?.id?.toString().padStart(3, '0') || '???'}`
        : `Phòng P.${roomData?.id?.toString().padStart(3, '0') || '???'}`;

    return {
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
        totalPrice,
        calculateTotalPrice
    };
};