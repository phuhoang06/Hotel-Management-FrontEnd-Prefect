import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchBar from './SearchBar';
import ViewModeButtons from './ViewModeButtons';
import ActionButtons from './ActionButtons';
import { StatusBar } from './StatusBar';
import RoomBookingService from "../../../service/roomBooking.service.js";
import QuickBookingDialog from './QuickBookingDialog';
import RoomDetailsDialog from './RoomDetailsDialog';
import BookingListDialog from './BookingListDialog';

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

    // Xử lý khi click vào hàng trong bảng phòng
    const handleRoomRowClick = async (room) => {
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
                {rooms.length > 0 ? (
                    <>
                        <StatusBar
                            statusCounts={statusCounts}
                            variant="list"
                            onStatusFilter={handleStatusFilter}
                            totalRooms={allRooms.length}
                            activeFilter={activeFilter}
                        />
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
                                                onClick={() => handleRoomRowClick(room)}
                                                sx={{ 
                                                    cursor: 'pointer',
                                                    backgroundColor: getRoomBackgroundColor(room.status),
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5'
                                                    }
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