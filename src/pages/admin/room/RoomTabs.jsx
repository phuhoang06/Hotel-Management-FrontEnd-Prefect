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
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import RoomViewService from "../../../service/admin/room.service.js";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function RoomTabs() {
    const [value, setValue] = React.useState(0);
    const [searchCategory, setSearchCategory] = React.useState('');
    const [branchCategory, setBranchCategory] = React.useState('');
    const [statusCategory, setStatusCategory] = React.useState({ active: true, inactive: false });
    const [recordsPerPage, setRecordsPerPage] = React.useState(5);
    const [searchRoom, setSearchRoom] = React.useState('');
    const [categoryRoom, setCategoryRoom] = React.useState('');
    const [statusRoom, setStatusRoom] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [roomCategories, setRoomCategories] = React.useState([]);
    const [rooms, setRooms] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    // Sử dụng useCallback để bọc filteredCategories và filteredRooms
    const filteredCategories = React.useCallback(async () => {
        try {
            setLoading(true);
            const status = statusCategory.active ? 'ACTIVE' : statusCategory.inactive ? 'INACTIVE' : '';
            const response = await RoomViewService.searchRoomCategories({
                keyword: searchCategory,
                status,
                page: 0,
                size: recordsPerPage,
            });
            setRoomCategories(response.data.content);
        } catch (err) {
            console.error('Lỗi khi tìm kiếm hạng phòng:', err);
            toast.error(`Không thể tìm kiếm hạng phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [searchCategory, statusCategory, recordsPerPage]);

    const filteredRooms = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await RoomViewService.searchRoomView({
                keyword: searchRoom,
                status: statusRoom,
                page: 0,
                size: recordsPerPage,
            });
            setRooms(response.data.content);
        } catch (err) {
            console.error('Lỗi khi tìm kiếm phòng:', err);
            toast.error(`Không thể tìm kiếm phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [searchRoom, statusRoom, recordsPerPage]);

    // Lấy danh sách hạng phòng
    const fetchRoomCategories = async () => {
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
    };

    // Lấy danh sách phòng
    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = await RoomViewService.getAllRoomView(0, recordsPerPage);
            setRooms(response.data.content);
        } catch (err) {
            console.error('Lỗi khi tải danh sách phòng:', err);
            toast.error(`Không thể tải danh sách phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Hàm khởi tạo dữ liệu ban đầu
    const initializeData = React.useCallback(async () => {
        await Promise.all([fetchRoomCategories(), fetchRooms()]);
    }, []);

    // Gọi initializeData khi component mount
    React.useEffect(() => {
        initializeData();
    }, [initializeData]);

    // Gọi filteredCategories hoặc filteredRooms khi các bộ lọc thay đổi
    React.useEffect(() => {
        if (value === 0) {
            filteredCategories();
        } else {
            filteredRooms();
        }
    }, [value, searchCategory, branchCategory, statusCategory, recordsPerPage, searchRoom, categoryRoom, statusRoom, filteredCategories, filteredRooms]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setSelectedCategory(null);
    };

    const handleRowClick = async (category) => {
        try {
            setLoading(true);
            const response = await RoomViewService.getRoomCategoryById(category.id);
            setSelectedCategory(response.data);
        } catch (err) {
            console.error('Lỗi khi tải thông tin chi tiết hạng phòng:', err);
            toast.error(`Không thể tải thông tin chi tiết hạng phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = () => {
        alert(`Điều hướng đến form chỉnh sửa hạng phòng: ${selectedCategory?.id}`);
    };

    const handleDeactivate = async () => {
        try {
            setLoading(true);
            await RoomViewService.updateRoomCategoryStatus(selectedCategory.id, 'INACTIVE');
            await fetchRoomCategories();
            setSelectedCategory(null);
            toast.success('Đã ngừng kinh doanh hạng phòng thành công');
        } catch (err) {
            console.error('Lỗi khi ngừng kinh doanh hạng phòng:', err);
            toast.error(`Không thể ngừng kinh doanh hạng phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await RoomViewService.deleteRoomCategory(selectedCategory.id);
            await fetchRoomCategories();
            setSelectedCategory(null);
            toast.success('Đã xóa hạng phòng thành công');
        } catch (err) {
            console.error('Lỗi khi xóa hạng phòng:', err);
            toast.error(`Không thể xóa hạng phòng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}

            <Typography variant="h5" sx={{ mb: 2 }}>
                Hạng phòng & Phòng
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={value} onChange={handleChange} aria-label="room tabs">
                    <Tab label="Hạng phòng" {...a11yProps(0)} />
                    <Tab label="Danh sách phòng" {...a11yProps(1)} />
                </Tabs>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                        {value === 0 ? (
                            <>
                                <TextField
                                    fullWidth
                                    label="Tìm kiếm hạng phòng"
                                    value={searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Chi nhánh</InputLabel>
                                    <Select
                                        variant="outlined"
                                        value={branchCategory}
                                        onChange={(e) => setBranchCategory(e.target.value)}
                                        label="Chi nhánh"
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        <MenuItem value="Chi nhánh trung tâm">Chi nhánh trung tâm</MenuItem>
                                        <MenuItem value="Chi nhánh khác">Chi nhánh khác</MenuItem>
                                    </Select>
                                </FormControl>
                                <Box sx={{ mb: 2 }}>
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
                                        onChange={(e) => setRecordsPerPage(e.target.value)}
                                        label="Số bản ghi"
                                    >
                                        <MenuItem value={15}>15</MenuItem>
                                        <MenuItem value={30}>30</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
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
                                    sx={{ mb: 2 }}
                                />
                                <FormControl fullWidth sx={{ mb: 2 }}>
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
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Tình trạng</InputLabel>
                                    <Select
                                        variant="outlined"
                                        value={statusRoom}
                                        onChange={(e) => setStatusRoom(e.target.value)}
                                        label="Tình trạng"
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        <MenuItem value="AVAILABLE">Trống</MenuItem>
                                        <MenuItem value="OCCUPIED">Đã đặt</MenuItem>
                                        <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Số bản ghi</InputLabel>
                                    <Select
                                        variant="outlined"
                                        value={recordsPerPage}
                                        onChange={(e) => setRecordsPerPage(e.target.value)}
                                        label="Số bản ghi"
                                    >
                                        <MenuItem value={15}>15</MenuItem>
                                        <MenuItem value={30}>30</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </Box>
                </Grid>

                <Grid item xs={12} md={9}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button variant="contained" color="success" startIcon={<span>+</span>}>
                            Thêm mới
                        </Button>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox disabled />
                                    </TableCell>
                                    <TableCell>Mã hạng phòng</TableCell>
                                    <TableCell>Tên hạng phòng</TableCell>
                                    <TableCell>Số lượng phòng</TableCell>
                                    <TableCell>Giá giờ</TableCell>
                                    <TableCell>Giá ngày</TableCell>
                                    <TableCell>Giá đầu mút</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Chi nhánh</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roomCategories.map((category) => (
                                    <TableRow
                                        key={category.id}
                                        onClick={() => handleRowClick(category)}
                                        sx={{
                                            cursor: 'pointer',
                                            bgcolor: selectedCategory?.id === category.id ? 'grey.200' : 'inherit',
                                        }}
                                    >
                                        <TableCell>
                                            <Checkbox checked={selectedCategory?.id === category.id} />
                                        </TableCell>
                                        <TableCell>{category.code}</TableCell>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>{category.rooms?.length || 0}</TableCell>
                                        <TableCell>{category.hourlyPrice.toLocaleString()} đ</TableCell>
                                        <TableCell>{category.dailyPrice.toLocaleString()} đ</TableCell>
                                        <TableCell>{category.overnightPrice.toLocaleString()} đ</TableCell>
                                        <TableCell>{category.status === 'ACTIVE' ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}</TableCell>
                                        <TableCell>Chi nhánh trung tâm</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Collapse in={!!selectedCategory}>
                            {selectedCategory && (
                                <Card sx={{ mt: 2 }}>
                                    <Typography variant="h6" sx={{ p: 2, bgcolor: 'grey.100' }}>
                                        THÔNG TIN
                                    </Typography>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={3}>
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image={selectedCategory.imgUrl || 'https://via.placeholder.com/150'}
                                                    alt={selectedCategory.name}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={9}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <Typography>
                                                            <strong>Mã hàng phòng:</strong> {selectedCategory.code}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography>
                                                            <strong>Sức chứa từ chuẩn:</strong> {selectedCategory.standardAdultCapacity} người lớn, {selectedCategory.standardChildCapacity} trẻ em
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography>
                                                            <strong>Tên hạng phòng:</strong> {selectedCategory.name}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography>
                                                            <strong>Sức chứa tối đa:</strong> {selectedCategory.maxAdultCapacity} người lớn, {selectedCategory.maxChildCapacity} trẻ em
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography>
                                                            <strong>Chi nhánh:</strong> Chi nhánh trung tâm
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography>
                                                            <strong>Mở tại:</strong> {selectedCategory.id}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography>
                                                            <strong>Số lượng phòng:</strong> {selectedCategory.rooms?.length || 0}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography>
                                                            <strong>Giá giờ:</strong> {selectedCategory.hourlyPrice.toLocaleString()} đ
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography>
                                                            <strong>Giá ngày:</strong> {selectedCategory.dailyPrice.toLocaleString()} đ
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography>
                                                            <strong>Giá đầu mút:</strong> {selectedCategory.overnightPrice.toLocaleString()} đ
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography>
                                                            <strong>Phí thuê giường:</strong> {selectedCategory.defaultExtraFee.toLocaleString()} đ
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                                            <Button variant="contained" color="success" onClick={handleUpdate}>
                                                Cập nhật
                                            </Button>
                                            <Button variant="contained" color="error" onClick={handleDeactivate}>
                                                Ngừng kinh doanh
                                            </Button>
                                            <Button variant="contained" color="error" onClick={handleDelete}>
                                                Xóa
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}
                        </Collapse>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã phòng</TableCell>
                                    <TableCell>Hạng phòng</TableCell>
                                    <TableCell>Tình trạng</TableCell>
                                    <TableCell>Chi nhánh</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rooms.map((room) => (
                                    <TableRow key={room.id}>
                                        <TableCell>{room.id}</TableCell>
                                        <TableCell>{room.roomCategory?.name}</TableCell>
                                        <TableCell>{room.status === 'AVAILABLE' ? 'Trống' : room.status === 'OCCUPIED' ? 'Đã đặt' : 'Bảo trì'}</TableCell>
                                        <TableCell>Chi nhánh trung tâm</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CustomTabPanel>
                </Grid>
            </Grid>
        </Box>
    );
}