import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, IconButton, Menu, MenuItem } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchBar from './SearchBar';
import ViewModeButtons from './ViewModeButtons';
import ActionButtons from './ActionButtons';
import { StatusBar } from './StatusBar';
import RoomBookingService from "../../../service/roomBooking.service.js";
import RoomDetailsDialog from './RoomDetailsDialog';
import QuickBookingDialog from './QuickBookingDialog';
import BookingListDialog from './BookingListDialog';

export default function SchematicView({ onBookingOpen, onFilterOpen, onViewModeChange }) {
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
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [menuRoom, setMenuRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, [isLoading]);

    // cap nhat lai loading
    const handleUpdateLoading = () => {
        setIsLoading(!isLoading);
    }


    const fetchRooms = async () => {
        try {
            const res = await RoomBookingService.getAllRoomsWithBookingDetails();
            const roomData = res.content || [];
            console.log(roomData);
            if (roomData.length > 0) {
                setRooms(roomData);
                setAllRooms(roomData);
            } else {
                setRooms([]);
                setAllRooms([]);
            }
        } catch (err) {
            console.error('Không thể tải danh sách phòng từ API, sử dụng dữ liệu ảo:', err);
            setRooms([]);
            setAllRooms([]);
        }
    };

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

    const getStatusLabelAndColor = (status, isClean) => {
        if (status === 'CHECKOUT_SOON') {
            return { label: 'Chưa dọn', textColor: '#FF6F61' }; // Màu đỏ nhạt cho chữ
        }
        return {
            label: isClean ? 'Đã dọn' : 'Chưa dọn',
            textColor: isClean ? '#66BB6A' : '#FF6F61', // Xanh nhạt (đã dọn) hoặc đỏ nhạt (chưa dọn)
        };
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
                        const timeDiff = Math.abs(now - checkinTime);
                        
                        // Chuyển đổi sang phút (5 phút = 5 * 60 * 1000 ms)
                        const fiveMinutesInMs = 5 * 60 * 1000;
                        
                        if (timeDiff <= fiveMinutesInMs) {
                            // Thời gian chênh lệch <= 5 phút, mở dialog để checkin
                            console.log('Opening QuickBookingDialog for check-in within 5 minutes');
                            setQuickBookingDialogOpen(true);
                        } else {
                            // Thời gian chênh lệch > 5 phút, mở dialog để đặt phòng
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

    // Xử lý khi click vào phần đặt phòng sắp tới hoặc nhãn đặt trước
    const handleBookingsClick = (event, room) => {
        event.stopPropagation(); // Ngăn không cho sự kiện lan tỏa lên card phòng
        console.log('Booking info clicked for room:', room.id);
        
        const upcomingBookings = room.bookings ? room.bookings.filter(booking => booking.roomStatusInBooking === 'UPCOMING') : [];
        if (upcomingBookings.length > 0) {
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
                <ViewModeButtons viewMode="Sơ đồ" onViewModeChange={onViewModeChange} />
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
                    backgroundColor: '#f0f1f3',
                    borderRadius: 2,
                    height: 600,
                    overflowY: 'auto',
                }}
            >
                <StatusBar
                    statusCounts={statusCounts}
                    variant="schematic"
                    onStatusFilter={handleStatusFilter}
                    totalRooms={allRooms.length}
                    activeFilter={activeFilter}
                />
                {rooms.length > 0 ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2, mt: 2 }}>
                        {rooms.map((room) => {
                            const statusInfo = getStatusLabelAndColor(room.status, room.isClean);
                            const roomCategory = room.roomCategory || {};
                            
                            // Kiểm tra xem card có thể click được hay không
                            const hasActiveBooking = room.bookings?.find(booking => 
                                booking.roomStatusInBooking === 'IN_USE' || 
                                booking.roomStatusInBooking === 'CHECKOUT_SOON' ||
                                booking.roomStatusInBooking === 'OVERDUE'
                            );
                            
                            const hasUpcomingBooking = room.bookings?.find(booking => 
                                booking.roomStatusInBooking === 'UPCOMING'
                            );
                            
                            const isClickable = hasActiveBooking || 
                                              hasUpcomingBooking || 
                                              (room.status === 'AVAILABLE' && room.isClean);
                            
                            // Console.log để debug
                            console.log(`Room ${room.id}: status=${room.status}, isClean=${room.isClean}, clickable=${isClickable}`);
                            
                            return (
                                <Card
                                    key={room.id}
                                    sx={{
                                        borderRadius: 4,
                                        position: 'relative',
                                        backgroundColor: getRoomBackgroundColor(room.status),
                                        color: 'inherit',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid #e0e0e0',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                                            transform: 'translateY(-3px)',
                                            transition: 'all 0.3s ease'
                                        }
                                    }}
                                    onClick={() => {
                                        console.log(`Card clicked: Room ${room.id}`);
                                        handleRoomCardClick(room);
                                    }}
                                >
                                    <CardContent sx={{ p: 1.5 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Chip
                                                label={statusInfo.label}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'rgba(90,90,90,0.16)',
                                                    color: statusInfo.textColor,
                                                    fontWeight: 'bold',
                                                }}
                                            />
                                            {room.bookings && room.bookings.filter(booking => booking.roomStatusInBooking === 'UPCOMING').length > 0 && (
                                                <Chip
                                                    label={`Đặt trước: ${room.bookings.filter(booking => booking.roomStatusInBooking === 'UPCOMING').length}`}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: '#FFD700',
                                                        color: '#333',
                                                        fontWeight: 'bold',
                                                        marginRight: 1,
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={(e) => handleBookingsClick(e, room)}
                                                />
                                            )}
                                            <IconButton 
                                                size="small" 
                                                sx={{ color: 'inherit' }}
                                                onClick={(e) => handleRoomMenuClick(e, room)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Box>
                                        <Box sx={{ mb: 1 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    textAlign: 'left',
                                                    color: 'inherit',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.2rem',
                                                }}
                                            >
                                                {room.roomCategory?.code || `P${room.id.toString().padStart(3, '0')}`}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 1,
                                                color: '#757575',
                                                fontSize: '0.9rem',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {room.roomCategory?.name || room.roomCategoryName || 'Không có loại phòng'}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 2,
                                                color: '#757575',
                                                fontSize: '0.8rem',
                                                fontStyle: 'italic',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {room.roomCategory?.description || room.note || 'Không có mô tả'}
                                        </Typography>
                                        
                                        {/* Hiển thị thông báo khi có booking đang sử dụng (IN_USE) */}
                                        {room.bookings && room.bookings.find(booking => booking.roomStatusInBooking === 'IN_USE') && (
                                            <Box
                                                sx={{
                                                    mb: 1,
                                                    p: 1,
                                                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                    borderRadius: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#4caf50',
                                                        fontWeight: 'medium',
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    Phòng đang được sử dụng. Nhấn để xem chi tiết và thực hiện trả phòng.
                                                </Typography>
                                            </Box>
                                        )}
                                        
                                        {/* Hiển thị thông báo khi có booking sắp trả (CHECKOUT_SOON) */}
                                        {room.bookings && room.bookings.find(booking => booking.roomStatusInBooking === 'CHECKOUT_SOON') && (
                                            <Box
                                                sx={{
                                                    mb: 1,
                                                    p: 1,
                                                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                                    borderRadius: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#2196f3',
                                                        fontWeight: 'medium',
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    Phòng sắp đến giờ trả. Nhấn để xem chi tiết và thực hiện thanh toán.
                                                </Typography>
                                            </Box>
                                        )}
                                        
                                        {/* Hiển thị thông báo khi có booking quá hạn (OVERDUE) */}
                                        {room.bookings && room.bookings.find(booking => booking.roomStatusInBooking === 'OVERDUE') && (
                                            <Box
                                                sx={{
                                                    mb: 1,
                                                    p: 1,
                                                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                                    borderRadius: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#f44336',
                                                        fontWeight: 'medium',
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    Phòng đã quá hạn trả. Nhấn để xem chi tiết và thực hiện thanh toán ngay.
                                                </Typography>
                                            </Box>
                                        )}
                                        
                                        {/* Hiển thị lịch đặt phòng sắp tới nếu có */}
                                        {room.bookings && room.bookings.filter(booking => booking.roomStatusInBooking === 'UPCOMING').length > 0 && (
                                            <Box 
                                                sx={{ 
                                                    mb: 1, 
                                                    p: 1, 
                                                    backgroundColor: 'rgba(255, 215, 0, 0.1)', 
                                                    borderRadius: 1,
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 215, 0, 0.2)',
                                                    }
                                                }}
                                                onClick={(e) => handleBookingsClick(e, room)}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    Đặt phòng sắp tới:
                                                </Typography>
                                                {room.bookings.filter(booking => booking.roomStatusInBooking === 'UPCOMING').slice(0, 1).map((booking, idx) => {
                                                    // Định dạng thời gian checkin
                                                    const checkinTime = booking.checkinTime && Array.isArray(booking.checkinTime) 
                                                        ? new Date(
                                                            booking.checkinTime[0], 
                                                            booking.checkinTime[1] - 1, 
                                                            booking.checkinTime[2],
                                                            booking.checkinTime[3] || 0,
                                                            booking.checkinTime[4] || 0
                                                        ).toLocaleString('vi-VN')
                                                        : 'Chưa rõ';
                                                    
                                                    return (
                                                        <Typography
                                                            key={idx}
                                                            variant="body2"
                                                            sx={{
                                                                fontSize: '0.75rem',
                                                                color: '#555',
                                                            }}
                                                        >
                                                            Ngày nhận: {checkinTime}
                                                        </Typography>
                                                    );
                                                })}
                                                {room.bookings.filter(booking => booking.roomStatusInBooking === 'UPCOMING').length > 1 && (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: '0.75rem',
                                                            fontStyle: 'italic'
                                                        }}
                                                    >
                                                        ... và {room.bookings.filter(booking => booking.roomStatusInBooking === 'UPCOMING').length - 1} đặt phòng khác
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                        
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <AccessTimeIcon fontSize="small" sx={{ color: 'inherit' }} />
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: 'inherit', fontSize: '0.9rem' }}
                                                >
                                                    {room.roomCategory?.hourlyPrice?.toLocaleString('vi-VN', { style: 'decimal' }) || '0'}đ
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <WbSunnyIcon fontSize="small" sx={{ color: 'inherit' }} />
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: 'inherit', fontSize: '0.9rem' }}
                                                >
                                                    {room.roomCategory?.dailyPrice?.toLocaleString('vi-VN', { style: 'decimal' }) || '0'}đ
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Brightness2Icon fontSize="small" sx={{ color: 'inherit' }} />
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: 'inherit', fontSize: '0.9rem' }}
                                                >
                                                    {room.roomCategory?.overnightPrice?.toLocaleString('vi-VN', { style: 'decimal' }) || '0'}đ
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
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
                    bookings: selectedRoom?.bookings || []
                }}
            />

            {/* Dialog đặt phòng nhanh cho phòng trống */}
            <QuickBookingDialog
                handleUpdateLoading = {handleUpdateLoading}
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
                bookings={selectedRoom?.bookings ? selectedRoom.bookings.filter(booking => booking.roomStatusInBooking === 'UPCOMING') : []}
            />
        </Box>
    );
}