import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Grid, TextField, IconButton, Paper, Table, 
    TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Chip, Dialog, DialogTitle, DialogContent, DialogActions,
    Snackbar, Alert, MenuItem, Select, FormControl, InputLabel,
    CircularProgress, Pagination, InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import RoomViewService from "../../../service/admin/room.service.js";
import PermissionGuard from "../../../components/PermissionGuard.jsx";

function Room() {
    const [rooms, setRooms] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    // Pagination
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    
    const [newRoom, setNewRoom] = useState({
        roomNumber: '',
        floor: '',
        status: 'AVAILABLE',
        isClean: true,
        categoryId: 1,
    });
    
    const [roomCategories, setRoomCategories] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        // Kiểm tra nếu đã có dữ liệu trong sessionStorage
        const cachedData = sessionStorage.getItem('roomData');
        const timestamp = sessionStorage.getItem('roomDataTimestamp');
        const now = new Date().getTime();
        
        // Chỉ sử dụng cache nếu dữ liệu lưu trữ chưa quá 5 phút
        if (cachedData && timestamp && (now - parseInt(timestamp) < 5 * 60 * 1000)) {
            try {
                const parsedData = JSON.parse(cachedData);
                setRooms(parsedData.content || []);
                setTotalPages(parsedData.totalPages || 1);
                setTotalElements(parsedData.totalElements || 0);
                
                // Vẫn tải categories mới
                fetchRoomCategories();
                console.log('Using cached room data');
                return;
            } catch (error) {
                console.error('Error parsing cached data:', error);
            }
        }
        
        // Nếu không có cache hoặc cache hết hạn
        fetchRooms();
        fetchRoomCategories();
    }, []);

    // Chỉ tải lại khi các giá trị filter thay đổi
    useEffect(() => {
        // Không tải lại nếu đang ở lần tải đầu tiên
        if (rooms.length > 0) {
            fetchRooms(page, size, searchTerm, statusFilter);
        }
    }, [page, size, statusFilter]);

    // Xử lý tìm kiếm với debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (page !== 0) {
                setPage(0); // Reset về trang đầu tiên khi tìm kiếm
            } else {
                fetchRooms(0, size, searchTerm, statusFilter);
            }
        }, 500);
        
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchRooms = async (pageNum = page, pageSize = size, keyword = '', status = '') => {
        setLoading(true);
        try {
            // Hiển thị loading indicator, nhưng không làm UI nhảy nhót
            setTimeout(() => {
                setLoading(false);
            }, 10000); // Đảm bảo loading sẽ kết thúc trong trường hợp xấu nhất
            
            const response = await RoomViewService.searchRoomView({
                keyword, 
                status, 
                page: pageNum,
                size: pageSize
            });
            
            if (response.data) {
                const { content, totalPages, totalElements } = response.data;
                setRooms(content || []);
                setTotalPages(totalPages);
                setTotalElements(totalElements);
                
                // Lưu vào cache
                sessionStorage.setItem('roomData', JSON.stringify(response.data));
                sessionStorage.setItem('roomDataTimestamp', new Date().getTime().toString());
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setSnackbar({
                open: true,
                message: 'Không thể tải danh sách phòng',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchRoomCategories = async () => {
        try {
            const response = await RoomViewService.getRoomCategories();
            if (response.data) {
                setRoomCategories(response.data);
            }
        } catch (error) {
            console.error('Error fetching room categories:', error);
            // Fallback to default categories if API fails
            setRoomCategories([
                { id: 1, name: 'Standard', description: 'Standard Room' },
                { id: 2, name: 'Deluxe', description: 'Deluxe Room' },
                { id: 3, name: 'Suite', description: 'Suite Room' },
            ]);
        }
    };

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewRoom({
            roomNumber: '',
            floor: '',
            status: 'AVAILABLE',
            isClean: true,
            categoryId: 1,
        });
    };

    const handleOpenEditDialog = (room) => {
        setSelectedRoom(room);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedRoom(null);
    };

    const handleOpenDeleteDialog = (room) => {
        setSelectedRoom(room);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedRoom(null);
    };

    const handleAddRoom = async () => {
        try {
            setLoading(true);
            await RoomViewService.addRoom(newRoom);
            fetchRooms();
            handleCloseAddDialog();
            setSnackbar({
                open: true,
                message: 'Thêm phòng thành công',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error adding room:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Không thể thêm phòng',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRoom = async () => {
        try {
            setLoading(true);
            await RoomViewService.updateRoom(selectedRoom.id, selectedRoom);
            fetchRooms();
            handleCloseEditDialog();
            setSnackbar({
                open: true,
                message: 'Cập nhật phòng thành công',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error updating room:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Không thể cập nhật phòng',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoom = async () => {
        try {
            setLoading(true);
            await RoomViewService.deleteRoom(selectedRoom.id);
            fetchRooms();
            handleCloseDeleteDialog();
            setSnackbar({
                open: true,
                message: 'Xóa phòng thành công',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error deleting room:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Không thể xóa phòng',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const getRoomStatusChip = (status, isClean) => {
        let color, label;
        switch (status) {
            case 'AVAILABLE':
                color = isClean ? 'success' : 'warning';
                label = isClean ? 'Sẵn sàng' : 'Cần dọn dẹp';
                break;
            case 'IN_USE':
                color = 'primary';
                label = 'Đang sử dụng';
                break;
            case 'CHECKOUT_SOON':
                color = 'secondary';
                label = 'Sắp trả phòng';
                break;
            case 'MAINTENANCE':
                color = 'error';
                label = 'Bảo trì';
                break;
            default:
                color = 'default';
                label = 'Không xác định';
        }
        return <Chip label={label} color={color} size="small" />;
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRoom({ ...newRoom, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedRoom({ ...selectedRoom, [name]: value });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage - 1); // MUI Pagination is 1-indexed, our API is 0-indexed
    };

    const handleChangeRowsPerPage = (event) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Quản lý phòng</Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <PermissionGuard permissions="CREATE_ROOM">
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />} 
                                onClick={handleOpenAddDialog}
                                disabled={loading}
                            >
                                Thêm phòng
                            </Button>
                        </PermissionGuard>
                        
                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel id="status-filter-label">Trạng thái</InputLabel>
                            <Select
                                labelId="status-filter-label"
                                id="status-filter"
                                value={statusFilter}
                                label="Trạng thái"
                                onChange={(e) => setStatusFilter(e.target.value)}
                                size="small"
                                disabled={loading}
                            >
                                <MenuItem value="">Tất cả</MenuItem>
                                <MenuItem value="AVAILABLE">Sẵn sàng</MenuItem>
                                <MenuItem value="IN_USE">Đang sử dụng</MenuItem>
                                <MenuItem value="CHECKOUT_SOON">Sắp trả phòng</MenuItem>
                                <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <TextField
                        placeholder="Tìm kiếm phòng..."
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: loading && searchTerm ? (
                                <InputAdornment position="end">
                                    <CircularProgress size={20} />
                                </InputAdornment>
                            ) : null
                        }}
                    />
                </Grid>
            </Grid>

            <Paper sx={{ width: '100%', overflow: 'hidden', mb: 3 }}>
                <TableContainer component={Paper} sx={{ position: 'relative' }}>
                    {loading && (
                        <Box 
                            sx={{ 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                right: 0, 
                                zIndex: 1, 
                                display: 'flex', 
                                justifyContent: 'center', 
                                p: 1, 
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                borderRadius: '4px 4px 0 0'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={20} thickness={5} />
                                <Typography variant="caption">Đang tải dữ liệu...</Typography>
                            </Box>
                        </Box>
                    )}
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Số phòng</TableCell>
                                <TableCell>Tầng</TableCell>
                                <TableCell>Loại phòng</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Giá giờ</TableCell>
                                <TableCell>Giá ngày</TableCell>
                                <TableCell>Giá qua đêm</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rooms.map((room) => (
                                <TableRow key={room.id} hover>
                                    <TableCell>{room.roomNumber || 'P' + room.id}</TableCell>
                                    <TableCell>{room.floor || '1'}</TableCell>
                                    <TableCell>{room.roomCategory?.name || 'Standard'}</TableCell>
                                    <TableCell>{getRoomStatusChip(room.status, room.isClean)}</TableCell>
                                    <TableCell>{room.roomCategory?.hourlyPrice?.toLocaleString() || '100,000'} VND</TableCell>
                                    <TableCell>{room.roomCategory?.dailyPrice?.toLocaleString() || '500,000'} VND</TableCell>
                                    <TableCell>{room.roomCategory?.overnightPrice?.toLocaleString() || '300,000'} VND</TableCell>
                                    <TableCell align="right">
                                        <PermissionGuard permissions="EDIT_ROOM">
                                            <IconButton 
                                                color="primary" 
                                                size="small" 
                                                onClick={() => handleOpenEditDialog(room)}
                                                sx={{ mr: 1 }}
                                                disabled={loading}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </PermissionGuard>
                                        
                                        <PermissionGuard permissions="DELETE_ROOM">
                                            <IconButton 
                                                color="error" 
                                                size="small" 
                                                onClick={() => handleOpenDeleteDialog(room)}
                                                disabled={loading}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </PermissionGuard>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && rooms.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body2" sx={{ py: 3 }}>
                                            Không có dữ liệu phòng
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                {/* Phân trang */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2">
                            Hiển thị {rooms.length} / {totalElements} phòng
                        </Typography>
                        
                        <FormControl size="small" sx={{ minWidth: 80 }}>
                            <Select
                                value={size}
                                onChange={handleChangeRowsPerPage}
                                disabled={loading}
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    
                    <Pagination 
                        count={totalPages}
                        page={page + 1}
                        onChange={handleChangePage}
                        color="primary"
                        disabled={loading}
                    />
                </Box>
            </Paper>

            {/* Add Room Dialog */}
            <PermissionGuard permissions="CREATE_ROOM">
                <Dialog 
                    open={openAddDialog} 
                    onClose={handleCloseAddDialog}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Thêm Phòng Mới</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Số Phòng"
                                    name="roomNumber"
                                    value={newRoom.roomNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Tầng"
                                    name="floor"
                                    value={newRoom.floor}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Loại phòng</InputLabel>
                                    <Select
                                        name="categoryId"
                                        value={newRoom.categoryId}
                                        onChange={handleInputChange}
                                        label="Loại phòng"
                                    >
                                        {roomCategories.map(category => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        name="status"
                                        value={newRoom.status}
                                        onChange={handleInputChange}
                                        label="Trạng thái"
                                    >
                                        <MenuItem value="AVAILABLE">Sẵn sàng</MenuItem>
                                        <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Tình trạng dọn dẹp</InputLabel>
                                    <Select
                                        name="isClean"
                                        value={newRoom.isClean}
                                        onChange={handleInputChange}
                                        label="Tình trạng dọn dẹp"
                                    >
                                        <MenuItem value={true}>Đã dọn dẹp</MenuItem>
                                        <MenuItem value={false}>Cần dọn dẹp</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddDialog} disabled={loading}>Hủy</Button>
                        <Button 
                            variant="contained" 
                            onClick={handleAddRoom}
                            disabled={loading || !newRoom.roomNumber || !newRoom.floor}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Thêm'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </PermissionGuard>

            {/* Edit Room Dialog */}
            <PermissionGuard permissions="EDIT_ROOM">
                <Dialog 
                    open={openEditDialog} 
                    onClose={handleCloseEditDialog}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Chỉnh sửa thông tin phòng</DialogTitle>
                    <DialogContent>
                        {selectedRoom && (
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Số Phòng"
                                        name="roomNumber"
                                        value={selectedRoom.roomNumber || ''}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Tầng"
                                        name="floor"
                                        value={selectedRoom.floor || ''}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Loại phòng</InputLabel>
                                        <Select
                                            name="categoryId"
                                            value={selectedRoom.categoryId || selectedRoom.roomCategory?.id || 1}
                                            onChange={handleEditInputChange}
                                            label="Loại phòng"
                                        >
                                            {roomCategories.map(category => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Trạng thái</InputLabel>
                                        <Select
                                            name="status"
                                            value={selectedRoom.status || 'AVAILABLE'}
                                            onChange={handleEditInputChange}
                                            label="Trạng thái"
                                        >
                                            <MenuItem value="AVAILABLE">Sẵn sàng</MenuItem>
                                            <MenuItem value="IN_USE">Đang sử dụng</MenuItem>
                                            <MenuItem value="CHECKOUT_SOON">Sắp trả phòng</MenuItem>
                                            <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Tình trạng dọn dẹp</InputLabel>
                                        <Select
                                            name="isClean"
                                            value={selectedRoom.isClean}
                                            onChange={handleEditInputChange}
                                            label="Tình trạng dọn dẹp"
                                        >
                                            <MenuItem value={true}>Đã dọn dẹp</MenuItem>
                                            <MenuItem value={false}>Cần dọn dẹp</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEditDialog} disabled={loading}>Hủy</Button>
                        <Button 
                            variant="contained" 
                            onClick={handleUpdateRoom}
                            disabled={loading || !selectedRoom?.roomNumber || !selectedRoom?.floor}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Lưu'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </PermissionGuard>

            {/* Delete Room Dialog */}
            <PermissionGuard permissions="DELETE_ROOM">
                <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogContent>
                        {selectedRoom && (
                            <>
                                <Typography>
                                    Bạn có chắc chắn muốn xóa phòng <strong>{selectedRoom.roomNumber || 'P' + selectedRoom.id}</strong> không?
                                </Typography>
                                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                    Lưu ý: Hành động này không thể hoàn tác.
                                </Typography>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog} disabled={loading}>Hủy</Button>
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={handleDeleteRoom}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Xóa'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </PermissionGuard>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={5000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Room;