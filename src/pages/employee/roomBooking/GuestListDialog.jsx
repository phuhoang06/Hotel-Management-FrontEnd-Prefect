import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Chip,
    TextField,
    InputAdornment,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Link,
    Divider,
    CircularProgress,
    Snackbar,
    Alert,
    Switch,
    FormControlLabel,
    Tooltip
} from '@mui/material';
import {
    Close as CloseIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    QrCodeScanner as QrCodeScannerIcon,
    FileUpload as FileUploadIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    HomeWork as HomeWorkIcon,
    NewReleases as NewReleasesIcon
} from '@mui/icons-material';

import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale'; // Import Vietnamese locale if needed
import guestService from '../../../service/guest.service';

// Helper function to format date and time
const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).replace(' tháng',' Thg');
};

// Helper function to format date range
const formatDateRange = (startStr, endStr) => {
    if (!startStr || !endStr) return '';
    
    const start = new Date(startStr);
    const end = new Date(endStr);
    
    const startDateStr = start.toLocaleString('vi-VN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).replace(' tháng',' Thg');
    
    const endDateStr = end.toLocaleString('vi-VN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).replace(' tháng',' Thg');
    
    // Check if start and end dates are the same day
    if (start.toDateString() === end.toDateString()) {
        return `${startDateStr} - ${end.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    } else {
        return `${startDateStr} - ${endDateStr}`;
    }
};

// Main Dialog Component
export const GuestListDialog = ({ open, handleClose }) => {
    // State for search and filter fields
    const [searchName, setSearchName] = useState('');
    const [searchRoom, setSearchRoom] = useState('');
    const [khaiBaoStartDate, setKhaiBaoStartDate] = useState(new Date());
    const [khaiBaoEndDate, setKhaiBaoEndDate] = useState(new Date());
    const [luuTruStartDate, setLuuTruStartDate] = useState(null);
    const [luuTruEndDate, setLuuTruEndDate] = useState(null);
    
    // State for data
    const [guestList, setGuestList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showRecentOnly, setShowRecentOnly] = useState(false);
    
    // Notification state
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Fetch guest registrations when component mounts or search criteria change
    useEffect(() => {
        if (showRecentOnly) {
            fetchRecentCustomers();
        } else {
            fetchGuestRegistrations();
        }
    }, [showRecentOnly]);

    // Fetch recent customers
    const fetchRecentCustomers = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Call API service to get recent customers
            const response = await guestService.getRecentCustomers(10); // Lấy 10 khách hàng mới nhất
            setGuestList(response.content || []);
        } catch (error) {
            console.error('Error fetching recent customers:', error);
            setError('Không thể tải dữ liệu khách hàng mới nhất. Vui lòng thử lại sau.');
            
            // Show error notification
            setNotification({
                open: true,
                message: error.response?.data?.message || 'Lỗi khi tải dữ liệu khách hàng mới nhất',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Function to fetch guest registrations
    const fetchGuestRegistrations = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Prepare search parameters
            const params = {};
            
            if (searchName) params.searchText = searchName;
            if (searchRoom) params.roomSearch = searchRoom;
            
            if (khaiBaoStartDate) params.khaiBaoStartDate = khaiBaoStartDate.toISOString();
            if (khaiBaoEndDate) params.khaiBaoEndDate = khaiBaoEndDate.toISOString();
            
            if (luuTruStartDate) params.luuTruStartDate = luuTruStartDate.toISOString();
            if (luuTruEndDate) params.luuTruEndDate = luuTruEndDate.toISOString();
            
            // Call API service
            const response = await guestService.getAllGuestRegistrations(params);
            setGuestList(response.data || []);
        } catch (error) {
            console.error('Error fetching guest registrations:', error);
            setError('Không thể tải dữ liệu khách lưu trú. Vui lòng thử lại sau.');
            
            // Show error notification
            setNotification({
                open: true,
                message: error.response?.data?.message || 'Lỗi khi tải dữ liệu khách lưu trú',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle refresh button click
    const handleRefresh = () => {
        if (showRecentOnly) {
            fetchRecentCustomers();
        } else {
            fetchGuestRegistrations();
        }
    };

    // Toggle between showing all guests and recent additions
    const handleToggleRecentOnly = (event) => {
        setShowRecentOnly(event.target.checked);
    };

    // Handle export button click
    const handleExport = async () => {
        try {
            setIsLoading(true);
            
            // Prepare export parameters
            const params = {
                startDate: khaiBaoStartDate.toISOString(),
                endDate: khaiBaoEndDate.toISOString()
            };
            
            // Call export API
            const fileData = await guestService.exportGuestRegistrations(params);
            
            // Create a blob from the file data
            const blob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            
            // Create download link and trigger download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `guest-registrations-${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
            
            // Show success notification
            setNotification({
                open: true,
                message: 'Xuất file thành công',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error exporting guest registrations:', error);
            
            // Show error notification
            setNotification({
                open: true,
                message: error.response?.data?.message || 'Lỗi khi xuất file',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle scan CCCD button click
    const handleScanCCCD = () => {
        // Implement scan functionality
        console.log('Scanning CCCD...');
        
        // Show info notification
        setNotification({
            open: true,
            message: 'Chức năng đang được phát triển',
            severity: 'info'
        });
    };

    // Handle edit button click
    const handleEdit = (registrationId) => {
        // Implement edit functionality
        console.log('Editing registration:', registrationId);
        
        // Show info notification
        setNotification({
            open: true,
            message: 'Chức năng đang được phát triển',
            severity: 'info'
        });
    };

    // Handle delete button click
    const handleDelete = async (registrationId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa thông tin khách lưu trú này?')) {
            return;
        }
        
        try {
            setIsLoading(true);
            
            // Call delete API
            await guestService.deleteGuestRegistration(registrationId);
            
            // Remove from local state
            setGuestList(prevList => prevList.filter(guest => guest.id !== registrationId));
            
            // Show success notification
            setNotification({
                open: true,
                message: 'Xóa thông tin khách lưu trú thành công',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error deleting guest registration:', error);
            
            // Show error notification
            setNotification({
                open: true,
                message: error.response?.data?.message || 'Lỗi khi xóa thông tin khách lưu trú',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle notification close
    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    // Xử lý đóng dialog
    const onCloseDialog = (event, reason) => {
        // Dialog chỉ được đóng khi click ra ngoài hoặc nhấn ESC
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            if (typeof handleClose === 'function') {
                handleClose();
            }
        }
    };

    // Xử lý click vào nút X cụ thể
    const handleCloseButtonClick = () => {
        if (typeof handleClose === 'function') {
            handleClose();
        }
    };

    // Ngăn chặn sự kiện click truyền ra ngoài
    const preventClose = (event) => {
        event.stopPropagation();
    };

    // Xác định tiêu đề dựa trên trạng thái hiển thị
    const getDialogTitle = () => {
        return showRecentOnly ? "Danh sách khách hàng mới thêm" : "Danh sách khách lưu trú";
    };

    return (
        // Wrap with LocalizationProvider for date pickers
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <Dialog
                open={open}
                onClose={onCloseDialog}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        height: 'calc(100% - 64px)',
                        maxHeight: '80vh'
                    },
                    onClick: preventClose // Ngăn chặn sự kiện click từ paper
                }}
                // Không đóng khi ấn ESC
                disableEscapeKeyDown={false}
                // Không đóng khi click bên ngoài
                disableBackdropClick={false}
                // Vẫn hiển thị backdrop
                hideBackdrop={false}
                // Tùy chỉnh modal behavior
                disablePortal={false}
                disableAutoFocus={true}
                disableEnforceFocus={true}
            >
                {/* Dialog Title Area */}
                <DialogTitle 
                    sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}
                    onClick={preventClose}
                >
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        {getDialogTitle()}
                    </Typography>
                    <Chip
                        icon={<HomeWorkIcon fontSize="small" />}
                        label="Chi nhánh trung tâm"
                        size="small"
                        sx={{ mr: 2, backgroundColor: '#e0f2f7', color: '#007bff' }}
                    />
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseButtonClick}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                {/* Dialog Content Area */}
                <DialogContent sx={{ p: 0, display: 'flex', overflow: 'hidden' }} onClick={preventClose}>
                    {/* Left Sidebar */}
                    <Box sx={{
                        width: '280px',
                        borderRight: '1px solid #e0e0e0',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        overflowY: 'auto'
                    }}>
                        {/* Toggle for Recent Customers */}
                        <Box sx={{ mb: 1 }}>
                            <FormControlLabel
                                control={
                                    <Switch 
                                        checked={showRecentOnly}
                                        onChange={handleToggleRecentOnly}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <NewReleasesIcon color="primary" sx={{ mr: 0.5, fontSize: 20 }} />
                                        <Typography variant="body2" fontWeight="medium">
                                            Chỉ hiển thị khách hàng mới
                                        </Typography>
                                    </Box>
                                }
                            />
                        </Box>

                        <Divider sx={{ my: 1 }}/>

                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Tìm kiếm</Typography>
                        <TextField
                            label="Tên khách lưu trú"
                            variant="outlined"
                            size="small"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 2 }
                            }}
                            disabled={showRecentOnly}
                        />
                        <TextField
                            label="Số phòng, đặt phòng"
                            variant="outlined"
                            size="small"
                            value={searchRoom}
                            onChange={(e) => setSearchRoom(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 2 }
                            }}
                            disabled={showRecentOnly}
                        />

                        <Divider sx={{ my: 1 }}/>

                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>Thời gian khai báo</Typography>
                        <DateTimePicker
                            label="Từ ngày"
                            value={khaiBaoStartDate}
                            onChange={(newValue) => setKhaiBaoStartDate(newValue)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    InputProps: { sx: { borderRadius: 2 } }
                                },
                                openPickerButton: { size: 'small' }
                            }}
                            disabled={showRecentOnly}
                        />
                        <DateTimePicker
                            label="Đến ngày"
                            value={khaiBaoEndDate}
                            onChange={(newValue) => setKhaiBaoEndDate(newValue)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    InputProps: { sx: { borderRadius: 2 } }
                                },
                                openPickerButton: { size: 'small' }
                            }}
                            disabled={showRecentOnly}
                        />

                        <Divider sx={{ my: 1 }}/>

                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>Thời gian lưu trú</Typography>
                        <DateTimePicker
                            label="Từ ngày"
                            value={luuTruStartDate}
                            onChange={(newValue) => setLuuTruStartDate(newValue)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    InputProps: { sx: { borderRadius: 2 } }
                                },
                                openPickerButton: { size: 'small' }
                            }}
                            disabled={showRecentOnly}
                        />
                        <DateTimePicker
                            label="Đến ngày"
                            value={luuTruEndDate}
                            onChange={(newValue) => setLuuTruEndDate(newValue)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    InputProps: { sx: { borderRadius: 2 } }
                                },
                                openPickerButton: { size: 'small' }
                            }}
                            disabled={showRecentOnly}
                        />

                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={showRecentOnly ? fetchRecentCustomers : fetchGuestRegistrations}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    backgroundColor: '#007bff',
                                    '&:hover': {
                                        backgroundColor: '#0069d9',
                                    },
                                }}
                            >
                                Tìm kiếm
                            </Button>
                        </Box>
                    </Box>

                    {/* Right Main Content */}
                    <Box sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
                            <Tooltip title="Làm mới dữ liệu">
                                <IconButton 
                                    size="small" 
                                    sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}
                                    onClick={handleRefresh}
                                    disabled={isLoading}
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                            <Button
                                variant="outlined"
                                startIcon={<QrCodeScannerIcon />}
                                size="medium"
                                sx={{ borderRadius: 2, textTransform: 'none' }}
                                onClick={handleScanCCCD}
                                disabled={isLoading}
                            >
                                Quét CCCD
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <FileUploadIcon />}
                                size="medium"
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    backgroundColor: '#28a745',
                                    '&:hover': {
                                        backgroundColor: '#218838',
                                    },
                                }}
                                onClick={handleExport}
                                disabled={isLoading || showRecentOnly}
                            >
                                Xuất file khai báo
                            </Button>
                        </Box>

                        {/* Table Container */}
                        <TableContainer component={Paper} sx={{ flexGrow: 1, borderRadius: 2, overflowY: 'auto' }}>
                            {isLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : error ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
                                    <Typography color="error">{error}</Typography>
                                </Box>
                            ) : (
                                <Table stickyHeader aria-label="guest list table" size="small">
                                    <TableHead>
                                        <TableRow sx={{ '& th': { backgroundColor: '#e6f4ea', fontWeight: 'bold', color: '#155724' } }}>
                                            <TableCell>Họ và tên</TableCell>
                                            <TableCell>Thông tin</TableCell>
                                            {!showRecentOnly && <TableCell>Đặt phòng</TableCell>}
                                            {!showRecentOnly && <TableCell>Phòng</TableCell>}
                                            <TableCell>Thời gian tạo</TableCell>
                                            {!showRecentOnly && <TableCell>Thời gian lưu trú</TableCell>}
                                            <TableCell>Liên hệ</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {guestList.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={showRecentOnly ? 5 : 8} align="center">
                                                    <Typography variant="body2" sx={{ py: 2 }}>
                                                        {showRecentOnly ? 'Không có dữ liệu khách hàng mới' : 'Không có dữ liệu khách lưu trú'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            guestList.map((guest) => (
                                                <TableRow key={guest.id} sx={{ 
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                    ...(showRecentOnly && {
                                                        backgroundColor: 'rgba(232, 245, 233, 0.2)', // Highlight new entries
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(232, 245, 233, 0.4)',
                                                        }
                                                    })
                                                }}>
                                                    <TableCell component="th" scope="row">
                                                        {guest.fullName}
                                                        {showRecentOnly && new Date(guest.createdAt).getTime() > Date.now() - 3600000 && (
                                                            <Chip 
                                                                size="small" 
                                                                label="Mới" 
                                                                color="success" 
                                                                variant="outlined" 
                                                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {showRecentOnly 
                                                            ? guest.gender 
                                                            : `${guest.gender} / ${guest.birthDate ? new Date(guest.birthDate).getFullYear() : 'N/A'}`
                                                        }
                                                    </TableCell>
                                                    {!showRecentOnly && <TableCell>{guest.bookingCode || 'N/A'}</TableCell>}
                                                    {!showRecentOnly && <TableCell>{guest.roomNumber || 'N/A'}</TableCell>}
                                                    <TableCell>{formatDateTime(guest.createdAt)}</TableCell>
                                                    {!showRecentOnly && <TableCell>{formatDateRange(guest.checkInTime, guest.checkOutTime)}</TableCell>}
                                                    <TableCell>
                                                        {guest.phone || 'N/A'}
                                                        {guest.email && <br />}
                                                        {guest.email}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton 
                                                            size="small" 
                                                            color="primary"
                                                            onClick={() => handleEdit(guest.id)}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton 
                                                            size="small" 
                                                            color="error"
                                                            onClick={() => handleDelete(guest.id)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </TableContainer>

                        {/* Footer Info */}
                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            Tổng {guestList.length} {showRecentOnly ? 'khách hàng mới.' : 'khách lưu trú.'}{' '}
                            {!showRecentOnly && (
                                <Link href="#" underline="hover">
                                    Xem hướng dẫn khai báo online.
                                </Link>
                            )}
                        </Typography>
                    </Box>
                </DialogContent>

                {/* Notification Snackbar */}
                <Snackbar 
                    open={notification.open} 
                    autoHideDuration={6000} 
                    onClose={handleCloseNotification}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={handleCloseNotification} 
                        severity={notification.severity}
                        sx={{ width: '100%' }}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            </Dialog>
        </LocalizationProvider>
    );
}