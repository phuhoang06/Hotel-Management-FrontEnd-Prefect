import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography } from '@mui/material';
import SearchBar from './SearchBar';
import ViewModeButtons from './ViewModeButtons';
import ActionButtons from './ActionButtons';
import { StatusBar } from './StatusBar';
import RoomViewService from "../../../service/admin/room.service.js";
import QuickBookingDialog from './QuickBookingDialog';
import RoomDetailsDialog from './RoomDetailsDialog';

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

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await RoomViewService.getAllRoomView();
                const roomData = res.data.content || [];
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
        const checkInTime = room.startDate
            ? new Date(room.startDate[0], room.startDate[1] - 1, room.startDate[2]).toLocaleDateString('vi-VN')
            : '';
        const checkOutTime = room.checkInDuration && room.startDate
            ? new Date(
                room.startDate[0],
                room.startDate[1] - 1,
                room.startDate[2] + room.checkInDuration
            ).toLocaleDateString('vi-VN')
            : '';

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
                const response = await RoomViewService.searchRoomView({ status });
                const roomData = response.data.content || [];
                setRooms(roomData);
            }
        } catch (error) {
            console.error('Error filtering rooms:', error);
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
            const res = await RoomViewService.getAllRoomView();
            const roomData = res.data.content || [];
            if (roomData.length > 0) {
                setRooms(roomData);
                setAllRooms(roomData);
            }
        } catch (err) {
            console.error('Không thể làm mới danh sách phòng:', err);
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
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5'
                                                    }
                                                }}
                                            >
                                                <TableCell>{bookingData.stt}</TableCell>
                                                <TableCell>{bookingData.bookingCode}</TableCell>
                                                <TableCell>{bookingData.channelCode}</TableCell>
                                                <TableCell>{bookingData.room}</TableCell>
                                                <TableCell sx={{ whiteSpace: 'pre-line' }}>{bookingData.customer}</TableCell>
                                                <TableCell>{bookingData.checkInTime}</TableCell>
                                                <TableCell>{bookingData.checkOutTime}</TableCell>
                                                <TableCell>{bookingData.total}đ</TableCell>
                                                <TableCell>{bookingData.paid}đ</TableCell>
                                                <TableCell onClick={(e) => e.stopPropagation()}>{bookingData.action}</TableCell>
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
            
            {/* Dialog chi tiết phòng cho phòng đang sử dụng */}
            <RoomDetailsDialog
                open={roomDetailsDialogOpen}
                onClose={handleRoomDetailsDialogClose}
                roomData={selectedRoom && {
                    roomNumber: `P.${selectedRoom?.id?.toString().padStart(3, '0') || '000'}`,
                    roomType: selectedRoom?.roomCategory?.name || 'Phòng tiêu chuẩn',
                    status: 'Đang sử dụng',
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
                    notes: 'Chưa có ghi chú'
                }}
            />

            {/* Dialog đặt phòng nhanh cho phòng trống */}
            <QuickBookingDialog
                open={quickBookingDialogOpen}
                onClose={handleQuickBookingDialogClose}
                initialRoomData={selectedRoom}
            />
        </Box>
    );
}