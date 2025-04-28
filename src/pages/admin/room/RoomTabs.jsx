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
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { toast } from 'react-toastify';
import RoomViewService from "../../../service/admin/room.service";

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
                transition: 'opacity 0.24s ease-in-out',
                minHeight: '320px',
                display: value === index ? 'block' : 'none',
            }}
            {...other}
        >
            <Box sx={{ p: 1.6 }}>{children}</Box>
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

    // Định nghĩa placeholder image
    const placeholderImage = '';

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
            if (response?.data?.content) {
                setRoomCategories(response.data.content);
                setTotalCategories(response.data.totalElements || 0);
            } else {
                setRoomCategories([]);
                setTotalCategories(0);
                toast.error('Không có dữ liệu hạng phòng trả về');
            }
        } catch (err) {
            console.error('Lỗi khi tìm kiếm hạng phòng:', err);
            setRoomCategories([]);
            setTotalCategories(0);
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
            if (response?.data?.content) {
                setRooms(response.data.content);
                setTotalRooms(response.data.totalElements || 0);
            } else {
                setRooms([]);
                setTotalRooms(0);
                toast.error('Không có dữ liệu phòng trả về');
            }
        } catch (err) {
            console.error('Lỗi khi tìm kiếm phòng:', err);
            setRooms([]);
            setTotalRooms(0);
            toast.error(`Không thể tìm kiếm phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [searchRoom, statusRoom, recordsPerPage]);

    const fetchRoomCategories = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await RoomViewService.getRoomCategories();
            if (response?.data) {
                setRoomCategories(response.data);
            } else {
                setRoomCategories([]);
                toast.error('Không có dữ liệu hạng phòng trả về');
            }
        } catch (err) {
            console.error('Lỗi khi tải danh sách hạng phòng:', err);
            setRoomCategories([]);
            toast.error(`Không thể tải danh sách hạng phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRooms = React.useCallback(async (currentPage = 0) => {
        try {
            setLoading(true);
            const response = await RoomViewService.getAllRoomView(currentPage, recordsPerPage);
            if (response?.data?.content) {
                setRooms(response.data.content);
                setTotalRooms(response.data.totalElements || 0);
            } else {
                setRooms([]);
                setTotalRooms(0);
                toast.error('Không có dữ liệu phòng trả về');
            }
        } catch (err) {
            console.error('Lỗi khi tải danh sách phòng:', err);
            setRooms([]);
            setTotalRooms(0);
            toast.error(`Không thể tải danh sách phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [recordsPerPage]);

    const initializeData = React.useCallback(async () => {
        try {
            await Promise.all([fetchRoomCategories(), fetchRooms()]);
        } catch (err) {
            console.error('Lỗi khi khởi tạo dữ liệu:', err);
            toast.error('Không thể khởi tạo dữ liệu');
        }
    }, [fetchRoomCategories, fetchRooms]);

    React.useEffect(() => {
        initializeData().catch((err) => console.error('Lỗi trong useEffect:', err));
    }, [initializeData]);

    React.useEffect(() => {
        const fetchData = async () => {
            if (value === 0) {
                await filteredCategories(pageCategories);
            } else {
                await filteredRooms(pageRooms);
            }
        };
        fetchData().catch((err) => console.error('Lỗi trong useEffect:', err));
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
            setExpandedRow(structuredClone(null));
            setExpandedRowDetails(structuredClone(null));
        } else {
            setExpandedRow(structuredClone(category.id));
            try {
                setLoading(true);
                const response = await RoomViewService.getRoomCategoryById(category.id);
                setExpandedRowDetails(structuredClone(response?.data || null));
            } catch (err) {
                console.error('Lỗi khi tải thông tin chi tiết hạng phòng:', err);
                setExpandedRowDetails(structuredClone(null));
                toast.error(`Không thể tải thông tin chi tiết hạng phòng: ${err.message}`);
            } finally {
                setLoading(false);
                console.log(expandedRowDetails);
            }
        }
    };

    const handleRoomRowClick = async (room) => {
        if (expandedRoomRow === room.id) {
            setExpandedRoomRow(structuredClone(null));
            setExpandedRoomDetails(structuredClone(null));
        } else {
            setExpandedRoomRow(structuredClone(room.id));
            try {
                setLoading(true);
                const response = await RoomViewService.getRoomById(room.id);
                setExpandedRoomDetails(structuredClone(response?.data || room));
            } catch (err) {
                console.error('Lỗi khi tải thông tin chi tiết phòng:', err);
                setExpandedRoomDetails(structuredClone(room));
                toast.error(`Không thể tải thông tin chi tiết phòng: ${err.message}`);
            } finally {
                setLoading(false);
                console.log(expandedRoomRow);
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

    const handleUpdate = (category, e) => {
        e?.stopPropagation();
        alert(`Điều hướng đến form chỉnh sửa hạng phòng: ${category.id}`);
    };

    const handleDeactivate = async (category, e) => {
        e?.stopPropagation();
        try {
            setLoading(true);
            await RoomViewService.updateRoomCategoryStatus(category.id, 'INACTIVE');
            await filteredCategories(pageCategories);
            setExpandedRow(structuredClone(null));
            setExpandedRowDetails(structuredClone(null));
            toast.success('Đã ngừng kinh doanh hạng phòng thành công');
        } catch (err) {
            console.error('Lỗi khi ngừng kinh doanh hạng phòng:', err);
            toast.error(`Không thể ngừng kinh doanh hạng phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (category, e) => {
        e?.stopPropagation();
        try {
            setLoading(true);
            await RoomViewService.deleteRoomCategory(category.id);
            await filteredCategories(pageCategories);
            setExpandedRow(structuredClone(null));
            setExpandedRowDetails(structuredClone(null));
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
        setExpandedRow(structuredClone(null));
        setExpandedRowDetails(structuredClone(null));
    };

    const handleRoomsPageChange = (event, newPage) => {
        setPageRooms(newPage);
        setExpandedRoomRow(structuredClone(null));
        setExpandedRoomDetails(structuredClone(null));
    };

    const handleRowsPerPageChange = (event) => {
        const newRecordsPerPage = parseInt(event.target.value, 10);
        setRecordsPerPage(newRecordsPerPage);
        setPageCategories(0);
        setPageRooms(0);
        setExpandedRow(structuredClone(null));
        setExpandedRowDetails(structuredClone(null));
        setExpandedRoomRow(structuredClone(null));
        setExpandedRoomDetails(structuredClone(null));
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

    const roomsColumns = [
        { id: 'id', label: 'Mã phòng', width: '80px' },
        { id: 'category', label: 'Hạng phòng', width: '144px' },
        { id: 'floor', label: 'Tầng', width: '64px' },
        { id: 'status', label: 'Tình trạng', width: '120px' },
        { id: 'clean', label: 'Trạng thái dọn dẹp', width: '144px' },
    ];

    return (
        <Box sx={{ width: '100%', minWidth: '960px', fontSize: '0.7rem' }}>
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
                    <CircularProgress size="2rem" />
                </Box>
            )}

            <Paper elevation={2} sx={{ mb: 2.4, minWidth: '960px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', px: 1.6 }}>
                    <Tabs value={value} onChange={handleChange} aria-label="room tabs">
                        <Tab label="Hạng phòng" {...a11yProps(0)} sx={{ py: 1.6 }} />
                        <Tab label="Danh sách phòng" {...a11yProps(1)} sx={{ py: 1.6 }} />
                    </Tabs>
                    <Button variant="contained" color="success" startIcon={<span>+</span>} sx={{ fontSize: '0.7rem' }}>
                        Thêm mới
                    </Button>
                </Box>
            </Paper>

            <Grid container spacing={2.4} sx={{ minWidth: '960px' }}>
                <Grid item xs={4}>
                    <Paper elevation={1} sx={{ p: 1.6, height: '100%' }}>
                        {value === 0 ? (
                            <>
                                <TextField
                                    fullWidth
                                    label="Tìm kiếm hạng phòng"
                                    value={searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                    sx={{ mb: 1.6 }}
                                    size="small"
                                />
                                <Box sx={{ mb: 1.6 }}>
                                    <FormControlLabel
                                        control={<Checkbox checked={statusCategory.active} onChange={(e) => setStatusCategory({ ...statusCategory, active: e.target.checked, inactive: !e.target.checked })} size="small" />}
                                        label="Đang kinh doanh"
                                        sx={{ '& .MuiTypography-root': { fontSize: '0.7rem' } }}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={statusCategory.inactive} onChange={(e) => setStatusCategory({ ...statusCategory, inactive: e.target.checked, active: !e.target.checked })} size="small" />}
                                        label="Ngừng kinh doanh"
                                        sx={{ '& .MuiTypography-root': { fontSize: '0.7rem' } }}
                                    />
                                </Box>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ fontSize: '0.7rem' }}>Số bản ghi</InputLabel>
                                    <Select
                                        value={recordsPerPage}
                                        onChange={handleRowsPerPageChange}
                                        label="Số bản ghi"
                                        variant="outlined"
                                        sx={{ fontSize: '0.7rem' }}
                                    >
                                        <MenuItem value={3} sx={{ fontSize: '0.7rem' }}>3</MenuItem>
                                        <MenuItem value={5} sx={{ fontSize: '0.7rem' }}>5</MenuItem>
                                        <MenuItem value={10} sx={{ fontSize: '0.7rem' }}>10</MenuItem>
                                        <MenuItem value={15} sx={{ fontSize: '0.7rem' }}>15</MenuItem>
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
                                    sx={{ mb: 1.6 }}
                                    size="small"
                                />
                                <FormControl fullWidth sx={{ mb: 1.6 }} size="small">
                                    <InputLabel sx={{ fontSize: '0.7rem' }}>Loại phòng</InputLabel>
                                    <Select
                                        value={categoryRoom}
                                        onChange={(e) => setCategoryRoom(e.target.value)}
                                        label="Loại phòng"
                                        variant="outlined"
                                        sx={{ fontSize: '0.7rem' }}
                                    >
                                        <MenuItem value="" sx={{ fontSize: '0.7rem' }}>Tất cả</MenuItem>
                                        {roomCategories.map((category) => (
                                            <MenuItem key={category.id} value={category.id} sx={{ fontSize: '0.7rem' }}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth sx={{ mb: 1.6 }} size="small">
                                    <InputLabel sx={{ fontSize: '0.7rem' }}>Tình trạng</InputLabel>
                                    <Select
                                        value={statusRoom}
                                        onChange={(e) => setStatusRoom(e.target.value)}
                                        label="Tình trạng"
                                        variant="outlined"
                                        sx={{ fontSize: '0.7rem' }}
                                    >
                                        <MenuItem value="" sx={{ fontSize: '0.7rem' }}>Tất cả</MenuItem>
                                        <MenuItem value="AVAILABLE" sx={{ fontSize: '0.7rem' }}>Trống</MenuItem>
                                        <MenuItem value="UPCOMING" sx={{ fontSize: '0.7rem' }}>Sắp tới</MenuItem>
                                        <MenuItem value="IN_USE" sx={{ fontSize: '0.7rem' }}>Đang sử dụng</MenuItem>
                                        <MenuItem value="CHECKOUT_SOON" sx={{ fontSize: '0.7rem' }}>Sắp trả phòng</MenuItem>
                                        <MenuItem value="MAINTENANCE" sx={{ fontSize: '0.7rem' }}>Bảo trì</MenuItem>
                                        <MenuItem value="OVERDUE" sx={{ fontSize: '0.7rem' }}>Quá hạn</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ fontSize: '0.7rem' }}>Số bản ghi</InputLabel>
                                    <Select
                                        value={recordsPerPage}
                                        onChange={handleRowsPerPageChange}
                                        label="Số bản ghi"
                                        variant="outlined"
                                        sx={{ fontSize: '0.7rem' }}
                                    >
                                        <MenuItem value={3} sx={{ fontSize: '0.7rem' }}>3</MenuItem>
                                        <MenuItem value={5} sx={{ fontSize: '0.7rem' }}>5</MenuItem>
                                        <MenuItem value={10} sx={{ fontSize: '0.7rem' }}>10</MenuItem>
                                        <MenuItem value={15} sx={{ fontSize: '0.7rem' }}>15</MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={8}>
                    <Paper elevation={2} sx={{ height: '100%' }}>
                        <CustomTabPanel value={value} index={0}>
                            <Typography variant="h6" sx={{ mb: 1.6, px: 0.8, fontSize: '0.8rem' }}>
                                Hạng phòng & Phòng
                            </Typography>
                            <TableContainer sx={{ maxHeight: '320px' }}>
                                <Table size="small" stickyHeader sx={{ fontSize: '0.6rem' }}>
                                    <TableHead>
                                        <TableRow>
                                            {categoriesColumns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    sx={{
                                                        px: 0.4,
                                                        py: 0.4,
                                                        width: column.width,
                                                        whiteSpace: 'nowrap',
                                                        fontWeight: 'bold',
                                                        backgroundColor: '#f5f5f5',
                                                        fontSize: '0.6rem',
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
                                                    ) : column.label}
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
                                                            '&:hover': {
                                                                bgcolor: 'rgba(0, 0, 0, 0.08)',
                                                            },
                                                        }}
                                                    >
                                                        <TableCell sx={{ px: 0.4, py: 0.4 }}>
                                                            <Checkbox
                                                                checked={selectedCategories.includes(category.id)}
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCheckboxChange(category.id);
                                                                }}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ px: 0.4, py: 0.4, fontSize: '0.6rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>{category.code}</TableCell>
                                                        <TableCell sx={{ px: 0.4, py: 0.4, fontSize: '0.6rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>{category.name}</TableCell>
                                                        <TableCell sx={{ px: 0.4, py: 0.4, fontSize: '0.6rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>{category.rooms?.length || 0}</TableCell>
                                                        <TableCell sx={{ px: 0.4, py: 0.4, fontSize: '0.6rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>{category.hourlyPrice?.toLocaleString() || 'N/A'} đ</TableCell>
                                                        <TableCell sx={{ px: 0.4, py: 0.4, fontSize: '0.6rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>{category.dailyPrice?.toLocaleString() || 'N/A'} đ</TableCell>
                                                        <TableCell sx={{ px: 0.4, py: 0.4, fontSize: '0.6rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>{category.overnightPrice?.toLocaleString() || 'N/A'} đ</TableCell>
                                                        <TableCell sx={{ px: 0.4, py: 0.4, fontSize: '0.6rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                            <Box
                                                                sx={{
                                                                    display: 'inline-block',
                                                                    px: 0.4,
                                                                    py: 0.2,
                                                                    borderRadius: 0.8,
                                                                    bgcolor: category.status === 'ACTIVE' ? 'success.light' : 'error.light',
                                                                    color: 'white',
                                                                    fontSize: '0.6rem',
                                                                }}
                                                            >
                                                                {category.status === 'ACTIVE' ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell sx={{ px: 0.4, py: 0.4 }}>
                                                            <Button
                                                                variant="text"
                                                                color="primary"
                                                                onClick={(e) => handleUpdate(category, e)}
                                                                size="small"
                                                                sx={{ fontSize: '0.6rem', minWidth: 'auto' }}
                                                            >
                                                                Chỉnh sửa
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                    {expandedRow === category.id && expandedRowDetails && (
                                                        <TableRow>
                                                            <TableCell colSpan={9} sx={{ p: 0 }}>
                                                                <Box sx={{
                                                                    p: 0.8,
                                                                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                                                                    borderTop: '1px dashed rgba(0, 0, 0, 0.1)',
                                                                    borderBottom: '1px dashed rgba(0, 0, 0, 0.1)',
                                                                    fontSize: '0.6rem'
                                                                }}>
                                                                    <Typography variant="subtitle1" sx={{ mb: 0.8, fontWeight: 'bold', fontSize: '0.7rem' }}>
                                                                        Thông tin chi tiết
                                                                    </Typography>
                                                                    <Grid container spacing={0.8}>
                                                                        <Grid item xs={4}>
                                                                            <Box>
                                                                                <Typography variant="body2" sx={{ fontSize: '0.6rem', fontWeight: 'bold' }}>
                                                                                    Ảnh:
                                                                                </Typography>
                                                                                <img
                                                                                    src={expandedRowDetails.imgUrl ? (expandedRowDetails.imgUrl.startsWith('http') ? expandedRowDetails.imgUrl : `http://localhost:8080/${expandedRowDetails.imgUrl}`) : placeholderImage}
                                                                                    alt={expandedRowDetails.name}
                                                                                    style={{
                                                                                        width: '120px', // 150px * 0.8
                                                                                        height: '120px', // 150px * 0.8
                                                                                        objectFit: 'cover',
                                                                                        marginTop: '6.4px' // 8px * 0.8
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={8}>
                                                                            <Grid container spacing={0.8}>
                                                                                <Grid item xs={6}>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
                                                                                        <strong>Mã hạng phòng:</strong> {expandedRowDetails.code}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
                                                                                        <strong>Tên hạng phòng:</strong> {expandedRowDetails.name}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
                                                                                        <strong>Sức chứa tối đa:</strong> {expandedRowDetails.maxAdultCapacity} người lớn, {expandedRowDetails.maxChildCapacity} trẻ em
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
                                                                                        <strong>Sức chứa từ chuẩn:</strong> {expandedRowDetails.standardAdultCapacity} người lớn, {expandedRowDetails.standardChildCapacity} trẻ em
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid item xs={6}>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
                                                                                        <strong>Chi nhánh:</strong> Chi nhánh trung tâm
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
                                                                                        <strong>Số lượng phòng:</strong> {expandedRowDetails.rooms?.length || 0}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
                                                                                        <strong>Giá giờ:</strong> {expandedRowDetails.hourlyPrice?.toLocaleString() || 'N/A'} đ
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
                                                                                        <strong>Giá ngày:</strong> {expandedRowDetails.dailyPrice?.toLocaleString() || 'N/A'} đ
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
                                                                                        <strong>Giá qua đêm:</strong> {expandedRowDetails.overnightPrice?.toLocaleString() || 'N/A'} đ
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
                                                                                        <strong>Phí thuê giường:</strong> {expandedRowDetails.defaultExtraFee?.toLocaleString() || 'N/A'} đ
                                                                                    </Typography>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.8, gap: 0.4 }}>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="success"
                                                                            onClick={(e) => handleUpdate(category, e)}
                                                                            size="small"
                                                                            sx={{ minWidth: 64, fontSize: '0.6rem' }}
                                                                        >
                                                                            Cập nhật
                                                                        </Button>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="error"
                                                                            onClick={(e) => handleDeactivate(category, e)}
                                                                            size="small"
                                                                            sx={{ minWidth: 64, fontSize: '0.6rem' }}
                                                                        >
                                                                            Ngừng kinh doanh
                                                                        </Button>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="error"
                                                                            onClick={(e) => handleDelete(category, e)}
                                                                            size="small"
                                                                            sx={{ minWidth: 64, fontSize: '0.6rem' }}
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
                                                <TableCell colSpan={9} align="center" sx={{ fontSize: '0.6rem' }}>
                                                    Không có dữ liệu hạng phòng
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={totalCategories}
                                page={pageCategories}
                                onPageChange={handleCategoriesPageChange}
                                rowsPerPage={recordsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                rowsPerPageOptions={[3, 5, 10, 15]}
                                sx={{ fontSize: '0.6rem' }}
                            />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <Typography variant="h6" sx={{ mb: 1.6, px: 0.8, fontSize: '0.8rem' }}>
                                Danh sách phòng
                            </Typography>
                            <TableContainer sx={{ maxHeight: '320px' }}>
                                <Table size="small" stickyHeader sx={{ fontSize: '0.6rem' }}>
                                    <TableHead>
                                        <TableRow>
                                            {roomsColumns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    sx={{
                                                        px: 0.4,
                                                        py: 0.4,
                                                        width: column.width,
                                                        whiteSpace: 'nowrap',
                                                        fontWeight: 'bold',
                                                        backgroundColor: '#f5f5f5',
                                                        fontSize: '0.6rem',
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
                                                            '&:hover': {
                                                                bgcolor: 'rgba(0, 0, 0, 0.08)',
                                                            },
                                                        }}
                                                    >
                                                        <TableCell sx={{ px: 0.4, py: 0.4, fontSize: '0.6rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>{room.id}</TableCell>
                                                        <TableCell sx={{ px: 0.4, py: 0.4, fontSize: '0.6rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>{room.roomCategory?.name || 'Không xác định'}</TableCell>
                                                        <TableCell sx={{ px: 0.4, py: 0.4, fontSize: '0.6rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>{room.floor !== null && room.floor !== undefined ? room.floor : 'Không xác định'}</TableCell>
                                                        <TableCell sx={{ px: 0.4, py: 0.4, fontSize: '0.6rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                            <Box
                                                                sx={{
                                                                    display: 'inline-block',
                                                                    px: 0.4,
                                                                    py: 0.2,
                                                                    borderRadius: 0.8,
                                                                    bgcolor: room.status === 'AVAILABLE' ? 'success.light' : room.status === 'IN_USE' ? 'warning.light' : 'error.light',
                                                                    color: 'white',
                                                                    fontSize: '0.6rem',
                                                                }}
                                                            >
                                                                {getRoomStatusLabel(room.status)}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell sx={{ px: 0.4, py: 0.4, fontSize: '0.6rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>{room.isClean ? 'Sạch' : 'Chưa dọn'}</TableCell>
                                                    </TableRow>
                                                    {expandedRoomRow === room.id && expandedRoomDetails && (
                                                        <TableRow>
                                                            <TableCell colSpan={5} sx={{ p: 0 }}>
                                                                <Box sx={{
                                                                    p: 0.8,
                                                                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                                                                    borderTop: '1px dashed rgba(0, 0, 0, 0.1)',
                                                                    borderBottom: '1px dashed rgba(0, 0, 0, 0.1)',
                                                                    fontSize: '0.6rem'
                                                                }}>
                                                                    <Typography variant="subtitle1" sx={{ mb: 0.8, fontWeight: 'bold', fontSize: '0.7rem' }}>
                                                                        Thông tin chi tiết
                                                                    </Typography>
                                                                    <Grid container spacing={0.8}>
                                                                        <Grid item xs={4}>
                                                                            <Box>
                                                                                <Typography variant="body2" sx={{ fontSize: '0.6rem', fontWeight: 'bold' }}>
                                                                                    Ảnh:
                                                                                </Typography>
                                                                                <img
                                                                                    src={expandedRoomDetails.imgUrl ? (expandedRoomDetails.imgUrl.startsWith('http') ? expandedRoomDetails.imgUrl : `http://localhost:8080/${expandedRoomDetails.imgUrl}`) : placeholderImage}
                                                                                    alt={`Phòng ${expandedRoomDetails.id}`}
                                                                                    style={{
                                                                                        width: '120px', // 150px * 0.8
                                                                                        height: '120px', // 150px * 0.8
                                                                                        objectFit: 'cover',
                                                                                        marginTop: '6.4px' // 8px * 0.8
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={8}>
                                                                            <Grid container spacing={0.8}>
                                                                                <Grid item xs={6}>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
                                                                                        <strong>Mã phòng:</strong> {expandedRoomDetails.id}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
                                                                                        <strong>Hạng phòng:</strong> {expandedRoomDetails.roomCategory?.name || 'Không xác định'}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
                                                                                        <strong>Tầng:</strong> {expandedRoomDetails.floor !== null && expandedRoomDetails.floor !== undefined ? expandedRoomDetails.floor : 'Không xác định'}
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid item xs={6}>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
                                                                                        <strong>Tình trạng:</strong> {getRoomStatusLabel(expandedRoomDetails.status)}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
                                                                                        <strong>Trạng thái dọn dẹp:</strong> {expandedRoomDetails.isClean ? 'Sạch' : 'Chưa dọn'}
                                                                                    </Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.4, fontSize: '0.6rem' }}>
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
                                                <TableCell colSpan={5} align="center" sx={{ fontSize: '0.6rem' }}>
                                                    Không có dữ liệu phòng
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={totalRooms}
                                page={pageRooms}
                                onPageChange={handleRoomsPageChange}
                                rowsPerPage={recordsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                rowsPerPageOptions={[3, 5, 10, 15]}
                                sx={{ fontSize: '0.6rem' }}
                            />
                        </CustomTabPanel>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}