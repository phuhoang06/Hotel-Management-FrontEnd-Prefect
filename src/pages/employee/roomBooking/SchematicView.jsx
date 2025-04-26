import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, IconButton } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchBar from './SearchBar';
import ViewModeButtons from './ViewModeButtons';
import ActionButtons from './ActionButtons';
import { StatusBar } from './StatusBar';
import RoomViewService from "../../../service/admin/room.service.js";
import RoomDetailsDialog from './RoomDetailsDialog';
import QuickBookingDialog from './QuickBookingDialog';



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

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await RoomViewService.getAllRoomView();
                const roomData = res.data.content || [];
                if (roomData.length > 0) {
                    setRooms(roomData);
                    setAllRooms(roomData);
                } else {
                    setRooms(mockRooms);
                    setAllRooms(mockRooms);
                }
            } catch (err) {
                console.error('Không thể tải danh sách phòng từ API, sử dụng dữ liệu ảo:', err);
                setRooms(mockRooms);
                setAllRooms(mockRooms);
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

    const getRoomBackgroundColor = (status) => {
        switch (status) {
            case 'IN_USE': return '#279656';
            case 'CHECKOUT_SOON': return '#FFFFFF';
            case 'AVAILABLE': return '#FFFFFF';
            default: return '#FFFFFF';
        }
    };

    const handleStatusFilter = (status) => {
        try {
            setActiveFilter(status);
            if (status === 'ALL') {
                setRooms(allRooms);
            } else {
                const filteredRooms = allRooms.filter(room => room.status === status);
                setRooms(filteredRooms);
            }
        } catch (error) {
            console.error('Lỗi khi lọc phòng từ API, sử dụng dữ liệu ảo:', error);
            setActiveFilter(status);
            if (status === 'ALL') {
                setRooms(allRooms);
            } else {
                const filteredRooms = allRooms.filter(room => room.status === status);
                setRooms(filteredRooms);
            }
        }
    };

    const statusCounts = getRoomStatusCounts();

    // Xử lý khi click vào card phòng
    const handleRoomCardClick = async (room) => {
        if (!room) {
            console.error('Room data is undefined');
            return;
        }
        
        console.log('Room clicked:', room);
        console.log('Room status:', room.status);
        console.log('Room isClean:', room.isClean);
        
        try {
            // Cố gắng lấy thông tin chi tiết phòng mới nhất từ API
            const res = await RoomViewService.getRoomById(room.id);
            if (res.data && res.data.content) {
                console.log('API response:', res.data.content);
                setSelectedRoom(res.data.content);
            } else {
                console.log('Using existing room data');
                setSelectedRoom(room);
            }
        } catch (err) {
            console.error('Không thể lấy thông tin chi tiết phòng, sử dụng dữ liệu hiện có:', err);
            setSelectedRoom(room);
        }
        
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
                            const backgroundColor = getRoomBackgroundColor(room.status);
                            const roomCategory = room.roomCategory || {};
                            
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
                                        borderRadius: 4,
                                        position: 'relative',
                                        backgroundColor: backgroundColor,
                                        color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF',
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
                                            <IconButton 
                                                size="small" 
                                                sx={{ color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF' }}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Ngăn sự kiện click lan tỏa đến card
                                                }}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Box>
                                        <Box sx={{ mb: 1 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    textAlign: 'left',
                                                    color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.2rem',
                                                }}
                                            >
                                                {roomCategory.code || 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 1,
                                                color: backgroundColor === '#FFFFFF' ? '#757575' : '#FFFFFF',
                                                fontSize: '0.9rem',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {roomCategory.name || 'Không có loại phòng'}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 2,
                                                color: backgroundColor === '#FFFFFF' ? '#757575' : '#FFFFFF',
                                                fontSize: '0.8rem',
                                                fontStyle: 'italic',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {roomCategory.description || 'Không có mô tả'}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <AccessTimeIcon fontSize="small" sx={{ color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF' }} />
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF', fontSize: '0.9rem' }}
                                                >
                                                    {roomCategory.hourlyPrice?.toLocaleString('vi-VN', { style: 'decimal' }) || '0'}đ
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <WbSunnyIcon fontSize="small" sx={{ color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF' }} />
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF', fontSize: '0.9rem' }}
                                                >
                                                    {roomCategory.dailyPrice?.toLocaleString('vi-VN', { style: 'decimal' }) || '0'}đ
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Brightness2Icon fontSize="small" sx={{ color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF' }} />
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF', fontSize: '0.9rem' }}
                                                >
                                                    {roomCategory.overnightPrice?.toLocaleString('vi-VN', { style: 'decimal' }) || '0'}đ
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100% - 40px)', mt: 2 }}>
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
            />
        </Box>
    );
}