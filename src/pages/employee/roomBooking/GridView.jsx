import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, IconButton, Button, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchBar from './SearchBar';
import ViewModeButtons from './ViewModeButtons';
import ActionButtons from './ActionButtons';
import { StatusBar } from './StatusBar';
import RoomBookingService from "../../../service/roomBooking.service.js";
import RoomDetailsDialog from './RoomDetailsDialog';
import QuickBookingDialog from './QuickBookingDialog';
import BookingListDialog from './BookingListDialog';

export default function GridView({ onBookingOpen, onFilterOpen, onViewModeChange }) {
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

    const getStatusLabelAndColor = (status, isClean) => {
        if (status === 'CHECKOUT_SOON') {
            return { label: 'Chưa dọn', color: 'error' };
        }
        return { label: isClean ? 'Đã dọn' : 'Chưa dọn', color: isClean ? 'success' : 'error' };
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

        allRooms.forEach((room) => {
            switch (room.status) {
                case 'AVAILABLE': counts.available += 1; break;
                case 'UPCOMING': counts.soonCheckIn += 1; break;
                case 'IN_USE': counts.inUse += 1; break;
                case 'CHECKOUT_SOON': counts.soonCheckOut += 1; break;
                case 'MAINTENANCE': counts.maintenance += 1; break;
                case 'OVERDUE': counts.overdue += 1; break;
                default: break;
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

    const handleStatusFilter = async (status) => {
        try {
            setActiveFilter(status);
            if (status === 'ALL') {
                setRooms(allRooms);
            } else {
                const response = await RoomBookingService.searchRoomsWithBookingDetails({ status });
                const roomData = response.content || [];
                setRooms(roomData);
            }
        } catch (error) {
            console.error('Error filtering rooms:', error);
        }
    };

    const statusCounts = getRoomStatusCounts();

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
            
            // Hiển thị dialog tương ứng dựa trên trạng thái phòng
            if (room.status === 'IN_USE' || room.status === 'CHECKOUT_SOON' || room.status === 'OVERDUE') {
                // Phòng đang sử dụng - Hiển thị dialog chi tiết phòng
                console.log('Opening RoomDetailsDialog for occupied room');
                setRoomDetailsDialogOpen(true);
            } else {
                // Tất cả các loại phòng khác - Hiển thị dialog đặt phòng nhanh
                // Bao gồm: phòng trống đã dọn, phòng trống chưa dọn, phòng bảo trì, phòng sắp có khách
                console.log('Opening QuickBookingDialog for any room state');
                setQuickBookingDialogOpen(true);
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
                <ViewModeButtons viewMode="Lưới" onViewModeChange={onViewModeChange} />
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
                    backgroundColor: '#E8F5E9',
                    borderRadius: 2,
                    height: 600,
                    overflowY: 'auto',
                }}
            >
                {rooms.length > 0 ? (
                    <>
                        <StatusBar
                            statusCounts={statusCounts}
                            variant="grid"
                            onStatusFilter={handleStatusFilter}
                            totalRooms={allRooms.length}
                            activeFilter={activeFilter}
                        />
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
                            {rooms.map((room, index) => {
                                const bookingData = getBookingData(room, index);
                                const statusInfo = getStatusLabelAndColor(room.status, room.isClean);
                                
                                // Kiểm tra xem card có thể click được hay không
                                const isClickable = room.status === 'IN_USE' || 
                                                  room.status === 'CHECKOUT_SOON' || 
                                                  room.status === 'OVERDUE' ||
                                                  (room.status === 'AVAILABLE' && room.isClean);
                                
                                // Console.log để debug
                                console.log(`Room ${room.id}: status=${room.status}, isClean=${room.isClean}, clickable=${isClickable}`);
                                
                                return (
                                    <Card 
                                        key={room.id} 
                                        sx={{ 
                                            borderRadius: 2, 
                                            position: 'relative',
                                            cursor: 'pointer',
                                            backgroundColor: getRoomBackgroundColor(room.status),
                                            '&:hover': {
                                                boxShadow: 6
                                            }
                                        }}
                                        onClick={() => {
                                            console.log(`Card clicked: Room ${room.id}`);
                                            handleRoomCardClick(room);
                                        }}
                                    >
                                        <CardContent sx={{ p: 1.5 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Chip label={statusInfo.label} color={statusInfo.color} size="small" />
                                                <IconButton 
                                                    size="small" 
                                                    onClick={(e) => handleRoomMenuClick(e, room)}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </Box>
                                            <Box sx={{ mb: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Mã đặt phòng: {bookingData.bookingCode}</Typography>
                                                <Typography variant="body2">Phòng: {bookingData.room}</Typography>
                                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                                    Khách đặt: {bookingData.customer}
                                                    {bookingData.bookingCount > 0 && (
                                                        <Chip
                                                            label={`${bookingData.bookingCount} đặt trước`}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#FFD700',
                                                                color: '#333',
                                                                ml: 1,
                                                                height: 16,
                                                                fontSize: '0.7rem',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={(e) => handleBookingsClick(e, room)}
                                                        />
                                                    )}
                                                </Typography>
                                                <Typography variant="body2">Giờ nhận: {bookingData.checkInTime}</Typography>
                                                <Typography variant="body2">Giờ trả: {bookingData.checkOutTime}</Typography>
                                                <Typography variant="body2">Tổng cộng: {bookingData.total}đ</Typography>
                                                <Typography variant="body2">Khách đã trả: {bookingData.paid}đ</Typography>
                                            </Box>
                                            <Box 
                                                sx={{ display: 'flex', justifyContent: 'flex-end' }}
                                                onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan tỏa
                                            >
                                                {bookingData.action}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Typography variant="body1">Không có dữ liệu phòng để hiển thị.</Typography>
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
        </Box>
    );
}