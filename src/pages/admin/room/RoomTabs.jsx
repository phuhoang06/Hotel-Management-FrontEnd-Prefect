import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
    Tab,
    TextField,
    Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import RoomViewService from '../../../service/admin/room.service';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddRoomCategoryDialog from './AddRoomCategoryDialog.jsx';
import AddRoomDialog from './AddRoomDialog.jsx';
import UpdateRoomCategoryDialog from './UpdateRoomCategoryDialog.jsx';
import UpdateRoomDialog from './UpdateRoomDialog.jsx';
import { debounce } from 'lodash';

const placeholderImage = 'https://via.placeholder.com/200x150?text=No+Image';

// Hàm hỗ trợ tạo thuộc tính accessibility cho tab
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

// Component TabPanel tùy chỉnh để hiển thị nội dung tab
function CustomTabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
        </div>
    );
}

export default function RoomTabs() {
    // Trạng thái tab hiện tại (0: Hạng phòng, 1: Danh sách phòng)
    const [value, setValue] = useState(0);
    // Tìm kiếm hạng phòng
    const [searchCategory, setSearchCategory] = useState('');
    // Trạng thái hạng phòng (Đang/Ngừng kinh doanh)
    const [statusCategory, setStatusCategory] = useState({ active: true, inactive: false });
    // Tìm kiếm phòng
    const [searchRoom, setSearchRoom] = useState('');
    // Bộ lọc hạng phòng
    const [categoryRoom, setCategoryRoom] = useState('');
    // Bộ lọc trạng thái phòng
    const [statusRoom, setStatusRoom] = useState('');
    // Bộ lọc tầng
    const [floorRoom, setFloorRoom] = useState('');
    // Danh sách hạng phòng được chọn
    const [selectedCategories, setSelectedCategories] = useState([]);
    // Hạng phòng đang mở rộng
    const [expandedRow, setExpandedRow] = useState(null);
    // Chi tiết hạng phòng mở rộng
    const [expandedRowDetails, setExpandedRowDetails] = useState(null);
    // Phòng đang mở rộng
    const [expandedRoomRow, setExpandedRoomRow] = useState(null);
    // Chi tiết phòng mở rộng
    const [expandedRoomDetails, setExpandedRoomDetails] = useState(null);
    // Danh sách hạng phòng
    const [roomCategories, setRoomCategories] = useState([]);
    // Danh sách phòng
    const [rooms, setRooms] = useState([]);
    // Trạng thái tải dữ liệu
    const [loading, setLoading] = useState(false);
    // Trang hiện tại (dùng chung cho cả hai tab)
    const [page, setPage] = useState(0);
    // Tổng số bản ghi
    const [totalRecords, setTotalRecords] = useState(0);
    // Số bản ghi mỗi trang
    const [recordsPerPage, setRecordsPerPage] = useState(5);
    // Ảnh chính khi xem chi tiết phòng
    const [mainImage, setMainImage] = useState(null);
    // Menu thêm mới
    const [openAddMenu, setOpenAddMenu] = useState(false);
    const addButtonRef = useRef(null);
    // Dialog thêm hạng phòng
    const [openRoomCategoryDialog, setOpenRoomCategoryDialog] = useState(false);
    // Dialog thêm phòng
    const [openRoomDialog, setOpenRoomDialog] = useState(false);
    // Trạng thái tải danh sách hạng phòng
    const [loadingCategories, setLoadingCategories] = useState(false);
    // Dialog cập nhật hạng phòng
    const [openUpdateRoomCategoryDialog, setOpenUpdateRoomCategoryDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    // Dialog cập nhật phòng
    const [openUpdateRoomDialog, setOpenUpdateRoomDialog] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    // Xử lý mở/đóng menu thêm mới
    const handleAddMouseEnter = () => setOpenAddMenu(true);
    const handleAddMouseLeave = () => setOpenAddMenu(false);

    // Mở dialog thêm hạng phòng
    const handleAddRoomCategory = () => {
        setOpenRoomCategoryDialog(true);
        setOpenAddMenu(false);
    };

    // Mở dialog thêm phòng
    const handleAddRoom = () => {
        setOpenRoomDialog(true);
        setOpenAddMenu(false);
    };

    // Đóng dialog thêm hạng phòng
    const handleCloseRoomCategoryDialog = () => setOpenRoomCategoryDialog(false);

    // Đóng dialog thêm phòng
    const handleCloseRoomDialog = () => setOpenRoomDialog(false);

    // Tải danh sách hạng phòng ban đầu
    const fetchRoomCategories = useCallback(async () => {
        try {
            setLoadingCategories(true);
            const response = await RoomViewService.getRoomCategories();
            if (response?.data) {
                setRoomCategories(response.data);
            } else {
                setRoomCategories([]);
                toast.info('Không có dữ liệu hạng phòng');
            }
        } catch (err) {
            console.error('Lỗi khi tải danh sách hạng phòng:', err);
            setRoomCategories([]);
            toast.error(`Không thể tải danh sách hạng phòng: ${err.message}`);
        } finally {
            setLoadingCategories(false);
        }
    }, []);

    // Tìm kiếm và lọc hạng phòng
    const filteredCategories = useCallback(
        async (currentPage = 0) => {
            try {
                setLoading(true);
                const status = statusCategory.active ? 'ACTIVE' : statusCategory.inactive ? 'INACTIVE' : '';
                const response = await RoomViewService.searchRoomCategories({
                    keyword: searchCategory,
                    status,
                    page: currentPage,
                    size: recordsPerPage,
                });
                if (response?.data?.content) {
                    setRoomCategories(response.data.content);
                    setTotalRecords(response.data.totalElements || 0);
                } else {
                    setRoomCategories([]);
                    setTotalRecords(0);
                    toast.info('Không có dữ liệu hạng phòng phù hợp');
                }
            } catch (err) {
                console.error('Lỗi khi tìm kiếm hạng phòng:', err);
                setRoomCategories([]);
                setTotalRecords(0);
                toast.error(`Không thể tìm kiếm hạng phòng: ${err.message}`);
            } finally {
                setLoading(false);
            }
        },
        [searchCategory, statusCategory, recordsPerPage]
    );

    // Tìm kiếm và lọc phòng
    const filteredRooms = useCallback(
        async (currentPage = 0) => {
            try {
                setLoading(true);
                const params = {
                    keyword: searchRoom,
                    status: statusRoom || '',
                    categoryId: categoryRoom || '',
                    floor: floorRoom || '',
                    page: currentPage,
                    size: recordsPerPage,
                };
                const response = await RoomViewService.searchRoomView(params);
                if (response?.data?.content) {
                    setRooms(response.data.content);
                    setTotalRecords(response.data.totalElements || 0);
                } else {
                    setRooms([]);
                    setTotalRecords(0);
                    toast.info('Không có phòng nào phù hợp');
                }
            } catch (err) {
                console.error('Lỗi khi tìm kiếm phòng:', err);
                setRooms([]);
                setTotalRecords(0);
                toast.error(`Không thể tìm kiếm phòng: ${err.message}`);
            } finally {
                setLoading(false);
            }
        },
        [searchRoom, statusRoom, categoryRoom, floorRoom, recordsPerPage]
    );

    // Khởi tạo dữ liệu khi component mount
    const initializeData = useCallback(async () => {
        try {
            setLoading(true);
            await fetchRoomCategories();
            if (value === 0) {
                await filteredCategories(0);
            } else {
                await filteredRooms(0);
            }
        } catch (err) {
            console.error('Lỗi khi khởi tạo dữ liệu:', err);
            toast.error('Không thể khởi tạo dữ liệu');
        } finally {
            setLoading(false);
        }
    }, [fetchRoomCategories, filteredCategories, filteredRooms, value]);

    // Debounce chỉ áp dụng cho tìm kiếm văn bản
    const debouncedFilteredCategories = useRef(debounce((currentPage) => filteredCategories(currentPage), 500)).current;
    const debouncedFilteredRooms = useRef(debounce((currentPage) => filteredRooms(currentPage), 500)).current;

    // Khởi tạo dữ liệu khi component mount
    useEffect(() => {
        initializeData();
    }, [initializeData]);

    // Xử lý chuyển tab
    const handleChange = (event, newValue) => {
        setValue(newValue);
        setPage(0);
        setExpandedRow(null);
        setExpandedRowDetails(null);
        setExpandedRoomRow(null);
        setExpandedRoomDetails(null);
        setSelectedCategories([]);
        setMainImage(null);
        setCategoryRoom('');
        setSearchRoom('');
        setStatusRoom('');
        setFloorRoom('');
    };

    // Xử lý click vào hàng hạng phòng
    const handleRowClick = async (category) => {
        if (expandedRow === category.id) {
            setExpandedRow(null);
            setExpandedRowDetails(null);
        } else {
            setExpandedRow(category.id);
            try {
                setLoading(true);
                const response = await RoomViewService.getRoomCategoryById(category.id);
                setExpandedRowDetails(response?.data || null);
            } catch (err) {
                console.error('Lỗi khi tải chi tiết hạng phòng:', err);
                setExpandedRowDetails(null);
                toast.error(`Không thể tải chi tiết hạng phòng: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    // Xử lý click vào hàng phòng
    const handleRoomRowClick = async (room) => {
        if (expandedRoomRow === room.id) {
            setExpandedRoomRow(null);
            setExpandedRoomDetails(null);
            setMainImage(null);
        } else {
            setExpandedRoomRow(room.id);
            try {
                setLoading(true);
                const response = await RoomViewService.getRoomById(room.id);
                const roomDetails = response?.data || room;
                setExpandedRoomDetails(roomDetails);
                setMainImage(roomDetails.img1 || placeholderImage);
            } catch (err) {
                console.error('Lỗi khi tải chi tiết phòng:', err);
                setExpandedRoomDetails(room);
                setMainImage(room.img1 || placeholderImage);
                toast.error(`Không thể tải chi tiết phòng: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    // Xử lý click vào ảnh thumbnail
    const handleThumbnailClick = (img) => {
        setMainImage(img);
    };

    // Xử lý chọn checkbox hạng phòng
    const handleCheckboxChange = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
        );
    };

    // Xử lý cập nhật hạng phòng
    const handleUpdate = (category, e) => {
        e?.stopPropagation();
        setSelectedCategory(category);
        setOpenUpdateRoomCategoryDialog(true);
    };

    // Xử lý ngừng kinh doanh hạng phòng
    // const handleDeactivate = async (category, e) => {
    //     e?.stopPropagation();
    //     try {
    //         setLoading(true);
    //         await RoomViewService.updateRoomCategoryStatus(category.id, 'INACTIVE');
    //         await filteredCategories(page);
    //         setExpandedRow(null);
    //         setExpandedRowDetails(null);
    //         toast.success('Ngừng kinh doanh hạng phòng thành công');
    //     } catch (err) {
    //         console.error('Lỗi khi ngừng kinh doanh hạng phòng:', err);
    //         toast.error(`Không thể ngừng kinh doanh hạng phòng: ${err.message}`);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // Xử lý xóa hạng phòng
    const handleDelete = async (category, e) => {
        e?.stopPropagation();
        try {
            setLoading(true);
            await RoomViewService.deleteRoomCategory(category.id);
            await filteredCategories(page);
            setExpandedRow(null);
            setExpandedRowDetails(null);
            toast.success('Xóa hạng phòng thành công');
        } catch (err) {
            console.error('Lỗi khi xóa hạng phòng:', err);
            toast.error(`Không thể xóa hạng phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý cập nhật phòng
    const handleRoomUpdate = (room, e) => {
        e?.stopPropagation();
        setSelectedRoom(room);
        setOpenUpdateRoomDialog(true);
    };

    // Xử lý xóa phòng
    const handleRoomDelete = async (room, e) => {
        e?.stopPropagation();
        if (window.confirm(`Bạn có chắc muốn xóa phòng ${room.id}?`)) {
            try {
                setLoading(true);
                await RoomViewService.deleteRoom(room.id);
                await filteredRooms(page);
                setExpandedRoomRow(null);
                setExpandedRoomDetails(null);
                toast.success('Xóa phòng thành công');
            } catch (err) {
                console.error('Lỗi khi xóa phòng:', err);
                let errorMessage = `Không thể xóa phòng: ${err.message}`;
                if (err.response?.status === 400) {
                    errorMessage = err.response.data.message || 'Dữ liệu không hợp lệ';
                } else if (err.response?.status === 403) {
                    errorMessage = 'Bạn không có quyền xóa phòng';
                } else if (err.response?.status === 404) {
                    errorMessage = 'Phòng không tồn tại';
                }
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    // Xử lý thay đổi trang
    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        if (value === 0) {
            filteredCategories(newPage);
        } else {
            filteredRooms(newPage);
        }
    };

    // Xử lý thay đổi số bản ghi mỗi trang
    const handleRowsPerPageChange = (event) => {
        const newRecordsPerPage = parseInt(event.target.value, 10);
        setRecordsPerPage(newRecordsPerPage);
        setPage(0);
        if (value === 0) {
            filteredCategories(0);
        } else {
            filteredRooms(0);
        }
    };

    // Hàm lấy nhãn trạng thái phòng
    const getRoomStatusLabel = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return 'Trống';
            case 'UPCOMING':
                return 'Sắp tới';
            case 'IN_USE':
                return 'Đang sử dụng';
            case 'CHECKOUT_SOON':
                return 'Sắp trả phòng';
            case 'MAINTENANCE':
                return 'Bảo trì';
            case 'OVERDUE':
                return 'Quá hạn';
            default:
                return 'Không xác định';
        }
    };

    // Cột cho bảng hạng phòng
    const categoriesColumns = [
        { id: 'checkbox', label: '', width: '32px' },
        { id: 'code', label: 'Mã hạng phòng', width: '96px' },
        { id: 'name', label: 'Tên hạng phòng', width: '144px' },
        { id: 'rooms', label: 'Số lượng phòng', width: '96px' },
        { id: 'hourlyPrice', label: 'Giá giờ', width: '80px' },
        { id: 'dailyPrice', label: 'Giá ngày', width: '80px' },
        { id: 'overnightPrice', label: 'Giá qua đêm', width: '96px' },
        { id: 'status', label: 'Trạng thái', width: '112px' },
        { id: 'actions', label: 'Chỉnh sửa', width: '96px' },
    ];

    // Cột cho bảng phòng
    const roomsColumns = [
        { id: 'id', label: 'Mã phòng', width: '80px' },
        { id: 'category', label: 'Hạng phòng', width: '144px' },
        { id: 'floor', label: 'Tầng', width: '64px' },
        { id: 'status', label: 'Tình trạng', width: '120px' },
        { id: 'clean', label: 'Trạng thái dọn dẹp', width: '144px' },
        { id: 'actions', label: 'Hành động', width: '160px' },
    ];

    return (
        <Box sx={{ width: '100%', fontSize: '0.875rem' }}>
            {/* Hiển thị loading khi đang tải dữ liệu */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
                    <CircularProgress size="2rem" />
                </Box>
            )}

            {/* Thanh tab và nút thêm mới */}
            <Paper elevation={2} sx={{ mb: 2, minWidth: '960px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', px: 1 }}>
                    <Tabs value={value} onChange={handleChange} aria-label="room tabs">
                        <Tab label="Hạng phòng" {...a11yProps(0)} sx={{ py: 1 }} />
                        <Tab label="Danh sách phòng" {...a11yProps(1)} sx={{ py: 1 }} />
                    </Tabs>
                    <Box onMouseEnter={handleAddMouseEnter} onMouseLeave={handleAddMouseLeave}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<AddIcon />}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{ fontSize: '0.875rem' }}
                            ref={addButtonRef}
                        >
                            Thêm mới
                        </Button>
                        <Popper
                            open={openAddMenu}
                            anchorEl={addButtonRef.current}
                            placement="bottom-start"
                            disablePortal
                            style={{ zIndex: 9999 }}
                        >
                            <Box sx={{ bgcolor: 'white', borderRadius: 1, boxShadow: 3, minWidth: 180 }}>
                                <MenuList dense>
                                    <MenuItem onClick={handleAddRoomCategory}>Thêm hạng phòng</MenuItem>
                                    <MenuItem onClick={handleAddRoom}>Thêm phòng</MenuItem>
                                </MenuList>
                            </Box>
                        </Popper>
                    </Box>
                </Box>
            </Paper>

            {/* Dialog thêm hạng phòng */}
            <AddRoomCategoryDialog
                open={openRoomCategoryDialog}
                onClose={handleCloseRoomCategoryDialog}
                onSuccess={() => {
                    fetchRoomCategories();
                    filteredCategories(page);
                }}
            />

            {/* Dialog thêm phòng */}
            <AddRoomDialog
                open={openRoomDialog}
                onClose={handleCloseRoomDialog}
                onSuccess={() => filteredRooms(page)}
            />

            {/* Dialog cập nhật hạng phòng */}
            <UpdateRoomCategoryDialog
                open={openUpdateRoomCategoryDialog}
                onClose={() => {
                    setOpenUpdateRoomCategoryDialog(false);
                    setSelectedCategory(null);
                }}
                onSuccess={() => {
                    fetchRoomCategories();
                    filteredCategories(page);
                }}
                category={selectedCategory}
            />

            {/* Dialog cập nhật phòng */}
            <UpdateRoomDialog
                open={openUpdateRoomDialog}
                onClose={() => {
                    setOpenUpdateRoomDialog(false);
                    setSelectedRoom(null);
                }}
                onSuccess={() => filteredRooms(page)}
                room={selectedRoom}
            />

            <Grid container spacing={2} sx={{ minWidth: '960px' }}>
                {/* Bộ lọc */}
                <Grid item xs={4}>
                    <Paper elevation={1} sx={{ p: 1, height: '100%' }}>
                        {value === 0 ? (
                            <>
                                <TextField
                                    fullWidth
                                    label="Tìm kiếm hạng phòng"
                                    value={searchCategory}
                                    onChange={(e) => {
                                        setSearchCategory(e.target.value);
                                        setPage(0);
                                        debouncedFilteredCategories(0);
                                    }}
                                    sx={{ mb: 1 }}
                                    size="small"
                                />
                                <Box sx={{ mb: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={statusCategory.active}
                                                onChange={(e) =>
                                                    setStatusCategory({ ...statusCategory, active: e.target.checked, inactive: !e.target.checked })
                                                }
                                                size="small"
                                            />
                                        }
                                        label="Đang kinh doanh"
                                        sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={statusCategory.inactive}
                                                onChange={(e) =>
                                                    setStatusCategory({ ...statusCategory, inactive: e.target.checked, active: !e.target.checked })
                                                }
                                                size="small"
                                            />
                                        }
                                        label="Ngừng kinh doanh"
                                        sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
                                    />
                                </Box>
                            </>
                        ) : (
                            <>
                                <TextField
                                    fullWidth
                                    label="Tìm kiếm phòng"
                                    value={searchRoom}
                                    onChange={(e) => {
                                        setSearchRoom(e.target.value);
                                        setPage(0);
                                        debouncedFilteredRooms(0);
                                    }}
                                    sx={{ mb: 1 }}
                                    size="small"
                                />
                                <FormControl fullWidth sx={{ mb: 1 }} size="small">
                                    <InputLabel sx={{ fontSize: '0.875rem' }}>Loại phòng</InputLabel>
                                    <Select
                                        value={categoryRoom}
                                        onChange={(e) => {
                                            setCategoryRoom(e.target.value);
                                            setPage(0);
                                            filteredRooms(0);
                                        }}
                                        label="Loại phòng"
                                        sx={{ fontSize: '0.875rem' }}
                                        disabled={loadingCategories}
                                    >
                                        <MenuItem value="" sx={{ fontSize: '0.875rem' }}>
                                            Tất cả
                                        </MenuItem>
                                        {roomCategories.length > 0 ? (
                                            roomCategories.map((category) => (
                                                <MenuItem key={category.id} value={category.id} sx={{ fontSize: '0.875rem' }}>
                                                    {category.name}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="" disabled sx={{ fontSize: '0.875rem' }}>
                                                {loadingCategories ? 'Đang tải...' : 'Không có hạng phòng'}
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth sx={{ mb: 1 }} size="small">
                                    <InputLabel sx={{ fontSize: '0.875rem' }}>Tầng</InputLabel>
                                    <Select
                                        value={floorRoom}
                                        onChange={(e) => {
                                            setFloorRoom(e.target.value);
                                            setPage(0);
                                            filteredRooms(0);
                                        }}
                                        label="Tầng"
                                        sx={{ fontSize: '0.875rem' }}
                                    >
                                        <MenuItem value="" sx={{ fontSize: '0.875rem' }}>
                                            Tất cả
                                        </MenuItem>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((floor) => (
                                            <MenuItem key={floor} value={floor} sx={{ fontSize: '0.875rem' }}>
                                                Tầng {floor}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth sx={{ mb: 1 }} size="small">
                                    <InputLabel sx={{ fontSize: '0.875rem' }}>Tình trạng</InputLabel>
                                    <Select
                                        value={statusRoom}
                                        onChange={(e) => {
                                            setStatusRoom(e.target.value);
                                            setPage(0);
                                            filteredRooms(0);
                                        }}
                                        label="Tình trạng"
                                        sx={{ fontSize: '0.875rem' }}
                                    >
                                        <MenuItem value="" sx={{ fontSize: '0.875rem' }}>
                                            Tất cả
                                        </MenuItem>
                                        <MenuItem value="AVAILABLE" sx={{ fontSize: '0.875rem' }}>
                                            Trống
                                        </MenuItem>
                                        <MenuItem value="UPCOMING" sx={{ fontSize: '0.875rem' }}>
                                            Sắp tới
                                        </MenuItem>
                                        <MenuItem value="IN_USE" sx={{ fontSize: '0.875rem' }}>
                                            Đang sử dụng
                                        </MenuItem>
                                        <MenuItem value="CHECKOUT_SOON" sx={{ fontSize: '0.875rem' }}>
                                            Sắp trả phòng
                                        </MenuItem>
                                        <MenuItem value="MAINTENANCE" sx={{ fontSize: '0.875rem' }}>
                                            Bảo trì
                                        </MenuItem>
                                        <MenuItem value="OVERDUE" sx={{ fontSize: '0.875rem' }}>
                                            Quá hạn
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </Paper>
                </Grid>

                {/* Bảng dữ liệu */}
                <Grid item xs={8}>
                    <Paper elevation={2} sx={{ height: '100%' }}>
                        <CustomTabPanel value={value} index={0}>
                            <Typography variant="h6" sx={{ mb: 1, px: 0.5, fontSize: '1rem' }}>
                                Hạng phòng
                            </Typography>
                            <TableContainer sx={{ maxHeight: '400px' }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            {categoriesColumns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    sx={{
                                                        px: 0.5,
                                                        py: 0.5,
                                                        width: column.width,
                                                        whiteSpace: 'nowrap',
                                                        fontWeight: 'bold',
                                                        backgroundColor: '#f5f5f5',
                                                        fontSize: '0.875rem',
                                                    }}
                                                >
                                                    {column.id === 'checkbox' ? (
                                                        <Checkbox
                                                            checked={selectedCategories.length === roomCategories.length && roomCategories.length > 0}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedCategories(roomCategories.map((category) => category.id));
                                                                } else {
                                                                    setSelectedCategories([]);
                                                                }
                                                            }}
                                                            size="small"
                                                        />
                                                    ) : (
                                                        column.label
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {roomCategories.length > 0 ? (
                                            roomCategories.map((category) => (
                                                <React.Fragment key={category.id}>
                                                    <TableRow
                                                        onClick={() => handleRowClick(category)}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            bgcolor: expandedRow === category.id ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                                                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' },
                                                        }}
                                                    >
                                                        <TableCell sx={{ px: 0.5, py: 0.5 }}>
                                                            <Checkbox
                                                                checked={selectedCategories.includes(category.id)}
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCheckboxChange(category.id);
                                                                }}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ px: 0.5, py: 0.5, fontSize: '0.875rem' }}>{category.code}</TableCell>
                                                        <TableCell sx={{ px: 0.5, py: 0.5, fontSize: '0.875rem' }}>{category.name}</TableCell>
                                                        <TableCell sx={{ px: 0.5, py: 0.5, fontSize: '0.875rem' }}>
                                                            {category.rooms?.length || 0}
                                                        </TableCell>
                                                        <TableCell sx={{ px: 0.5, py: 0.5, fontSize: '0.875rem' }}>
                                                            {category.hourlyPrice?.toLocaleString() || 'N/A'} đ
                                                        </TableCell>
                                                        <TableCell sx={{ px: 0.5, py: 0.5, fontSize: '0.875rem' }}>
                                                            {category.dailyPrice?.toLocaleString() || 'N/A'} đ
                                                        </TableCell>
                                                        <TableCell sx={{ px: 0.5, py: 0.5, fontSize: '0.875rem' }}>
                                                            {category.overnightPrice?.toLocaleString() || 'N/A'} đ
                                                        </TableCell>
                                                        <TableCell sx={{ px: 0.5, py: 0.5, fontSize: '0.875rem' }}>
                                                            <Box
                                                                sx={{
                                                                    display: 'inline-block',
                                                                    px: 0.5,
                                                                    py: 0.25,
                                                                    borderRadius: 0.8,
                                                                    bgcolor: category.status === 'ACTIVE' ? 'success.light' : 'error.light',
                                                                    color: 'white',
                                                                    fontSize: '0.875rem',
                                                                }}
                                                            >
                                                                {category.status === 'ACTIVE' ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell sx={{ px: 0.5, py: 0.5 }}>
                                                            <Button
                                                                variant="text"
                                                                color="primary"
                                                                onClick={(e) => handleUpdate(category, e)}
                                                                size="small"
                                                                sx={{ fontSize: '0.875rem', minWidth: 'auto' }}
                                                            >
                                                                Chỉnh sửa
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                    {expandedRow === category.id && expandedRowDetails && (
                                                        <TableRow>
                                                            <TableCell colSpan={9} sx={{ p: 0 }}>
                                                                <Box sx={{ p: 0.5, bgcolor: 'rgba(0, 0, 0, 0.02)', fontSize: '0.875rem' }}>
                                                                    <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 'bold', fontSize: '1rem' }}>
                                                                        Thông tin chi tiết
                                                                    </Typography>
                                                                    <Grid container spacing={0.5}>
                                                                        <Grid item xs={4}>
                                                                            <Box>
                                                                                <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                                                                                    Ảnh:
                                                                                </Typography>
                                                                                <img
                                                                                    src={
                                                                                        expandedRowDetails.imgUrl
                                                                                            ? expandedRowDetails.imgUrl.startsWith('http')
                                                                                                ? expandedRowDetails.imgUrl
                                                                                                : `http://localhost:8080/${expandedRowDetails.imgUrl}`
                                                                                            : placeholderImage
                                                                                    }
                                                                                    alt={expandedRowDetails.name}
                                                                                    style={{ width: '120px', height: '120px', objectFit: 'cover', marginTop: '4px' }}
                                                                                />
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={8}>
                                                                            <Grid container spacing={0.5}>
                                                                                <Grid item xs={6}>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Mã hạng phòng:</strong> {expandedRowDetails.code}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Tên hạng phòng:</strong> {expandedRowDetails.name}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Sức chứa tối đa:</strong> {expandedRowDetails.maxAdultCapacity} người
                                                                                        lớn, {expandedRowDetails.maxChildCapacity} trẻ em
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Sức chứa tiêu chuẩn:</strong> {expandedRowDetails.standardAdultCapacity}{' '}
                                                                                        người lớn, {expandedRowDetails.standardChildCapacity} trẻ em
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid item xs={6}>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Chi nhánh:</strong> Chi nhánh trung tâm
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Số lượng phòng:</strong> {expandedRowDetails.rooms?.length || 0}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Giá giờ:</strong> {expandedRowDetails.hourlyPrice?.toLocaleString() ||
                                                                                        'N/A'}{' '}
                                                                                        đ
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Giá ngày:</strong> {expandedRowDetails.dailyPrice?.toLocaleString() ||
                                                                                        'N/A'}{' '}
                                                                                        đ
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Giá qua đêm:</strong>{' '}
                                                                                        {expandedRowDetails.overnightPrice?.toLocaleString() || 'N/A'} đ
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Phụ phí khác:</strong>{' '}
                                                                                        {expandedRowDetails.defaultExtraFee?.toLocaleString() || 'N/A'} đ
                                                                                    </Typography>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5, gap: 0.5 }}>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="success"
                                                                            onClick={(e) => handleUpdate(category, e)}
                                                                            size="small"
                                                                            sx={{ minWidth: 64, fontSize: '0.875rem' }}
                                                                        >
                                                                            Cập nhật
                                                                        </Button>
                                                                        {/*<Button*/}
                                                                        {/*    variant="contained"*/}
                                                                        {/*    color="error"*/}
                                                                        {/*    onClick={(e) => handleDeactivate(category, e)}*/}
                                                                        {/*    size="small"*/}
                                                                        {/*    sx={{ minWidth: 64, fontSize: '0.875rem' }}*/}
                                                                        {/*>*/}
                                                                        {/*    Ngừng kinh doanh*/}
                                                                        {/*</Button>*/}
                                                                        <Button
                                                                            variant="contained"
                                                                            color="error"
                                                                            onClick={(e) => handleDelete(category, e)}
                                                                            size="small"
                                                                            sx={{ minWidth: 64, fontSize: '0.875rem' }}
                                                                        >
                                                                            Xóa
                                                                        </Button>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={9} align="center" sx={{ fontSize: '0.875rem' }}>
                                                    Không có dữ liệu hạng phòng
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <Typography variant="h6" sx={{ mb: 1, px: 0.5, fontSize: '1rem' }}>
                                Danh sách phòng
                            </Typography>
                            <TableContainer sx={{ maxHeight: '400px' }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            {roomsColumns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    sx={{
                                                        px: 0.5,
                                                        py: 0.5,
                                                        width: column.width,
                                                        whiteSpace: 'nowrap',
                                                        fontWeight: 'bold',
                                                        backgroundColor: '#f5f5f5',
                                                        fontSize: '0.875rem',
                                                    }}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rooms.length > 0 ? (
                                            rooms.map((room) => (
                                                <React.Fragment key={room.id}>
                                                    <TableRow
                                                        onClick={() => handleRoomRowClick(room)}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            bgcolor: expandedRoomRow === room.id ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                                                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' },
                                                        }}
                                                    >
                                                        <TableCell sx={{ px: 0.5, py: 0.5, fontSize: '0.875rem' }}>{room.id}</TableCell>
                                                        <TableCell sx={{ px: 0.5, py: 0.5, fontSize: '0.875rem' }}>
                                                            {room.roomCategory?.name || 'Không xác định'}
                                                        </TableCell>
                                                        <TableCell sx={{ px: 0.5, py: 0.5, fontSize: '0.875rem' }}>
                                                            {room.floor !== null && room.floor !== undefined ? room.floor : 'Không xác định'}
                                                        </TableCell>
                                                        <TableCell sx={{ px: 0.5, py: 0.5, fontSize: '0.875rem' }}>
                                                            <Box
                                                                sx={{
                                                                    display: 'inline-block',
                                                                    px: 0.5,
                                                                    py: 0.25,
                                                                    borderRadius: '4px',
                                                                    bgcolor:
                                                                        room.status === 'AVAILABLE'
                                                                            ? 'success.light'
                                                                            : room.status === 'IN_USE'
                                                                                ? 'warning.light'
                                                                                : 'error.light',
                                                                    color: 'white',
                                                                    fontSize: '0.875rem',
                                                                }}
                                                            >
                                                                {getRoomStatusLabel(room.status)}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell sx={{ px: 0.5, py: 0.5, fontSize: '0.875rem' }}>
                                                            {room.isClean ? 'Sạch' : 'Chưa dọn'}
                                                        </TableCell>
                                                        <TableCell sx={{ px: 0.5, py: 0.5 }}>
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Button
                                                                    variant="text"
                                                                    color="primary"
                                                                    onClick={(e) => handleRoomUpdate(room, e)}
                                                                    size="small"
                                                                    sx={{ fontSize: '0.875rem', minWidth: 'auto' }}
                                                                >
                                                                    Chỉnh sửa
                                                                </Button>
                                                                <Button
                                                                    variant="text"
                                                                    color="error"
                                                                    onClick={(e) => handleRoomDelete(room, e)}
                                                                    size="small"
                                                                    sx={{ fontSize: '0.875rem', minWidth: 'auto' }}
                                                                >
                                                                    Xóa
                                                                </Button>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                    {expandedRoomRow === room.id && expandedRoomDetails && (
                                                        <TableRow>
                                                            <TableCell colSpan={6} sx={{ p: 0 }}>
                                                                <Box sx={{ p: 0.5, bgcolor: 'rgba(0, 0, 0, 0.02)', fontSize: '0.875rem' }}>
                                                                    <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 'bold', fontSize: '1rem' }}>
                                                                        Thông tin chi tiết
                                                                    </Typography>
                                                                    <Grid container spacing={0.5}>
                                                                        <Grid item xs={12}>
                                                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                                <Box>
                                                                                    <img
                                                                                        src={
                                                                                            mainImage
                                                                                                ? mainImage.startsWith('http')
                                                                                                    ? mainImage
                                                                                                    : `http://localhost:8080/${mainImage}`
                                                                                                : expandedRoomDetails.img1 || placeholderImage
                                                                                        }
                                                                                        alt={`Phòng ${expandedRoomDetails.id}`}
                                                                                        style={{
                                                                                            width: '300px',
                                                                                            height: '200px',
                                                                                            objectFit: 'cover',
                                                                                            borderRadius: '8px',
                                                                                        }}
                                                                                    />
                                                                                </Box>
                                                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                                                                                    {[expandedRoomDetails.img1, expandedRoomDetails.img2, expandedRoomDetails.img3, expandedRoomDetails.img4].map(
                                                                                        (img, index) =>
                                                                                            img && (
                                                                                                <img
                                                                                                    key={index}
                                                                                                    src={img.startsWith('http') ? img : `http://localhost:8080/${img}`}
                                                                                                    alt={`Thumbnail ${index + 1}`}
                                                                                                    onClick={() => handleThumbnailClick(img)}
                                                                                                    style={{
                                                                                                        width: '60px',
                                                                                                        height: '60px',
                                                                                                        objectFit: 'cover',
                                                                                                        borderRadius: '4px',
                                                                                                        cursor: 'pointer',
                                                                                                        border: mainImage === img ? '2px solid #1976d2' : 'none',
                                                                                                    }}
                                                                                                />
                                                                                            )
                                                                                    )}
                                                                                </Box>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <Grid container spacing={0.5}>
                                                                                <Grid item xs={6}>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Mã phòng:</strong> {expandedRoomDetails.id}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Hạng phòng:</strong> {expandedRoomDetails?.roomCategory?.name ||
                                                                                        'Không xác định'}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Tầng:</strong>{' '}
                                                                                        {expandedRoomDetails?.floor !== null && expandedRoomDetails?.floor !== undefined
                                                                                            ? expandedRoomDetails?.floor
                                                                                            : 'Không xác định'}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Ngày bắt đầu:</strong>{' '}
                                                                                        {expandedRoomDetails.startDate
                                                                                            ? new Date(expandedRoomDetails.startDate).toLocaleDateString('vi-VN')
                                                                                            : 'Không xác định'}
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid item xs={6}>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Tình trạng:</strong> {getRoomStatusLabel(expandedRoomDetails.status)}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Thời gian check-in:</strong>{' '}
                                                                                        {expandedRoomDetails.checkInDuration
                                                                                            ? `${expandedRoomDetails.checkInDuration} giờ`
                                                                                            : '0 giờ'}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Ghi chú:</strong> {expandedRoomDetails.note || 'Không có'}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.875rem' }}>
                                                                                        <strong>Chi nhánh:</strong> Chi nhánh trung tâm
                                                                                    </Typography>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ fontSize: '0.875rem' }}>
                                                    {categoryRoom && categoryRoom !== ''
                                                        ? 'Không có phòng nào thuộc hạng phòng đã chọn'
                                                        : 'Không có dữ liệu phòng'}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CustomTabPanel>

                        {/* Thanh phân trang và chọn số bản ghi */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel sx={{ fontSize: '0.875rem' }}>Số bản ghi</InputLabel>
                                <Select
                                    value={recordsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    label="Số bản ghi"
                                    sx={{ fontSize: '0.875rem' }}
                                >
                                    <MenuItem value={5} sx={{ fontSize: '0.875rem' }}>
                                        5
                                    </MenuItem>
                                    <MenuItem value={10} sx={{ fontSize: '0.875rem' }}>
                                        10
                                    </MenuItem>
                                    <MenuItem value={15} sx={{ fontSize: '0.875rem' }}>
                                        15
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <TablePagination
                                component="div"
                                count={totalRecords}
                                page={page}
                                onPageChange={handlePageChange}
                                rowsPerPage={recordsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                rowsPerPageOptions={[]}
                                sx={{ fontSize: '0.875rem' }}
                                labelRowsPerPage=""
                                labelDisplayedRows={({ from, to, count }) => `${from}–${to} trong ${count}`}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}