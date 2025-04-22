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

// Dữ liệu ảo
const mockRooms = [
    {
        id: 1,
        status: "AVAILABLE",
        isClean: true,
        roomCategory: {
            code: "VIP01",
            name: "Phòng VIP 1",
            description: "Phòng sang trọng, view đẹp",
            hourlyPrice: 200000,
            dailyPrice: 1000000,
            overnightPrice: 800000,
        },
        startDate: [2025, 4, 21],
        checkInDuration: 2,
    },
    {
        id: 2,
        status: "IN_USE",
        isClean: false,
        roomCategory: {
            code: "STD01",
            name: "Phòng Tiêu Chuẩn 1",
            description: "Phòng tiêu chuẩn, đầy đủ tiện nghi",
            hourlyPrice: 150000,
            dailyPrice: 600000,
            overnightPrice: 500000,
        },
        startDate: [2025, 4, 20],
        checkInDuration: 1,
    },
    {
        id: 3,
        status: "CHECKOUT_SOON",
        isClean: false,
        roomCategory: {
            code: "VIP02",
            name: "Phòng VIP 2",
            description: "Phòng VIP, có bồn tắm",
            hourlyPrice: 250000,
            dailyPrice: 1200000,
            overnightPrice: 900000,
        },
        startDate: [2025, 4, 19],
        checkInDuration: 2,
    },
    {
        id: 4,
        status: "UPCOMING",
        isClean: true,
        roomCategory: {
            code: "STD02",
            name: "Phòng Tiêu Chuẩn 2",
            description: "Phòng tiêu chuẩn, giá rẻ",
            hourlyPrice: 120000,
            dailyPrice: 500000,
            overnightPrice: 400000,
        },
        startDate: [2025, 4, 22],
        checkInDuration: 3,
    },
    {
        id: 5,
        status: "MAINTENANCE",
        isClean: false,
        roomCategory: {
            code: "ECO01",
            name: "Phòng Kinh Tế 1",
            description: "Phòng giá rẻ, đang bảo trì",
            hourlyPrice: 100000,
            dailyPrice: 400000,
            overnightPrice: 300000,
        },
    },
    {
        id: 6,
        status: "OVERDUE",
        isClean: false,
        roomCategory: {
            code: "VIP03",
            name: "Phòng VIP 3",
            description: "Phòng VIP, quá hạn trả",
            hourlyPrice: 300000,
            dailyPrice: 1500000,
            overnightPrice: 1100000,
        },
        startDate: [2025, 4, 18],
        checkInDuration: 1,
    },
];

export default function SchematicView({ onBookingOpen, onFilterOpen, onViewModeChange }) {
    const [anchorElSearch, setAnchorElSearch] = useState(null);
    const [anchorElPriceTable, setAnchorElPriceTable] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [rooms, setRooms] = useState([]);
    const [allRooms, setAllRooms] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL');

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
                                    }}
                                >
                                    <CardContent sx={{ p: 1.5 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Chip
                                                label={statusInfo.label}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'rgba(90,90,90,0.16)', // Màu nền trắng
                                                    color: statusInfo.textColor,
                                                    fontWeight: 'bold',
                                                }}
                                            />
                                            <IconButton size="small" sx={{ color: backgroundColor === '#FFFFFF' ? 'inherit' : '#FFFFFF' }}>
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
        </Box>
    );
}