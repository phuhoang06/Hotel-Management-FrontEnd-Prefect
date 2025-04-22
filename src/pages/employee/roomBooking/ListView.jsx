import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography } from '@mui/material';
import SearchBar from './SearchBar';
import ViewModeButtons from './ViewModeButtons';
import ActionButtons from './ActionButtons';
import { StatusBar } from './StatusBar';
import RoomViewService from "../../../service/admin/room.service.js";

export default function ListView({ onBookingOpen, onFilterOpen, onViewModeChange }) {
    const [anchorElSearch, setAnchorElSearch] = useState(null);
    const [anchorElPriceTable, setAnchorElPriceTable] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [rooms, setRooms] = useState([]);
    const [allRooms, setAllRooms] = useState([]);

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
        if (status === 'CHECKOUT_SOON') return 'CHECKOUT';
        if (status === 'AVAILABLE' && isClean) return 'CHECKIN';
        return 'PAYMENT';
    };

    const getActionButton = (action) => {
        switch (action) {
            case 'CHECKIN': return <Button variant="contained" size="small" sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>Nhận phòng</Button>;
            case 'CHECKOUT': return <Button variant="contained" size="small" sx={{ backgroundColor: '#2196F3', color: '#fff' }}>Trả phòng</Button>;
            case 'PAYMENT': return <Button variant="contained" size="small" sx={{ backgroundColor: '#FF9800', color: '#fff' }}>Thanh toán</Button>;
            default: return null;
        }
    };

    const handleStatusFilter = async (status) => {
        try {
            const response = await RoomViewService.searchRoomView({ status });
            const roomData = response.data.content || [];
            setRooms(roomData);
        } catch (error) {
            console.error('Error filtering rooms:', error);
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
                            variant="list-grid"
                            onStatusFilter={handleStatusFilter}
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
                                            <TableRow key={room.id}>
                                                <TableCell>{bookingData.stt}</TableCell>
                                                <TableCell>{bookingData.bookingCode}</TableCell>
                                                <TableCell>{bookingData.channelCode}</TableCell>
                                                <TableCell>{bookingData.room}</TableCell>
                                                <TableCell sx={{ whiteSpace: 'pre-line' }}>{bookingData.customer}</TableCell>
                                                <TableCell>{bookingData.checkInTime}</TableCell>
                                                <TableCell>{bookingData.checkOutTime}</TableCell>
                                                <TableCell>{bookingData.total}đ</TableCell>
                                                <TableCell>{bookingData.paid}đ</TableCell>
                                                <TableCell>{bookingData.action}</TableCell>
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
        </Box>
    );
}