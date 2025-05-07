import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchBar from './SearchBar';
import ViewModeButtons from './ViewModeButtons';
import ActionButtons from './ActionButtons';
import { StatusBar } from './StatusBar';
import RoomBookingService from "../../../service/roomBooking.service.js";
import QuickBookingDialog from './QuickBookingDialog';
import RoomDetailsDialog from './RoomDetailsDialog';
import BookingListDialog from './BookingListDialog';
import BookingDialog from './BookingDialog';

export default function ListView({ onBookingOpen, onFilterOpen, onViewModeChange }) {
    const [anchorElSearch, setAnchorElSearch] = useState(null);
    const [anchorElPriceTable, setAnchorElPriceTable] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [rooms, setRooms] = useState([]);
    const [allRooms, setAllRooms] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomDetailsDialogOpen, setRoomDetailsDialogOpen] = useState(false);
    const [quickBookingDialogOpen, setQuickBookingDialogOpen] = useState(false);
    const [bookingListDialogOpen, setBookingListDialogOpen] = useState(false);
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [menuRoom, setMenuRoom] = useState(null);
    const [warningDialogOpen, setWarningDialogOpen] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await RoomBookingService.getAllRoomsWithBookingDetails();
                const roomData = res.content || [];
                setRooms(roomData);
                setAllRooms(roomData);
            } catch (err) {
                console.error('Không thể tải danh sách phòng:', err);
            }
        };
        fetchRooms();
    }, []);

    const handleSearchClick = (event) => {
        setAnchorElSearch(event.currentTarget);
    };

    const handleSearchClose = () => {
        setAnchorElSearch(null);
    };

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handlePriceTableClick = (event) => {
        setAnchorElPriceTable(event.currentTarget);
    };

    const handlePriceTableClose = () => {
        setAnchorElPriceTable(null);
    };

    const getRoomStatusCounts = () => {
        const counts = {
            soonCheckIn: 0,
            inUse: 0,
            soonCheckOut: 0,
            overdue: 0,
            available: 0,
            maintenance: 0,
        };

        // Lấy thời gian hiện tại
        const now = new Date();
        
        // Định nghĩa khoảng thời gian "sắp trả" (30 phút trước thời gian checkout)
        const checkoutWarningTime = 30 * 60 * 1000; // 30 phút * 60 giây * 1000 ms

        allRooms.forEach((room) => {
            // Tìm booking đang sử dụng (IN_USE)
            const activeBooking = room.bookings?.find(booking => booking.roomStatusInBooking === 'IN_USE');
            
            if (activeBooking) {
                // Nếu có booking đang sử dụng, kiểm tra thời gian
                const checkoutTime = activeBooking.checkoutTime && Array.isArray(activeBooking.checkoutTime) 
                    ? new Date(
                        activeBooking.checkoutTime[0], 
                        activeBooking.checkoutTime[1] - 1, 
                        activeBooking.checkoutTime[2],
                        activeBooking.checkoutTime[3] || 0,
                        activeBooking.checkoutTime[4] || 0
                    ) : null;
                
                if (checkoutTime) {
                    const timeUntilCheckout = checkoutTime - now;
                    
                    if (timeUntilCheckout < 0) {
                        // Nếu thời gian checkout đã qua, đánh dấu là quá giờ
                        counts.overdue += 1;
                    } else if (timeUntilCheckout <= checkoutWarningTime) {
                        // Nếu còn dưới 30 phút đến thời gian checkout, đánh dấu là sắp trả
                        counts.soonCheckOut += 1;
                    } else {
                        // Đang sử dụng bình thường
                        counts.inUse += 1;
                    }
                } else {
                    // Không có thông tin checkoutTime, tính là đang sử dụng
                    counts.inUse += 1;
                }
            } else {
                // Kiểm tra các booking khác
                const hasCheckoutSoonBooking = room.bookings?.some(booking => booking.roomStatusInBooking === 'CHECKOUT_SOON');
                const hasOverdueBooking = room.bookings?.some(booking => booking.roomStatusInBooking === 'OVERDUE');
                const hasUpcomingBooking = room.bookings?.some(booking => booking.roomStatusInBooking === 'UPCOMING');
                
                if (hasCheckoutSoonBooking) {
                    counts.soonCheckOut += 1;
                } else if (hasOverdueBooking) {
                    counts.overdue += 1;
                } else if (hasUpcomingBooking) {
                    counts.soonCheckIn += 1;
                } else if (room.status === 'MAINTENANCE') {
                    counts.maintenance += 1;
                } else if (room.status === 'AVAILABLE') {
                    counts.available += 1;
                }
            }
        });

        return counts;
    };

    const getBookingData = (room, index) => {
        const roomCategory = room.roomCategory || {};
        const dailyPrice = roomCategory.dailyPrice || 0;
        
        // Sử dụng thông tin booking từ API mới nếu có
        const upcomingBooking = room.bookings && room.bookings.length > 0 
            ? room.bookings[0] // Lấy booking đầu tiên
            : null;
            
        const checkInTime = upcomingBooking?.checkinTime
            ? new Date(
                upcomingBooking.checkinTime[0], 
                upcomingBooking.checkinTime[1] - 1, 
                upcomingBooking.checkinTime[2],
                upcomingBooking.checkinTime[3] || 0,
                upcomingBooking.checkinTime[4] || 0
              ).toLocaleDateString('vi-VN')
            : (room.startDate
                ? new Date(room.startDate[0], room.startDate[1] - 1, room.startDate[2]).toLocaleDateString('vi-VN')
                : '');
                
        const checkOutTime = upcomingBooking?.checkoutTime
            ? new Date(
                upcomingBooking.checkoutTime[0], 
                upcomingBooking.checkoutTime[1] - 1, 
                upcomingBooking.checkoutTime[2],
                upcomingBooking.checkoutTime[3] || 0,
                upcomingBooking.checkoutTime[4] || 0
              ).toLocaleDateString('vi-VN')
            : (room.checkInDuration && room.startDate
                ? new Date(
                    room.startDate[0],
                    room.startDate[1] - 1,
                    room.startDate[2] + room.checkInDuration
                  ).toLocaleDateString('vi-VN')
                : '');

        return {
            stt: index + 1,
            bookingCode: `DP${room.id.toString().padStart(6, '0')}`,
            channelCode: "",
            room: `P.${room.id.toString().padStart(3, '0')}`,
            customer: "Khách lẻ\nNhập ghi chú",
            checkInTime,
            checkOutTime,
            total: dailyPrice.toLocaleString('vi-VN'),
            paid: "0",
            action: getActionButton(statusToAction(room.status, room.isClean)),
            // Thêm thông tin số booking
            bookingCount: room.bookings ? room.bookings.length : 0
        };
    };

    const statusToAction = (status, isClean) => {
        switch (status) {
            case 'AVAILABLE':
                return isClean ? 'CHECKIN' : 'NO_ACTION';
            case 'UPCOMING':
                return 'CHECKIN';
            case 'IN_USE':
                return 'PAYMENT';
            case 'CHECKOUT_SOON':
            case 'OVERDUE':
                return 'CHECKOUT';
            case 'MAINTENANCE':
                return 'NO_ACTION';
            default:
                return 'NO_ACTION';
        }
    };

    const getActionButton = (action) => {
        switch (action) {
            case 'CHECKIN': 
                return <Button variant="contained" size="small" sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>Nhận phòng</Button>;
            case 'CHECKOUT': 
                return <Button variant="contained" size="small" sx={{ backgroundColor: '#2196F3', color: '#fff' }}>Trả phòng</Button>;
            case 'PAYMENT': 
                return <Button variant="contained" size="small" sx={{ backgroundColor: '#FF9800', color: '#fff' }}>Thanh toán</Button>;
            case 'NO_ACTION':
            default: 
                return null;
        }
    };

    const handleStatusFilter = (status) => {
        try {
            setActiveFilter(status);
            
            // Lấy thời gian hiện tại
            const now = new Date();
            
            // Định nghĩa khoảng thời gian "sắp trả" (30 phút trước thời gian checkout)
            const checkoutWarningTime = 30 * 60 * 1000; // 30 phút * 60 giây * 1000 ms
            
            if (status === 'ALL') {
                setRooms(allRooms);
            } else if (status === 'IN_USE') {
                const filteredRooms = allRooms.filter(room => {
                    // Tìm booking đang sử dụng (IN_USE)
                    const activeBooking = room.bookings?.find(booking => booking.roomStatusInBooking === 'IN_USE');
                    
                    if (activeBooking) {
                        // Lấy thời gian checkout
                        const checkoutTime = activeBooking.checkoutTime && Array.isArray(activeBooking.checkoutTime) 
                            ? new Date(
                                activeBooking.checkoutTime[0], 
                                activeBooking.checkoutTime[1] - 1, 
                                activeBooking.checkoutTime[2],
                                activeBooking.checkoutTime[3] || 0,
                                activeBooking.checkoutTime[4] || 0
                            ) : null;
                        
                        if (checkoutTime) {
                            const timeUntilCheckout = checkoutTime - now;
                            // Chỉ tính là đang sử dụng nếu còn hơn 30 phút đến checkout và chưa quá giờ
                            return timeUntilCheckout > checkoutWarningTime && timeUntilCheckout > 0;
                        }
                        return true; // Không có thông tin checkout, coi như đang sử dụng bình thường
                    }
                    return false;
                });
                
                setRooms(filteredRooms);
            } else if (status === 'CHECKOUT_SOON') {
                const filteredRooms = allRooms.filter(room => {
                    // Ưu tiên kiểm tra booking đang sử dụng trước
                    const activeBooking = room.bookings?.find(booking => booking.roomStatusInBooking === 'IN_USE');
                    
                    if (activeBooking) {
                        // Lấy thời gian checkout
                        const checkoutTime = activeBooking.checkoutTime && Array.isArray(activeBooking.checkoutTime) 
                            ? new Date(
                                activeBooking.checkoutTime[0], 
                                activeBooking.checkoutTime[1] - 1, 
                                activeBooking.checkoutTime[2],
                                activeBooking.checkoutTime[3] || 0,
                                activeBooking.checkoutTime[4] || 0
                            ) : null;
                        
                        if (checkoutTime) {
                            const timeUntilCheckout = checkoutTime - now;
                            // Sắp trả: còn dưới 30 phút đến thời gian checkout và chưa quá giờ
                            return timeUntilCheckout <= checkoutWarningTime && timeUntilCheckout > 0;
                        }
                        return false;
                    }
                    
                    // Nếu không có booking đang sử dụng, kiểm tra các booking có trạng thái sắp trả
                    return room.bookings?.some(booking => booking.roomStatusInBooking === 'CHECKOUT_SOON');
                });
                
                setRooms(filteredRooms);
            } else if (status === 'OVERDUE') {
                const filteredRooms = allRooms.filter(room => {
                    // Ưu tiên kiểm tra booking đang sử dụng trước
                    const activeBooking = room.bookings?.find(booking => booking.roomStatusInBooking === 'IN_USE');
                    
                    if (activeBooking) {
                        // Lấy thời gian checkout
                        const checkoutTime = activeBooking.checkoutTime && Array.isArray(activeBooking.checkoutTime) 
                            ? new Date(
                                activeBooking.checkoutTime[0], 
                                activeBooking.checkoutTime[1] - 1, 
                                activeBooking.checkoutTime[2],
                                activeBooking.checkoutTime[3] || 0,
                                activeBooking.checkoutTime[4] || 0
                            ) : null;
                        
                        if (checkoutTime) {
                            const timeUntilCheckout = checkoutTime - now;
                            // Quá giờ: thời gian checkout đã qua
                            return timeUntilCheckout < 0;
                        }
                        return false;
                    }
                    
                    // Nếu không có booking đang sử dụng, kiểm tra các booking có trạng thái quá giờ
                    return room.bookings?.some(booking => booking.roomStatusInBooking === 'OVERDUE');
                });
                
                setRooms(filteredRooms);
            } else if (status === 'UPCOMING') {
                const filteredRooms = allRooms.filter(room => 
                    room.bookings?.some(booking => booking.roomStatusInBooking === 'UPCOMING')
                );
                setRooms(filteredRooms);
            } else {
                // Các trạng thái khác (AVAILABLE, MAINTENANCE) vẫn dùng room.status
                const filteredRooms = allRooms.filter(room => room.status === status);
                setRooms(filteredRooms);
            }
        } catch (error) {
            console.error('Lỗi khi lọc phòng:', error);
        }
    };

    // Handle menu open for room actions
    const handleRoomMenuClick = (event, room) => {
        event.stopPropagation();
        setMenuAnchorEl(event.currentTarget);
        setMenuRoom(room);
    };

    // Handle menu close
    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuRoom(null);
    };

    // Toggle room cleaning status
    const handleToggleCleanStatus = async () => {
        if (!menuRoom) return;
        
        try {
            const newCleanStatus = !menuRoom.isClean;
            console.log(`Changing room ${menuRoom.id} cleaning status to: ${newCleanStatus ? 'Đã dọn' : 'Chưa dọn'}`);
            
            // Update room cleaning status via API
            await RoomBookingService.updateRoomCleanStatus(menuRoom.id, newCleanStatus);
            
            // Update the local state
            const updatedRooms = rooms.map(room => 
                room.id === menuRoom.id ? { ...room, isClean: newCleanStatus } : room
            );
            setRooms(updatedRooms);
            
            const updatedAllRooms = allRooms.map(room => 
                room.id === menuRoom.id ? { ...room, isClean: newCleanStatus } : room
            );
            setAllRooms(updatedAllRooms);
            
            handleMenuClose();
        } catch (error) {
            console.error('Error updating room cleaning status:', error);
        }
    };

    const statusCounts = getRoomStatusCounts();

    // Xử lý khi click vào card phòng
    const handleRoomCardClick = async (room) => {
        if (!room) {
            console.error('Room data is undefined');
            return;
        }
        
        // Ghi log thông tin phòng 
        console.log('Room clicked:', room);
        console.log('Room ID:', room.id);
        console.log('Room status:', room.status);
        console.log('Room isClean:', room.isClean);
        
        // Đảm bảo phòng có ID
        if (!room.id) {
            console.error('Room ID is missing');
            return;
        }
        
        try {
            // Đặt thông tin phòng với ID được chọn
            setSelectedRoom(room);
            
            // Kiểm tra nếu có booking với trạng thái IN_USE, CHECKOUT_SOON hoặc OVERDUE
            const activeBooking = room.bookings?.find(booking => 
                booking.roomStatusInBooking === 'IN_USE' || 
                booking.roomStatusInBooking === 'CHECKOUT_SOON' || 
                booking.roomStatusInBooking === 'OVERDUE'
            );
            
            // Hiển thị dialog tương ứng dựa trên trạng thái booking
            if (activeBooking) {
                // Phòng đang sử dụng - Hiển thị dialog chi tiết phòng
                console.log('Opening RoomDetailsDialog for occupied room with booking:', activeBooking);
                setRoomDetailsDialogOpen(true);
            } else {
                // Kiểm tra thời gian hệ thống và thời gian nhận phòng 
                // nếu có booking.roomStatusInBooking === 'UPCOMING'
                const upcomingBooking = room.bookings?.find(booking => booking.roomStatusInBooking === 'UPCOMING');
                
                if (upcomingBooking) {
                    // Lấy thời gian hiện tại
                    const now = new Date();
                    
                    // Lấy thời gian nhận phòng từ booking
                    const checkinTime = upcomingBooking.checkinTime && Array.isArray(upcomingBooking.checkinTime) 
                        ? new Date(
                            upcomingBooking.checkinTime[0], 
                            upcomingBooking.checkinTime[1] - 1, 
                            upcomingBooking.checkinTime[2],
                            upcomingBooking.checkinTime[3] || 0,
                            upcomingBooking.checkinTime[4] || 0
                        ) : null;
                    
                    if (checkinTime) {
                        // Tính thời gian chênh lệch (ms)
                        const timeDiff = checkinTime - now; // Thời gian đến lúc check-in
                        
                        // Chuyển đổi sang giờ (1 giờ = 60 * 60 * 1000 ms)
                        const oneHourInMs = 60 * 60 * 1000;
                        
                        // Tính thời gian 1 giờ sau thời gian hiện tại
                        const oneHourAfterNow = new Date(now.getTime() + oneHourInMs);
                        
                        if (timeDiff > 0 && timeDiff < oneHourInMs) {
                            // Thời gian hiện tại nhỏ hơn thời gian check-in khoảng 1 tiếng
                            console.log('Cannot book or check-in: less than 1 hour before scheduled check-in time');
                            // Hiển thị thông báo bằng dialog thay vì alert
                            setWarningMessage('Không thể đặt phòng hoặc nhận phòng khi thời gian hiện tại ít hơn 1 giờ trước thời gian nhận phòng đã lên lịch.');
                            setWarningDialogOpen(true);
                            return; // Ngừng xử lý, không mở dialog
                        } else if (timeDiff <= 0 && checkinTime >= new Date(now.getTime() - oneHourInMs)) {
                            // Thời gian check-in đã đến hoặc đã qua, nhưng vẫn trong khoảng 1 giờ gần nhất
                            console.log('Opening BookingDialog for check-in within the past hour');
                            setBookingDialogOpen(true);
                            return;
                        } else if (timeDiff <= 5 * 60 * 1000 && timeDiff >= 0) {
                            // Thời gian chênh lệch <= 5 phút, mở dialog để checkin
                            console.log('Opening QuickBookingDialog for check-in within 5 minutes');
                            setQuickBookingDialogOpen(true);
                        } else {
                            // Thời gian chênh lệch > 5 phút hoặc đã qua thời gian check-in, mở dialog để đặt phòng
                            console.log('Opening QuickBookingDialog for any room state');
                            setQuickBookingDialogOpen(true);
                        }
                    } else {
                        console.log('Invalid checkin time format, opening QuickBookingDialog');
                        setQuickBookingDialogOpen(true);
                    }
                } else {
                    // Tất cả các loại phòng khác - Hiển thị dialog đặt phòng nhanh
                    console.log('Opening QuickBookingDialog for any room state');
                    setQuickBookingDialogOpen(true);
                }
            }
        } catch (err) {
            console.error('Lỗi xử lý phòng:', err);
        }
    };

    // Làm mới dữ liệu phòng từ API
    const refreshRoomData = async () => {
        try {
            const res = await RoomBookingService.getAllRoomsWithBookingDetails();
            const roomData = res.content || [];
            if (roomData.length > 0) {
                setRooms(roomData);
                setAllRooms(roomData);
            }
        } catch (error) {
            console.error('Error refreshing room data:', error);
        }
    };

    // Đóng dialog chi tiết phòng
    const handleRoomDetailsDialogClose = () => {
        setRoomDetailsDialogOpen(false);
        refreshRoomData(); // Làm mới dữ liệu phòng sau khi đóng dialog
    };

    // Đóng dialog đặt phòng nhanh
    const handleQuickBookingDialogClose = () => {
        setQuickBookingDialogOpen(false);
        refreshRoomData(); // Làm mới dữ liệu phòng sau khi đóng dialog
    };

    // Đóng dialog đặt phòng
    const handleBookingDialogClose = () => {
        setBookingDialogOpen(false);
        refreshRoomData(); // Làm mới dữ liệu phòng sau khi đóng dialog
    };

    // Function to get background color based on room status
    const getRoomBackgroundColor = (status) => {
        switch (status) {
            case 'IN_USE': return '#E8F5E9'; // Light green for rooms in use
            case 'CHECKOUT_SOON': return '#E3F2FD'; // Light blue for rooms soon to checkout
            case 'OVERDUE': return '#E1F5FE'; // Light cyan for overdue rooms
            case 'UPCOMING': return '#FFF8E1'; // Light amber for upcoming bookings
            case 'AVAILABLE': return '#FFFFFF'; // White for available rooms
            case 'MAINTENANCE': return '#FFEBEE'; // Light red for maintenance rooms
            default: return '#FFFFFF';
        }
    };

    // Xử lý khi click vào thông tin đặt phòng sắp tới
    const handleBookingsClick = (event, room) => {
        event.stopPropagation(); // Ngăn không cho sự kiện lan tỏa lên card phòng
        console.log('Booking info clicked for room:', room.id);
        
        if (room.bookings && room.bookings.length > 0) {
            setSelectedRoom(room);
            setBookingListDialogOpen(true);
        }
    };

    // Đóng dialog danh sách đặt phòng
    const handleBookingListDialogClose = () => {
        setBookingListDialogOpen(false);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 0.9,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2,
                }}
            >
                <ViewModeButtons viewMode="Danh sách" onViewModeChange={onViewModeChange} />
                <SearchBar
                    searchValue={searchValue}
                    onSearchChange={handleSearchChange}
                    anchorEl={anchorElSearch}
                    onSearchClick={handleSearchClick}
                    onSearchClose={handleSearchClose}
                />
                <ActionButtons
                    onFilterOpen={onFilterOpen}
                    anchorElPriceTable={anchorElPriceTable}
                    onPriceTableClick={handlePriceTableClick}
                    onPriceTableClose={handlePriceTableClose}
                    onBookingOpen={onBookingOpen}
                />
            </Box>

            <Box
                sx={{
                    mt: 1,
                    p: 2,
                    backgroundColor: '#FFF8E1',
                    borderRadius: 2,
                    height: 600,
                    overflowY: 'auto',
                }}
            >
                {/* Luôn hiển thị StatusBar, bất kể có phòng hay không */}
                <StatusBar
                    statusCounts={statusCounts}
                    variant="list"
                    onStatusFilter={handleStatusFilter}
                    totalRooms={allRooms.length}
                    activeFilter={activeFilter}
                />
                
                {rooms.length > 0 ? (
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label="booking table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Mã đặt phòng</TableCell>
                                    <TableCell>Mã kênh bán</TableCell>
                                    <TableCell>Phòng</TableCell>
                                    <TableCell>Khách đặt</TableCell>
                                    <TableCell>Giờ nhận</TableCell>
                                    <TableCell>Giờ trả</TableCell>
                                    <TableCell>Tổng cộng</TableCell>
                                    <TableCell>Khách đã trả</TableCell>
                                    <TableCell>Thao tác</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rooms.map((room, index) => {
                                    const bookingData = getBookingData(room, index);
                                    return (
                                        <TableRow 
                                            key={room.id} 
                                            hover
                                            onClick={() => handleRoomCardClick(room)}
                                            sx={{ 
                                                cursor: 'pointer',
                                                backgroundColor: getRoomBackgroundColor(room.status)
                                            }}
                                        >
                                            <TableCell>{bookingData.stt}</TableCell>
                                            <TableCell>{bookingData.bookingCode}</TableCell>
                                            <TableCell>{bookingData.channelCode}</TableCell>
                                            <TableCell>{bookingData.room}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'pre-line' }}>
                                                {bookingData.customer}
                                                {bookingData.bookingCount > 0 && (
                                                    <Box sx={{
                                                        display: 'inline-block',
                                                        backgroundColor: '#FFD700', 
                                                        borderRadius: '50%', 
                                                        width: 20, 
                                                        height: 20, 
                                                        fontSize: '0.75rem',
                                                        textAlign: 'center', 
                                                        lineHeight: '20px',
                                                        ml: 1,
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={(e) => handleBookingsClick(e, room)}>
                                                        {bookingData.bookingCount}
                                                    </Box>
                                                )}
                                            </TableCell>
                                            <TableCell>{bookingData.checkInTime}</TableCell>
                                            <TableCell>{bookingData.checkOutTime}</TableCell>
                                            <TableCell>{bookingData.total}đ</TableCell>
                                            <TableCell>{bookingData.paid}đ</TableCell>
                                            <TableCell onClick={(e) => e.stopPropagation()}>{bookingData.action}</TableCell>
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={(e) => handleRoomMenuClick(e, room)}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100% - 60px)', mt: 2 }}>
                        <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                            Không có phòng nào khớp với bộ lọc đã chọn. <br />
                            Vui lòng chọn bộ lọc khác hoặc nhấn vào "Tất cả" để xem tất cả phòng.
                        </Typography>
                    </Box>
                )}
            </Box>
            
            {/* Room action menu */}
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleToggleCleanStatus}>
                    {menuRoom?.isClean ? 'Đánh dấu chưa dọn' : 'Đánh dấu đã dọn'}
                </MenuItem>
            </Menu>
            
            {/* Dialog chi tiết phòng cho phòng đang sử dụng */}
            <RoomDetailsDialog
                open={roomDetailsDialogOpen}
                onClose={handleRoomDetailsDialogClose}
                roomData={selectedRoom && {
                    roomNumber: `P.${selectedRoom?.id?.toString().padStart(3, '0') || '000'}`,
                    roomType: selectedRoom?.roomCategory?.name || selectedRoom?.roomCategoryName || 'Phòng tiêu chuẩn',
                    status: selectedRoom?.status,
                    isClean: selectedRoom?.isClean,
                    customerType: 'Khách lẻ',
                    guestInfo: '0 người lớn, 0 trẻ em, 0 giấy tờ',
                    bookingId: `DP${selectedRoom?.id?.toString().padStart(6, '0') || '000000'}`,
                    checkIn: selectedRoom?.startDate ? 
                        new Date(selectedRoom.startDate[0], selectedRoom.startDate[1] - 1, selectedRoom.startDate[2]).toLocaleDateString('vi-VN') + ', 12:00' : '',
                    checkOut: selectedRoom?.checkInDuration && selectedRoom?.startDate ? 
                        new Date(selectedRoom.startDate[0], selectedRoom.startDate[1] - 1, selectedRoom.startDate[2] + selectedRoom.checkInDuration).toLocaleDateString('vi-VN') + ', 12:00' : '',
                    stayDuration: `${selectedRoom?.checkInDuration || 0} ngày`,
                    timeUsed: 'Đã sử dụng: 0 giờ 0 phút',
                    price: selectedRoom?.roomCategory?.dailyPrice?.toLocaleString('vi-VN') || '0',
                    amountPaid: '0',
                    notes: selectedRoom?.note || 'Chưa có ghi chú',
                    // Truyền thông tin bookings cho component
                    bookings: selectedRoom?.bookings || []
                }}
            />

            {/* Dialog đặt phòng nhanh cho phòng trống */}
            <QuickBookingDialog
                open={quickBookingDialogOpen}
                onClose={handleQuickBookingDialogClose}
                initialRoomData={selectedRoom}
            />
            
            {/* Dialog hiển thị danh sách đặt phòng */}
            <BookingListDialog
                open={bookingListDialogOpen}
                onClose={handleBookingListDialogClose}
                roomData={selectedRoom && {
                    roomNumber: `P.${selectedRoom?.id?.toString().padStart(3, '0') || '000'}`,
                    roomType: selectedRoom?.roomCategory?.name || selectedRoom?.roomCategoryName || 'Phòng tiêu chuẩn',
                    status: selectedRoom?.status,
                    isClean: selectedRoom?.isClean,
                }}
                bookings={selectedRoom?.bookings || []}
            />
            
            {/* Dialog cảnh báo */}
            <Dialog
                open={warningDialogOpen}
                onClose={() => setWarningDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Không thể đặt phòng"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {warningMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setWarningDialogOpen(false)} autoFocus>
                        Đã hiểu
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Dialog đặt phòng khi thời gian check-in đã đến hoặc qua trong vòng 1 giờ */}
            <BookingDialog 
                open={bookingDialogOpen}
                onClose={handleBookingDialogClose}
                roomData={selectedRoom}
            />
        </Box>
    );
}