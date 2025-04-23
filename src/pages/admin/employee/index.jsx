import React, {useState, useEffect} from 'react';
import {
    Grid, Box, Typography, Checkbox, FormControlLabel, Select, MenuItem, Button,
    IconButton, FormControl, InputBase, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Collapse, Menu, Dialog, DialogTitle, DialogContent, DialogActions,
    Snackbar, Alert, Pagination, InputAdornment, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EmployeeService from "../../../service/admin/employee.service.js";
import AddEmployeeDialog from "./AddEmployeeDialog.jsx";
import EditEmployeeDialog from "./EditEmployeeDialog.jsx";
import PermissionGuard from "../../../components/PermissionGuard.jsx";
import {toast} from 'react-toastify';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import UserService from "../../../service/admin/user.service.js";
// Hàm tạo dữ liệu nhân viên
function createEmployeeData(
    id, fullName, phone, idCard, address, position, note,
    user_id, start_date, device, dob, gender, email, facebook,
    branch, work_branch, department, login_account, image
) {
    return {
        id, fullName, phone, idCard, address, position, note,
        user_id, start_date, device, dob, gender, email, facebook,
        branch, work_branch, department, login_account, image,
        details: [
            {label: 'Ghi chú', value: note || 'Không có ghi chú'},
            {label: 'Ngày cập nhật', value: '2023-10-15'},
            {label: 'Trạng thái', value: 'Đang làm việc'},
        ],
    };
}

// Component Row hiển thị từng hàng nhân viên
function Row({row, selectedRows, handleRowSelect, selectedColumns, handleOpenEditDialog}) {
    const [open, setOpen] = useState(false);
    const columnOptions = [
        {label: 'Ảnh', key: 'image'},
        {label: 'Mã nhân viên', key: 'user_id'},
        {label: 'Tên nhân viên', key: 'fullName'},
        {label: 'Mã chấm công', key: 'user_id'},
        {label: 'Ngày sinh', key: 'dob'},
        {label: 'Giới tính', key: 'gender'},
        {label: 'Số CMND/CCCD', key: 'idCard'},
        {label: 'Ngày bắt đầu làm việc', key: 'start_date'},
        {label: 'Chi nhánh trực thuộc', key: 'branch'},
        {label: 'Chi nhánh làm việc', key: 'work_branch'},
        {label: 'Tài khoản KiotViet', key: 'login_account'},
        {label: 'Số điện thoại', key: 'phone'},
        {label: 'Tất cả chi nhánh', key: 'branch'},
        {label: 'Email', key: 'email'},
        {label: 'Facebook', key: 'facebook'},
        {label: 'Địa chỉ', key: 'address'},
        {label: 'Thiết bị di động', key: 'device'},
        {label: 'Ghi chú', key: 'note'},
        {label: 'Chức vụ', key: 'position'},
        {label: 'Phòng ban', key: 'department'},
    ];

    const detailedInfo = columnOptions
        .filter((option) => option.label !== 'Ảnh')
        .map((option) => ({
            label: option.label,
            value: row[option.key] || '-',
        }));

    const column2 = detailedInfo.slice(0, 9);
    const column3 = detailedInfo.slice(9);
    const placeholderImage = '';

    const handleLockAccount = async (eId) => {
        UserService.lockAccountEmployee(eId).then(res => {
                toast.success(res.data.message)
        }).catch(error => {
           toast.error(error.message)
        })
    }

    return (
        <>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell sx={{minWidth: 50, padding: '8px 16px', textAlign: 'left'}}>
                    <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) => handleRowSelect(row.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        size="small"
                    />
                </TableCell>
                <TableCell sx={{minWidth: 50, padding: '8px 16px', textAlign: 'left'}}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                {selectedColumns.map((col) => (
                    <TableCell
                        key={col}
                        align="left"
                        sx={{
                            fontSize: 13,
                            minWidth: 120,
                            maxWidth: 200,
                            padding: '8px 16px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {col === 'Ảnh' ? (
                            <img
                                src={row.image || placeholderImage}
                                alt="Employee"
                                style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px'}}
                            />
                        ) : (
                            row[columnOptions.find((option) => option.label === col)?.key] || '-'
                        )}
                    </TableCell>
                ))}
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={selectedColumns.length + 2}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography variant="subtitle1" gutterBottom component="div"
                                        sx={{fontWeight: 'bold', fontSize: 14, mb: 5}}>
                                Thông tin chi tiết
                            </Typography>
                            <Grid container spacing={8}>
                                <Grid item xs={4}>
                                    <Box>
                                        <Typography variant="body2" sx={{fontSize: 13, fontWeight: 'bold'}}>
                                            Ảnh:
                                        </Typography>
                                        <img
                                            src={row.image || placeholderImage}
                                            alt="Employee"
                                            style={{
                                                width: '150px',
                                                height: '150px',
                                                objectFit: 'cover',
                                                marginTop: '8px'
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={4} sx={{mr: 6}}>
                                    {column2.map((info, index) => (
                                        <Box key={index} sx={{mb: 2}}>
                                            <Typography variant="body2" sx={{fontSize: 13}}>
                                                <strong>{info.label}:</strong> {info.value}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Grid>
                                <Grid item xs={4}>
                                    {column3.map((info, index) => (
                                        <Box key={index} sx={{mb: 2}}>
                                            <Typography variant="body2" sx={{fontSize: 13}}>
                                                <strong>{info.label}:</strong> {info.value}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Grid>
                            </Grid>
                            <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3, mb: 7}}>
                                <Button variant="outlined"
                                        onClick={() => handleLockAccount(row.userId)}

                                        startIcon={<LockOpenIcon  />}>
                                   Lock On
                                </Button>
                                <Button variant="contained" size="small"

                                        sx={{
                                    backgroundColor: '#1976d2',
                                    textTransform: 'none',
                                    padding: '6px 12px',
                                    fontSize: '12px'
                                }}>
                                    Lấy mã xác nhận
                                </Button>
                                {/*<PermissionGuard permissions="EDIT_EMPLOYEE">*/}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            backgroundColor: '#00c853',
                                            textTransform: 'none',
                                            padding: '6px 12px',
                                            fontSize: '12px'
                                        }}
                                        onClick={() => handleOpenEditDialog(row)}
                                    >
                                        Cập nhật
                                    </Button>
                                {/*</PermissionGuard>*/}
                                <Button variant="contained" size="small" sx={{
                                    backgroundColor: '#d32f2f',
                                    textTransform: 'none',
                                    padding: '6px 12px',
                                    fontSize: '12px'
                                }}>
                                    Ngừng làm việc
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

// Component Employee chính
function Employee() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState([
        'Mã nhân viên', 'Tên nhân viên', 'Số điện thoại',
        'Số CMND/CCCD', 'Địa chỉ', 'Chức vụ', 'Ghi chú'
    ]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    // Pagination
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [actionAnchorEl, setActionAnchorEl] = useState(null);

    // Các column hiển thị có thể chọn
    const columnOptions = [
        {label: 'Ảnh', key: 'image'},
        {label: 'Mã nhân viên', key: 'user_id'},
        {label: 'Tên nhân viên', key: 'fullName'},
        {label: 'Mã chấm công', key: 'user_id'},
        {label: 'Ngày sinh', key: 'dob'},
        {label: 'Giới tính', key: 'gender'},
        {label: 'Số CMND/CCCD', key: 'idCard'},
        {label: 'Ngày bắt đầu làm việc', key: 'start_date'},
        {label: 'Chi nhánh trực thuộc', key: 'branch'},
        {label: 'Chi nhánh làm việc', key: 'work_branch'},
        {label: 'Tài khoản KiotViet', key: 'login_account'},
        {label: 'Số điện thoại', key: 'phone'},
        {label: 'Tất cả chi nhánh', key: 'branch'},
        {label: 'Email', key: 'email'},
        {label: 'Facebook', key: 'facebook'},
        {label: 'Địa chỉ', key: 'address'},
        {label: 'Thiết bị di động', key: 'device'},
        {label: 'Ghi chú', key: 'note'},
        {label: 'Chức vụ', key: 'position'},
        {label: 'Phòng ban', key: 'department'}
    ];

    /**
     * Lấy dữ liệu nhân viên từ API với phân trang
     */
    const fetchEmployees = async (pageNum = page, pageSize = size, searchKeyword = '') => {
        setLoading(true);
        try {
            // Kiểm tra nếu đã có dữ liệu trong localStorage
            const cachedData = sessionStorage.getItem('employeeData');
            const timestamp = sessionStorage.getItem('employeeDataTimestamp');
            const now = new Date().getTime();

            // Chỉ sử dụng cache nếu dữ liệu lưu trữ chưa quá 5 phút
            if (cachedData && timestamp && (now - parseInt(timestamp) < 5 * 60 * 1000)) {
                try {
                    const parsedData = JSON.parse(cachedData);
                    setEmployees(parsedData.content || []);
                    setFilteredEmployees(parsedData.content || []);
                    setTotalPages(parsedData.totalPages || 1);
                    setTotalElements(parsedData.totalElements || 0);
                    setLoading(false);
                    console.log('Using cached employee data');
                    return;
                } catch (error) {
                    console.error('Error parsing cached data:', error);
                }
            }

            // Fetch mới nếu không có cache hoặc cache đã hết hạn
            const response = await EmployeeService.getAllEmployee(pageNum, pageSize);
            if (response.data) {
                // Cập nhật state với dữ liệu mới
                const {content, totalPages, totalElements} = response.data;
                setEmployees(content || []);
                setFilteredEmployees(content || []);
                setTotalPages(totalPages || 1);
                setTotalElements(totalElements || 0);

                // Lưu vào cache
                sessionStorage.setItem('employeeData', JSON.stringify(response.data));
                sessionStorage.setItem('employeeDataTimestamp', new Date().getTime().toString());
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            // Hiển thị thông báo lỗi
            setSnackbarMessage('Không thể tải danh sách nhân viên');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);

            // Fallback to mock data nếu API lỗi
            setEmployees(mockEmployees);
            setFilteredEmployees(mockEmployees);
        } finally {
            setLoading(false);
        }
    };

    // Tải dữ liệu khi component mount hoặc khi thay đổi trang
    useEffect(() => {
        fetchEmployees(page, size, searchTerm);
    }, [page, size]);

    // Xử lý tìm kiếm với debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchEmployees(0, size, searchTerm);  // Reset về trang đầu tiên khi tìm kiếm
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleColumnToggle = (label) => {
        setSelectedColumns(prev =>
            prev.includes(label)
                ? prev.filter(col => col !== label)
                : [...prev, label]
        );
    };

    const handleRowSelect = (id, event) => {
        event.stopPropagation();
        setSelectedRows(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    const handleSelectAllRows = (event) => {
        if (event.target.checked) {
            setSelectedRows(filteredEmployees.map(emp => emp.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleOpenAddDialog = () => {
        setSelectedEmployee(null);
        setOpenAddDialog(true);
    };

    const handleOpenEditDialog = (employee) => {
        setSelectedEmployee(employee);
        setOpenEditDialog(true);
    };

    const handleActionMenuClick = (event) => setActionAnchorEl(event.currentTarget);
    const handleActionMenuClose = () => setActionAnchorEl(null);

    const handleDeleteSelected = () => setOpenDeleteDialog(true);

    const handleDeleteEmployees = async () => {
        try {
            setLoading(true);
            // Xóa nhiều nhân viên cùng lúc
            for (const id of selectedRows) {
                await EmployeeService.deleteEmployee(id);
            }

            setSnackbarMessage(`Đã xóa ${selectedRows.length} nhân viên thành công`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setSelectedRows([]);
            setOpenDeleteDialog(false);
            setActionAnchorEl(null);
            fetchEmployees(); // Tải lại dữ liệu
        } catch (error) {
            console.error('Error deleting employees:', error);
            setSnackbarMessage('Xóa nhân viên thất bại');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleEmployeeAdded = () => {
        setOpenAddDialog(false);
        fetchEmployees();
        setSnackbarMessage('Thêm nhân viên thành công!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const handleEmployeeUpdated = () => {
        setOpenEditDialog(false);
        fetchEmployees();
        setSnackbarMessage('Cập nhật nhân viên thành công!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const handleSnackbarClose = () => setOpenSnackbar(false);

    return (
        <Grid container spacing={0.5}>
            <Grid size={{xs: 4, md: 2.4}}>
                <Box sx={{mt: 2}}>
                    <Typography variant="h6" sx={{ml: 2, mb: 0.5, fontWeight: 'bold'}}>Danh sách nhân viên</Typography>
                    <Typography color="textSecondary" sx={{fontSize: 13, ml: 2, mb: 1}}>Đã sử dụng nhân
                        viên</Typography>
                </Box>

                <Box sx={{marginLeft: 1, p: 1, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3, boxShadow: 1}}>
                    <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 'bold', fontSize: 13}}>Trạng thái nhân
                        viên</Typography>
                    <Box sx={{display: 'flex', flexDirection: 'column', fontSize: 13}}>
                        <FormControlLabel control={<Checkbox defaultChecked size="small"/>}
                                          label={<Typography sx={{fontSize: 13}}>Đang làm việc</Typography>}/>
                        <FormControlLabel control={<Checkbox size="small"/>}
                                          label={<Typography sx={{fontSize: 13}}>Đã nghỉ</Typography>}/>
                    </Box>
                </Box>

                <Box sx={{
                    marginLeft: 1,
                    p: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    mb: 3,
                    boxShadow: 1,
                    backgroundColor: '#ffffff'
                }}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1}}>
                        <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 'bold', fontSize: 13}}>Phòng
                            ban</Typography>
                        <Box>
                            <IconButton size="small" sx={{mr: 0.5}}><AddIcon fontSize="small"/></IconButton>
                            <IconButton size="small"><ExpandLessIcon fontSize="small"/></IconButton>
                        </Box>
                    </Box>
                    <FormControl fullWidth size="small">
                        <Select displayEmpty defaultValue=""
                                sx={{borderRadius: 1, height: 32, ml: 1, mr: 1, mb: 2, backgroundColor: '#ffffff'}}>
                            <MenuItem value="" disabled>Chọn phòng ban</MenuItem>
                            <MenuItem value="Phòng PV">Phòng PV</MenuItem>
                            <MenuItem value="Phòng AI">Phòng AI</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{
                    marginLeft: 1,
                    p: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    mb: 3,
                    boxShadow: 1,
                    backgroundColor: '#ffffff'
                }}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1}}>
                        <Typography variant="subtitle2" sx={{mt: 1, ml: 1, mb: 1, fontWeight: 'bold', fontSize: 13}}>Chức
                            danh</Typography>
                        <Box>
                            <IconButton size="small" sx={{mr: 0.5}}><AddIcon fontSize="small"/></IconButton>
                            <IconButton size="small"><ExpandLessIcon fontSize="small"/></IconButton>
                        </Box>
                    </Box>
                    <FormControl fullWidth size="small">
                        <Select displayEmpty defaultValue=""
                                sx={{borderRadius: 1, height: 32, ml: 1, mr: 1, mb: 2, backgroundColor: '#ffffff'}}>
                            <MenuItem value="" disabled>Chọn chức danh</MenuItem>
                            <MenuItem value="Trưởng phòng">Trưởng phòng</MenuItem>
                            <MenuItem value="Nhân viên">Nhân viên</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{
                    ml: 1,
                    p: 1.5,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    boxShadow: 1,
                    backgroundColor: '#ffffff',
                    mb: 1
                }}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant="subtitle2" sx={{mb: 3, fontWeight: 'bold', fontSize: 13, height: 40}}>Số
                            bản ghi:</Typography>
                        <FormControl size="small" sx={{width: 80, height: 24}}>
                            <Select value={size} onChange={(e) => setSize(parseInt(e.target.value, 10))}
                                    sx={{borderRadius: 1, height: 28}}>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Grid>

            <Grid size={{xs: 6, md: 9.5}}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    mt: 1.5
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: 420,
                        height: 26,
                        border: '1px solid #e0e0e0',
                        borderRadius: '6px',
                        px: 1.5,
                        py: 0.5,
                        mt: 1,
                        ml: 2,
                        backgroundColor: '#ffffff',
                        boxShadow: 1
                    }}>
                        <SearchIcon sx={{fontSize: 20, color: 'gray', mr: 1}}/>
                        <InputBase
                            placeholder="Tìm theo mã chấm công, tên nhân viên"
                            sx={{fontSize: 14, flex: 1}}
                            inputProps={{'aria-label': 'search employee'}}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={loading}
                        />
                        {loading && searchTerm && (
                            <CircularProgress size={20} sx={{mr: 1}}/>
                        )}
                    </Box>
                    {selectedRows.length > 0 && (
                        <>
                            <PermissionGuard permissions="DELETE_EMPLOYEE">
                                <Button
                                    variant="contained"
                                    startIcon={<UploadFileIcon sx={{fontSize: '16px'}}/>}
                                    size="small"
                                    sx={{
                                        backgroundColor: '#00b63e',
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        padding: '6px 8px',
                                        fontSize: '12px',
                                        '& .MuiButton-startIcon': {marginRight: '4px'}
                                    }}
                                    onClick={handleActionMenuClick}
                                    disabled={loading}
                                >
                                    Thao tác
                                </Button>
                            </PermissionGuard>
                            <Menu anchorEl={actionAnchorEl} open={Boolean(actionAnchorEl)}
                                  onClose={handleActionMenuClose} disableAutoFocusItem={true}>
                                <MenuItem onClick={handleDeleteSelected}>Xóa</MenuItem>
                            </Menu>
                        </>
                    )}

                    <Box sx={{display: 'flex', gap: 1}}>
                        <PermissionGuard permissions="CREATE_EMPLOYEE">
                            <Button
                                variant="contained"
                                startIcon={<AddIcon sx={{fontSize: '16px'}}/>}
                                size="small"
                                sx={{
                                    backgroundColor: '#00b63e',
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    padding: '6px 10px',
                                    fontSize: '12px',
                                    '& .MuiButton-startIcon': {marginRight: '4px'}
                                }}
                                onClick={handleOpenAddDialog}
                                disabled={loading}
                            >
                                Nhân viên
                            </Button>
                        </PermissionGuard>
                        <Button
                            variant="contained"
                            startIcon={<UploadFileIcon sx={{fontSize: '16px'}}/>}
                            size="small"
                            sx={{
                                backgroundColor: '#00b63e',
                                textTransform: 'none',
                                borderRadius: '8px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                '& .MuiButton-startIcon': {marginRight: '4px'}
                            }}
                            disabled={loading}
                        >
                            Nhập file
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon sx={{fontSize: '16px'}}/>}
                            size="small"
                            sx={{
                                backgroundColor: '#00b63e',
                                textTransform: 'none',
                                borderRadius: '8px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                '& .MuiButton-startIcon': {marginRight: '4px'}
                            }}
                            disabled={loading}
                        >
                            Xuất file
                        </Button>
                        <IconButton
                            sx={{padding: '2px'}}
                            onClick={handleMenuClick}
                            disabled={loading}
                        >
                            <AppRegistrationIcon sx={{fontSize: '26px'}}/>
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
                              PaperProps={{style: {maxHeight: 400, width: 350}}} disableAutoFocusItem={true}>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', p: 1}}>
                                <Box>
                                    {columnOptions.slice(0, 10).map((option) => (
                                        <FormControlLabel
                                            key={option.label}
                                            control={<Checkbox checked={selectedColumns.includes(option.label)}
                                                               onChange={() => handleColumnToggle(option.label)}
                                                               size="small" sx={{p: 0.8}}/>}
                                            label={<Typography variant="body2"
                                                               sx={{fontSize: '12px'}}>{option.label}</Typography>}
                                            sx={{'& .MuiFormControlLabel-label': {fontSize: '12px'}, ml: 1}}
                                        />
                                    ))}
                                </Box>
                                <Box>
                                    {columnOptions.slice(10).map((option) => (
                                        <FormControlLabel
                                            key={option.label}
                                            control={<Checkbox checked={selectedColumns.includes(option.label)}
                                                               onChange={() => handleColumnToggle(option.label)}
                                                               size="small" sx={{p: 0.8}}/>}
                                            label={<Typography variant="body2"
                                                               sx={{fontSize: '12px'}}>{option.label}</Typography>}
                                            sx={{'& .MuiFormControlLabel-label': {fontSize: '12px'}, ml: 1}}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Menu>
                    </Box>
                </Box>

                <Box sx={{
                    mt: 3,
                    ml: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    boxShadow: 1,
                    backgroundColor: '#ffffff'
                }}>
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                            <TableHead sx={{backgroundColor: '#eaf2ff'}}>
                                <TableRow>
                                    <TableCell sx={{minWidth: 50, padding: '8px 16px', textAlign: 'left'}}>
                                        <Checkbox
                                            indeterminate={selectedRows.length > 0 && selectedRows.length < filteredEmployees.length}
                                            checked={filteredEmployees.length > 0 && selectedRows.length === filteredEmployees.length}
                                            onChange={handleSelectAllRows}
                                            disabled={loading}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell sx={{minWidth: 50, padding: '8px 16px', textAlign: 'left'}}>Chi
                                        tiết</TableCell>
                                    {selectedColumns.map((col) => (
                                        <TableCell key={col} sx={{
                                            fontWeight: 'bold',
                                            fontSize: 13,
                                            minWidth: 120,
                                            maxWidth: 200,
                                            padding: '8px 16px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {col}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading && (
                                    <TableRow>
                                        <TableCell colSpan={selectedColumns.length + 2} align="center">
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                py: 3
                                            }}>
                                                <CircularProgress size={24}/>
                                                <Typography variant="body2" sx={{ml: 2}}>Đang tải dữ
                                                    liệu...</Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!loading && filteredEmployees.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={selectedColumns.length + 2} align="center">
                                            <Typography variant="body1" sx={{my: 3}}>Không có dữ liệu nhân
                                                viên</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!loading && filteredEmployees.map(employee => (

                                    <Row
                                        key={employee.id}
                                        row={employee}
                                        selectedRows={selectedRows}
                                        handleRowSelect={handleRowSelect}
                                        selectedColumns={selectedColumns}
                                        handleOpenEditDialog={handleOpenEditDialog}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                 {/*Dialog xác nhận xóa nhân viên */}
                <PermissionGuard permissions="DELETE_EMPLOYEE">
                    <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}
                            disableRestoreFocus={true}>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogContent>Bạn có chắc chắn muốn xóa {selectedRows.length} nhân viên?</DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDeleteDialog(false)} disabled={loading}>Hủy</Button>
                            <Button
                                onClick={handleDeleteEmployees}
                                color="error"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24}/> : 'Xóa'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </PermissionGuard>

                 {/*Dialog thêm nhân viên */}
                <PermissionGuard permissions="CREATE_EMPLOYEE">
                    <AddEmployeeDialog
                        open={openAddDialog}
                        onClose={() => setOpenAddDialog(false)}
                        fetchAllEmployees={() => fetchEmployees(page, size)}
                        employee={selectedEmployee}
                        onAddSuccess={handleEmployeeAdded}
                    />
                </PermissionGuard>

                 {/*Dialog chỉnh sửa nhân viên */}
                <PermissionGuard permissions="EDIT_EMPLOYEE">
                    <EditEmployeeDialog
                        open={openEditDialog}
                        onClose={() => setOpenEditDialog(false)}
                        employeeData={selectedEmployee}
                        fetchAllEmployees={() => fetchEmployees(page, size)}
                        onEditSuccess={handleEmployeeUpdated}
                    />
                </PermissionGuard>

                <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleSnackbarClose}
                          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}
                           sx={{width: '100%'}}>{snackbarMessage}</Alert>
                </Snackbar>
            </Grid>
        </Grid>
    );
}

export default Employee;