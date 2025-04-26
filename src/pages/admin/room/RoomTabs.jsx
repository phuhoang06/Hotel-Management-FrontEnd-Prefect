import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import RoomViewService from "../../../service/admin/room.service.js";

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{
                opacity: value === index ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                minHeight: '400px',
                display: value === index ? 'block' : 'none',
            }}
            {...other}
        >
            <Box sx={{ p: 3 }}>{children}</Box>
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export default function RoomTabs() {
    const [value, setValue] = React.useState(0);
    const [searchCategory, setSearchCategory] = React.useState('');
    const [statusCategory, setStatusCategory] = React.useState({ active: true, inactive: false });
    const [recordsPerPage, setRecordsPerPage] = React.useState(3);
    const [searchRoom, setSearchRoom] = React.useState('');
    const [categoryRoom, setCategoryRoom] = React.useState('');
    const [statusRoom, setStatusRoom] = React.useState('');
    const [selectedCategories, setSelectedCategories] = React.useState([]);
    const [expandedRow, setExpandedRow] = React.useState(null);
    const [expandedRowDetails, setExpandedRowDetails] = React.useState(null);
    const [expandedRoomRow, setExpandedRoomRow] = React.useState(null);
    const [expandedRoomDetails, setExpandedRoomDetails] = React.useState(null);
    const [roomCategories, setRoomCategories] = React.useState([]);
    const [rooms, setRooms] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [pageCategories, setPageCategories] = React.useState(0);
    const [totalCategories, setTotalCategories] = React.useState(0);
    const [pageRooms, setPageRooms] = React.useState(0);
    const [totalRooms, setTotalRooms] = React.useState(0);

    const filteredCategories = React.useCallback(async (currentPage = 0) => {
        try {
            setLoading(true);
            const status = statusCategory.active ? 'ACTIVE' : statusCategory.inactive ? 'INACTIVE' : '';
            const response = await RoomViewService.searchRoomCategories({
                keyword: searchCategory,
                status,
                page: currentPage,
                size: recordsPerPage,
            });
            setRoomCategories(response.data.content);
            setTotalCategories(response.data.totalElements);
        } catch (err) {
            console.error('Lỗi khi tìm kiếm hạng phòng:', err);
            toast.error(`Không thể tìm kiếm hạng phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [searchCategory, statusCategory, recordsPerPage]);

    const filteredRooms = React.useCallback(async (currentPage = 0) => {
        try {
            setLoading(true);
            const response = await RoomViewService.searchRoomView({
                keyword: searchRoom,
                status: statusRoom,
                page: currentPage,
                size: recordsPerPage,
            });
            setRooms(response.data.content);
            setTotalRooms(response.data.totalElements);
        } catch (err) {
            console.error('Lỗi khi tìm kiếm phòng:', err);
            toast.error(`Không thể tìm kiếm phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [searchRoom, statusRoom, recordsPerPage]);

    const fetchRoomCategories = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await RoomViewService.getRoomCategories();
            setRoomCategories(response.data);
        } catch (err) {
            console.error('Lỗi khi tải danh sách hạng phòng:', err);
            toast.error(`Không thể tải danh sách hạng phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRooms = React.useCallback(async (currentPage = 0) => {
        try {
            setLoading(true);
            const response = await RoomViewService.getAllRoomView(currentPage, recordsPerPage);
            setRooms(response.data.content);
            if (response.data && response.data.totalElements !== undefined) {
                setTotalRooms(response.data.totalElements);
            } else {
                setTotalRooms(0);
            }
        } catch (err) {
            console.error('Lỗi khi tải danh sách phòng:', err);
            toast.error(`Không thể tải danh sách phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [recordsPerPage]);

    const initializeData = React.useCallback(async () => {
        await Promise.all([fetchRoomCategories(), fetchRooms()]);
    }, [fetchRoomCategories, fetchRooms]);

    React.useEffect(() => {
        initializeData().catch((err) => {
            console.error('Lỗi khi khởi tạo dữ liệu:', err);
            toast.error('Không thể khởi tạo dữ liệu');
        });
    }, [initializeData]);

    React.useEffect(() => {
        const fetchData = async () => {
            if (value === 0) {
                await filteredCategories(pageCategories);
            } else {
                await filteredRooms(pageRooms);
            }
        };

        fetchData().catch((err) => {
            console.error('Lỗi khi lọc dữ liệu:', err);
            toast.error('Không thể lọc dữ liệu');
        });
    }, [value, searchCategory, statusCategory, recordsPerPage, searchRoom, categoryRoom, statusRoom, filteredCategories, filteredRooms, pageCategories, pageRooms]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setExpandedRow(null);
        setExpandedRowDetails(null);
        setExpandedRoomRow(null);
        setExpandedRoomDetails(null);
        setSelectedCategories([]);
    };

    const handleRowClick = async (category) => {
        if (expandedRow === category.id) {
            setExpandedRow(null);
            setExpandedRowDetails(null);
        } else {
            setExpandedRow(category.id);
            try {
                setLoading(true);
                const response = await RoomViewService.getRoomCategoryById(category.id);
                setExpandedRowDetails(response.data);
            } catch (err) {
                console.error('Lỗi khi tải thông tin chi tiết hạng phòng:', err);
                toast.error(`Không thể tải thông tin chi tiết hạng phòng: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRoomRowClick = async (room) => {
        if (expandedRoomRow === room.id) {
            setExpandedRoomRow(null);
            setExpandedRoomDetails(null);
        } else {
            setExpandedRoomRow(room.id);
            try {
                setLoading(true);
                // Giả định có API getRoomById, nếu không thì có thể dùng dữ liệu hiện tại
                const response = await RoomViewService.getRoomById(room.id);
                setExpandedRoomDetails(response.data);
            } catch (err) {
                console.error('Lỗi khi tải thông tin chi tiết phòng:', err);
                toast.error(`Không thể tải thông tin chi tiết phòng: ${err.message}`);
                // Nếu không có API, sử dụng dữ liệu hiện tại
                setExpandedRoomDetails(room);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCheckboxChange = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleUpdate = (category) => {
        alert(`Điều hướng đến form chỉnh sửa hạng phòng: ${category.id}`);
    };

    const handleDeactivate = async (category) => {
        try {
            setLoading(true);
            await RoomViewService.updateRoomCategoryStatus(category.id, 'INACTIVE');
            await fetchRoomCategories();
            setExpandedRow(null);
            setExpandedRowDetails(null);
            toast.success('Đã ngừng kinh doanh hạng phòng thành công');
        } catch (err) {
            console.error('Lỗi khi ngừng kinh doanh hạng phòng:', err);
            toast.error(`Không thể ngừng kinh doanh hạng phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (category) => {
        try {
            setLoading(true);
            await RoomViewService.deleteRoomCategory(category.id);
            await fetchRoomCategories();
            setExpandedRow(null);
            setExpandedRowDetails(null);
            toast.success('Đã xóa hạng phòng thành công');
        } catch (err) {
            console.error('Lỗi khi xóa hạng phòng:', err);
            toast.error(`Không thể xóa hạng phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoriesPageChange = (event, newPage) => {
        setPageCategories(newPage);
        setExpandedRow(null);
        setExpandedRowDetails(null);
    };

    const handleRoomsPageChange = (event, newPage) => {
        setPageRooms(newPage);
        setExpandedRoomRow(null);
        setExpandedRoomDetails(null);
    };

    const handleRowsPerPageChange = (event) => {
        const newRecordsPerPage = parseInt(event.target.value, 10);
        setRecordsPerPage(newRecordsPerPage);
        setPageCategories(0);
        setPageRooms(0);
        setExpandedRow(null);
        setExpandedRowDetails(null);
        setExpandedRoomRow(null);
        setExpandedRoomDetails(null);
    };

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

    return (
        <Box sx={{ width: '100%' }}>
            {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={value} onChange={handleChange} aria-label="room tabs">
                    <Tab label="Hạng phòng" {...a11yProps(0)} />
                    <Tab label="Danh sách phòng" {...a11yProps(1)} />
                </Tabs>
                <Button variant="contained" color="success" startIcon={<span>+</span>}>
                    Thêm mới
                </Button>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={3}>
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                         {value === 0 ? (
                             <>
                                 <TextField
                                     fullWidth
                                     label="Tìm kiếm hạng phòng"
                                     value={searchCategory}
                                     onChange={(e) => setSearchCategory(e.target.value)}
                                     sx={{ mb: 1 }}
                                 />
                                 <Box sx={{ mb: 1 }}>
                                     <FormControlLabel
                                         control={<Checkbox checked={statusCategory.active} onChange={(e) => setStatusCategory({ ...statusCategory, active: e.target.checked, inactive: !e.target.checked })} />}
                                         label="Đang kinh doanh"
                                     />
                                     <FormControlLabel
                                         control={<Checkbox checked={statusCategory.inactive} onChange={(e) => setStatusCategory({ ...statusCategory, inactive: e.target.checked, active: !e.target.checked })} />}
                                         label="Ngừng kinh doanh"
                                     />
                                 </Box>
                                 <FormControl fullWidth>
                                     <InputLabel>Số bản ghi</InputLabel>
                                     <Select
                                         variant="outlined"
                                         value={recordsPerPage}
                                         onChange={handleRowsPerPageChange}
                                         label="Số bản ghi"
                                     >
                                         <MenuItem value={3}>3</MenuItem>
                                         <MenuItem value={5}>5</MenuItem>
                                         <MenuItem value={10}>10</MenuItem>
                                         <MenuItem value={15}>15</MenuItem>
                                     </Select>
                                 </FormControl>
                             </>
                         ) : (
                             <>
                                 <TextField
                                     fullWidth
                                     label="Tìm kiếm phòng"
                                     value={searchRoom}
                                     onChange={(e) => setSearchRoom(e.target.value)}
                                     sx={{ mb: 1 }}
                                 />
                                 <FormControl fullWidth sx={{ mb: 1 }}>
                                     <InputLabel>Loại phòng</InputLabel>
                                     <Select
                                         variant="outlined"
                                         value={categoryRoom}
                                         onChange={(e) => setCategoryRoom(e.target.value)}
                                         label="Loại phòng"
                                     >
                                         <MenuItem value="">Tất cả</MenuItem>
                                         {roomCategories.map((category) => (
                                             <MenuItem key={category.id} value={category.id}>
                                                 {category.name}
                                             </MenuItem>
                                         ))}
                                     </Select>
                                 </FormControl>
                                 <FormControl fullWidth sx={{ mb: 1 }}>
                                     <InputLabel>Tình trạng</InputLabel>
                                     <Select
                                         variant="outlined"
                                         value={statusRoom}
                                         onChange={(e) => setStatusRoom(e.target.value)}
                                         label="Tình trạng"
                                     >
                                         <MenuItem value="">Tất cả</MenuItem>
                                         <MenuItem value="AVAILABLE">Trống</MenuItem>
                                         <MenuItem value="UPCOMING">Sắp tới</MenuItem>
                                         <MenuItem value="IN_USE">Đang sử dụng</MenuItem>
                                         <MenuItem value="CHECKOUT_SOON">Sắp trả phòng</MenuItem>
                                         <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
                                         <MenuItem value="OVERDUE">Quá hạn</MenuItem>
                                     </Select>
                                 </FormControl>
                                 <FormControl fullWidth>
                                     <InputLabel>Số bản ghi</InputLabel>
                                     <Select
                                         variant="outlined"
                                         value={recordsPerPage}
                                         onChange={handleRowsPerPageChange}
                                         label="Số bản ghi"
                                     >
                                         <MenuItem value={3}>3</MenuItem>
                                         <MenuItem value={5}>5</MenuItem>
                                         <MenuItem value={10}>10</MenuItem>
                                         <MenuItem value={15}>15</MenuItem>
                                     </Select>
                                 </FormControl>
                             </>
                         )}
                    </Box>
                </Grid>

                <Grid item xs={12} sm={8} md={9}>
                    <CustomTabPanel value={value} index={0}>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Hạng phòng & Phòng
                        </Typography>
                        <Box sx={{ overflowX: 'auto' }}>
                            <Table sx={{ minWidth: { xs: 650, sm: 'auto' } }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ px: 1 }}>
                                            <Checkbox
                                                checked={selectedCategories.length === roomCategories.length && roomCategories.length > 0}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedCategories(roomCategories.map((category) => category.id));
                                                    } else {
                                                        setSelectedCategories([]);
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ px: 1 }}>Mã hạng phòng</TableCell>
                                        <TableCell sx={{ px: 1 }}>Tên hạng phòng</TableCell>
                                        <TableCell sx={{ px: 1 }}>Số lượng phòng</TableCell>
                                        <TableCell sx={{ px: 1 }}>Giá giờ</TableCell>
                                        <TableCell sx={{ px: 1 }}>Giá ngày</TableCell>
                                        <TableCell sx={{ px: 1 }}>Giá đầu mút</TableCell>
                                        <TableCell sx={{ px: 1 }}>Trạng thái</TableCell>
                                        <TableCell sx={{ px: 1 }}>Chỉnh sửa</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {roomCategories.map((category) => (
                                        <React.Fragment key={category.id}>
                                            <TableRow
                                                onClick={() => handleRowClick(category)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    bgcolor: expandedRow === category.id ? 'grey.200' : 'inherit',
                                                }}
                                            >
                                                <TableCell sx={{ px: 1 }}>
                                                    <Checkbox
                                                        checked={selectedCategories.includes(category.id)}
                                                        onChange={() => handleCheckboxChange(category.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ px: 1 }}>{category.code}</TableCell>
                                                <TableCell sx={{ px: 1 }}>{category.name}</TableCell>
                                                <TableCell sx={{ px: 1 }}>{category.rooms?.length || 0}</TableCell>
                                                <TableCell sx={{ px: 1 }}>{category.hourlyPrice.toLocaleString()} đ</TableCell>
                                                <TableCell sx={{ px: 1 }}>{category.dailyPrice.toLocaleString()} đ</TableCell>
                                                <TableCell sx={{ px: 1 }}>{category.overnightPrice.toLocaleString()} đ</TableCell>
                                                <TableCell sx={{ px: 1 }}>{category.status === 'ACTIVE' ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}</TableCell>
                                                <TableCell sx={{ px: 1 }}>
                                                    <Button variant="text" color="primary" onClick={(e) => { e.stopPropagation(); handleUpdate(category); }}>
                                                        Chỉnh sửa tạm
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            {expandedRow === category.id && expandedRowDetails && (
                                                <TableRow>
                                                    <TableCell colSpan={9} sx={{ bgcolor: 'grey.100', py: 2 }}>
                                                        <Box sx={{ px: 2 }}>
                                                            <Typography variant="h6" sx={{ mb: 2 }}>
                                                                Thông tin
                                                            </Typography>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} md={3}>
                                                                    <CardMedia
                                                                        component="img"
                                                                        height="140"
                                                                        image={expandedRowDetails.imgUrl || 'https://via.placeholder.com/150'}
                                                                        alt={expandedRowDetails.name}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} md={9}>
                                                                    <Grid container spacing={1}>
                                                                        <Grid item xs={12}>
                                                                            <Typography>
                                                                                <strong>Mã hạng phòng:</strong> {expandedRowDetails.code}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <Typography>
                                                                                <strong>Tên hạng phòng:</strong> {expandedRowDetails.name}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <Typography>
                                                                                <strong>Sức chứa tối đa:</strong> {expandedRowDetails.maxAdultCapacity} người lớn, {expandedRowDetails.maxChildCapacity} trẻ em
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <Typography>
                                                                                <strong>Sức chứa từ chuẩn:</strong> {expandedRowDetails.standardAdultCapacity} người lớn, {expandedRowDetails.standardChildCapacity} trẻ em
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <Typography>
                                                                                <strong>Chi nhánh:</strong> Chi nhánh trung tâm
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <Typography>
                                                                                <strong>Số lượng phòng:</strong> {expandedRowDetails.rooms?.length || 0}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <Typography>
                                                                                <strong>Giá giờ:</strong> {expandedRowDetails.hourlyPrice.toLocaleString()} đ
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <Typography>
                                                                                <strong>Giá ngày:</strong> {expandedRowDetails.dailyPrice.toLocaleString()} đ
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <Typography>
                                                                                <strong>Giá qua đêm:</strong> {expandedRowDetails.overnightPrice.toLocaleString()} đ
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <Typography>
                                                                                <strong>Phí thuê giường:</strong> {expandedRowDetails.defaultExtraFee.toLocaleString()} đ
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                                                                <Button
                                                                    variant="contained"
                                                                    color="success"
                                                                    onClick={() => handleUpdate(category)}
                                                                >
                                                                    Cập nhật
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={() => handleDeactivate(category)}
                                                                >
                                                                    Ngừng kinh doanh
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={() => handleDelete(category)}
                                                                >
                                                                    Xóa
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                        <TablePagination
                            component="div"
                            count={totalCategories}
                            page={pageCategories}
                            onPageChange={handleCategoriesPageChange}
                            rowsPerPage={recordsPerPage}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPageOptions={[3, 5, 10, 15]}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Hạng phòng & Phòng
                        </Typography>
                        <Box sx={{ overflowX: 'auto' }}>
                            <Table sx={{ minWidth: { xs: 650, sm: 'auto' } }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ px: 1 }}>Mã phòng</TableCell>
                                        <TableCell sx={{ px: 1 }}>Hạng phòng</TableCell>
                                        <TableCell sx={{ px: 1 }}>Tầng</TableCell>
                                        <TableCell sx={{ px: 1 }}>Tình trạng</TableCell>
                                        <TableCell sx={{ px: 1 }}>Trạng thái dọn dẹp</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rooms.map((room) => (
                                        <React.Fragment key={room.id}>
                                            <TableRow
                                                onClick={() => handleRoomRowClick(room)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    bgcolor: expandedRoomRow === room.id ? 'grey.200' : 'inherit',
                                                }}
                                            >
                                                <TableCell sx={{ px: 1 }}>{room.id}</TableCell>
                                                <TableCell sx={{ px: 1 }}>{room.roomCategory?.name || 'Không xác định'}</TableCell>
                                                <TableCell sx={{ px: 1 }}>{room.floor !== null && room.floor !== undefined ? room.floor : 'Không xác định'}</TableCell>
                                                <TableCell sx={{ px: 1 }}>{getRoomStatusLabel(room.status)}</TableCell>
                                                <TableCell sx={{ px: 1 }}>{room.isClean ? 'Sạch' : 'Chưa dọn'}</TableCell>
                                            </TableRow>
                                            {expandedRoomRow === room.id && expandedRoomDetails && (
                                                <TableRow>
                                                    <TableCell colSpan={5} sx={{ bgcolor: 'grey.100', py: 2 }}>
                                                        <Box sx={{ px: 2 }}>
                                                            <Typography variant="h6" sx={{ mb: 2 }}>
                                                                Thông tin
                                                            </Typography>
                                                            <Grid container spacing={1}>
                                                                <Grid item xs={12}>
                                                                    <Typography>
                                                                        <strong>Mã phòng:</strong> {expandedRoomDetails.id}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Typography>
                                                                        <strong>Hạng phòng:</strong> {expandedRoomDetails.roomCategory?.name || 'Không xác định'}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Typography>
                                                                        <strong>Tầng:</strong> {expandedRoomDetails.floor !== null && expandedRoomDetails.floor !== undefined ? expandedRoomDetails.floor : 'Không xác định'}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Typography>
                                                                        <strong>Tình trạng:</strong> {getRoomStatusLabel(expandedRoomDetails.status)}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Typography>
                                                                        <strong>Trạng thái dọn dẹp:</strong> {expandedRoomDetails.isClean ? 'Sạch' : 'Chưa dọn'}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Typography>
                                                                        <strong>Chi nhánh:</strong> Chi nhánh trung tâm
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                        <TablePagination
                            component="div"
                            count={totalRooms}
                            page={pageRooms}
                            onPageChange={handleRoomsPageChange}
                            rowsPerPage={recordsPerPage}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPageOptions={[3, 5, 10, 15]}
                        />
                    </CustomTabPanel>
                </Grid>
            </Grid>
        </Box>
    );
}