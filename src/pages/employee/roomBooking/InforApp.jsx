import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Stack,
    Divider,
    InputAdornment,
    useTheme,
    useMediaQuery,
    Avatar,
    CircularProgress,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RefreshIcon from '@mui/icons-material/Refresh';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'; // Outlined version
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; // Outline version
import GuestRegistrationForm from './GuestRegistrationForm';
import guestService from '../../../service/guest.service';

// Custom Number Input Component (Simplified Example)
const NumberInput = ({ label, value, onIncrement, onDecrement, min = 0 }) => (
    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="nowrap">
        <Typography variant="body2" sx={{ minWidth: '60px', flexShrink: 0 }}>{label}</Typography>
        <IconButton
            size="small"
            onClick={onDecrement}
            disabled={value <= min}
            sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, padding: '4px' }}
        >
            <RemoveIcon fontSize="inherit" />
        </IconButton>
        <TextField
            size="small"
            value={value}
            InputProps={{
                readOnly: true, // Make it non-editable directly if needed
                sx: {
                    maxWidth: '50px',
                    textAlign: 'center',
                    '& input': { textAlign: 'center', padding: '8px 5px' },
                    borderRadius: 1
                },
            }}
            variant="outlined"
            sx={{ mx: 0.5 }}
        />
        <IconButton
            size="small"
            onClick={onIncrement}
            sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, padding: '4px' }}
        >
            <AddIcon fontSize="inherit" />
        </IconButton>
    </Stack>
);

// Customer Selection Dialog Component
function CustomerSelectionDialog({ open, onClose, onSelectCustomers }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    
    // Fetch customers when dialog opens
    useEffect(() => {
        if (open) {
            fetchAllCustomers();
        }
    }, [open]);
    
    // Fetch all customers from API
    const fetchAllCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            // Remove the limit to fetch all customers
            const response = await guestService.getRecentCustomers(); 
            
            let customerData = [];
            if (response && Array.isArray(response)) {
                customerData = response;
            } else if (response && response.content && Array.isArray(response.content)) {
                customerData = response.content;
            } else if (response && typeof response === 'object') {
                const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
                if (possibleArrays.length > 0) {
                    customerData = possibleArrays[0];
                }
            }
            
            setCustomers(customerData);
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError('Không thể tải danh sách khách hàng.');
        } finally {
            setLoading(false);
        }
    };
    
    // Handle selecting a customer (only one can be selected)
    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
    };
    
    // Check if a customer is selected
    const isSelected = (id) => selectedCustomer && selectedCustomer.id === id;
    
    // Handle confirm selection
    const handleConfirm = () => {
        if (selectedCustomer) {
            onSelectCustomers(selectedCustomer);
        }
        onClose();
    };
    
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Không có dữ liệu';
            }
            
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).format(date);
        } catch (error) {
            return 'Không có dữ liệu';
        }
    };
    
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
                Danh sách khách lưu trú
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent dividers sx={{ p: 0 }}>
                {loading ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress size={30} />
                        <Typography variant="body2" sx={{ mt: 2 }}>Đang tải dữ liệu...</Typography>
                    </Box>
                ) : error ? (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'error.main' }}>
                        <Typography variant="body1">{error}</Typography>
                        <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={fetchAllCustomers}
                            sx={{ mt: 2 }}
                        >
                            Thử lại
                        </Button>
                    </Box>
                ) : (
                    <Paper elevation={0} sx={{ maxHeight: 400, overflow: 'auto' }}>
                        <List sx={{ width: '100%', bgcolor: 'background.paper', py: 0 }}>
                            {customers.length === 0 ? (
                                <ListItem>
                                    <ListItemText primary="Không có khách lưu trú nào" />
                                </ListItem>
                            ) : (
                                customers.map((customer) => {
                                    const labelId = `checkbox-list-label-${customer.id}`;
                                    const fullName = customer.fullName || 'Không xác định';
                                    const firstLetter = fullName.charAt(0).toUpperCase() || '?';
                                    const gender = customer.gender || 'OTHER';
                                    
                                    return (
                                        <ListItem
                                            key={customer.id}
                                            disablePadding
                                            divider
                                        >
                                            <ListItemButton 
                                                onClick={() => handleSelectCustomer(customer)}
                                                dense
                                                sx={{ py: 1.5 }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 42 }}>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={isSelected(customer.id)}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemAvatar>
                                                    <Avatar 
                                                        sx={{ 
                                                            width: 32, 
                                                            height: 32,
                                                            bgcolor: gender === 'MALE' ? '#E3F2FD' : gender === 'FEMALE' ? '#FFEBEE' : '#F5F5F5',
                                                            color: gender === 'MALE' ? '#1976D2' : gender === 'FEMALE' ? '#D32F2F' : '#757575',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        {firstLetter}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    id={labelId}
                                                    primary={fullName}
                                                    secondary={
                                                        <>
                                                            {customer.phone && <span>{customer.phone}</span>}
                                                            {customer.idCard && <span> | {customer.idCard}</span>}
                                                            {customer.createdAt && <span> | {formatDate(customer.createdAt)}</span>}
                                                        </>
                                                    }
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })
                            )}
                        </List>
                    </Paper>
                )}
            </DialogContent>
            
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                    {selectedCustomer ? 'Đã chọn 1 khách' : 'Chưa chọn khách'}
                </Typography>
                <Box>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            mr: 1,
                            color: 'text.primary',
                            borderColor: 'grey.300',
                            textTransform: 'none'
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="contained"
                        disabled={!selectedCustomer}
                        sx={{
                            bgcolor: '#00695C',
                            color: 'white',
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: '#004D40',
                            },
                            '&.Mui-disabled': {
                                bgcolor: '#E0E0E0',
                                color: '#9E9E9E',
                            }
                        }}
                    >
                        Xác nhận
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

function BookingDialog({ open, handleClose, onUpdateCustomerInfo }) {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [openGuestForm, setOpenGuestForm] = useState(false);
    const [recentCustomers, setRecentCustomers] = useState([]);
    const [primaryCustomer, setPrimaryCustomer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openCustomerSelection, setOpenCustomerSelection] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Hàm xử lý tăng/giảm số lượng
    const handleAdultsIncrement = () => setAdults(adults + 1);
    const handleAdultsDecrement = () => setAdults(adults > 1 ? adults - 1 : 1);
    const handleChildrenIncrement = () => setChildren(children + 1);
    const handleChildrenDecrement = () => setChildren(children > 0 ? children - 1 : 0);
    
    // Hàm xử lý mở GuestRegistrationForm
    const handleOpenGuestForm = () => {
        setOpenGuestForm(true);
    };

    // Fetch recent customers when dialog opens or refreshes
    const fetchRecentCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            // Change to fetch all customers for consistency
            const response = await guestService.getRecentCustomers(); 
            console.log('API response for recent customers:', response);
            
            let customers = [];
            if (response && Array.isArray(response)) {
                customers = response;
            } else if (response && response.content && Array.isArray(response.content)) {
                customers = response.content;
            } else if (response && typeof response === 'object') {
                const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
                if (possibleArrays.length > 0) {
                    customers = possibleArrays[0];
                }
            }
            setRecentCustomers(customers);
            // Set the first fetched customer as primary if none is selected yet
            if (!primaryCustomer && customers.length > 0) {
                setPrimaryCustomer(customers[0]);
                console.log('Setting initial primary customer:', customers[0]);
            }
        } catch (err) {
            console.error('Error fetching recent customers:', err);
            setError('Không thể tải danh sách khách hàng.');
            setRecentCustomers([]);
            setPrimaryCustomer(null); // Clear primary if fetch fails
        } finally {
            setLoading(false);
        }
    };

    // Xử lý làm mới danh sách khách hàng
    const handleRefresh = () => {
        fetchRecentCustomers();
    };

    // Fetch recent customers when dialog opens
    useEffect(() => {
        if (open) {
            fetchRecentCustomers();
        }
    }, [open]);

    // Hàm format thời gian
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return 'Không có dữ liệu';
            }
            
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Không có dữ liệu';
        }
    };

    // Render danh sách khách hàng - focused on primaryCustomer
    const renderCustomerList = () => {
        if (loading) {
            return (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={30} />
                    <Typography variant="body2" sx={{ mt: 2 }}>Đang tải dữ liệu...</Typography>
                </Box>
            );
        }

        if (error) {
            return (
                <Box sx={{ textAlign: 'center', py: 4, color: 'error.main' }}>
                    <Typography variant="body1">{error}</Typography>
                    <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={handleRefresh} // Allow refresh even if primary exists
                        sx={{ mt: 2 }}
                    >
                        Thử lại
                    </Button>
                </Box>
            );
        }

        // Use primaryCustomer for display
        const customerToDisplay = primaryCustomer;

        if (!customerToDisplay) {
            return (
                <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4 }, color: 'grey.600' }}>
                    <Typography variant="body1">Chưa chọn/thêm khách lưu trú</Typography>
                    <Typography variant="caption">(Nhấn nút + hoặc "Khách lưu trú" để chọn)</Typography>
                </Box>
            );
        }
        
        const fullName = customerToDisplay.fullName || 'Không xác định';
        const firstLetter = fullName.charAt(0).toUpperCase() || '?';
        const gender = customerToDisplay.gender || 'OTHER';
        
        return (
            <Box 
                key={customerToDisplay.id} 
                sx={{ 
                    py: 1.5, 
                    borderBottom: '1px solid #f0f0f0'
                    // Add visual cue if needed that this is the selected primary
                    // bgcolor: 'rgba(0, 105, 92, 0.05)' // Example subtle highlight
                }}
            >
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={2.4} sx={{ px: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar 
                                sx={{
                                    width: 32, 
                                    height: 32,
                                    bgcolor: gender === 'MALE' ? '#E3F2FD' : gender === 'FEMALE' ? '#FFEBEE' : '#F5F5F5',
                                    color: gender === 'MALE' ? '#1976D2' : gender === 'FEMALE' ? '#D32F2F' : '#757575',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {firstLetter}
                            </Avatar>
                            <Typography variant="body2" noWrap title={fullName}>
                                {fullName}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={2.4} sx={{ display: { xs: 'none', sm: 'block' }, px: 1 }}>
                        <Typography variant="body2" noWrap>
                            {customerToDisplay.phone || 'Không có SĐT'} {customerToDisplay.idCard ? `| ${customerToDisplay.idCard}` : ''}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2.4} sx={{ display: { xs: 'none', sm: 'block' }, px: 1 }}>
                        <Typography variant="body2" noWrap color="text.secondary">
                            Chưa gán phòng
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2.4} sx={{ display: { xs: 'none', sm: 'block' }, px: 1 }}>
                        <Typography variant="body2" noWrap>
                            {formatDate(customerToDisplay.createdAt)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2.4} sx={{ display: { xs: 'none', sm: 'block' }, px: 1 }}>
                        <Typography variant="body2" noWrap color="text.secondary">
                            Chưa xác định
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    // Hàm xử lý mở dialog chọn khách
    const handleOpenCustomerSelection = () => {
        setOpenCustomerSelection(true);
    };
    
    // Hàm xử lý đóng dialog chọn khách
    const handleCloseCustomerSelection = () => {
        setOpenCustomerSelection(false);
    };
    
    // Modify handleSelectCustomers to update the main customer list AND primary customer
    const handleSelectCustomers = (selected) => {
        if (selected) {
            // Set the selected customer as the primary one
            setPrimaryCustomer(selected);
            
            // Update the recent customers list to include only this customer
            setRecentCustomers([selected]);
            console.log('Setting primary customer from selection:', selected);
        } else {
            // If selection is cleared, clear primary customer too
            setPrimaryCustomer(null);
            setRecentCustomers([]);
        }
        handleCloseCustomerSelection();
    };

    // Modified handleClose for the main BookingDialog
    const handleDialogClose = () => {
        // Pass back the relevant info using the callback FIRST
        if (onUpdateCustomerInfo) {
            const customerToReturn = primaryCustomer;
            console.log('BookingDialog: Sending primary customer data:', customerToReturn);
            console.log('BookingDialog: Calling onUpdateCustomerInfo with:', { customer: customerToReturn, adults, children });
            onUpdateCustomerInfo(customerToReturn, adults, children);
        }
        // Call the original close handler passed as prop to actually close the dialog
        handleClose(); 
    };

    // Hàm xử lý đóng GuestRegistrationForm
    const handleCloseGuestForm = (newCustomer) => {
        setOpenGuestForm(false);
        if (newCustomer && newCustomer.id) {
            // Set the new customer as primary and update the list
            setPrimaryCustomer(newCustomer);
            setRecentCustomers([newCustomer]); // You might still want to show only the new one
            console.log('Setting primary customer from new guest:', newCustomer);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleDialogClose}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2 } }}
            >
                <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
                    Khách lưu trú - Đặt phòng 2
                    <IconButton
                        aria-label="close"
                        onClick={handleDialogClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box mb={3}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', mb: 1.5 }}>
                            Số lượng khách
                        </Typography>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 2, sm: 3 }}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                        >
                            <NumberInput
                                label="Người lớn"
                                value={adults}
                                onIncrement={handleAdultsIncrement}
                                onDecrement={handleAdultsDecrement}
                                min={1}
                            />
                            <NumberInput
                                label="Trẻ em"
                                value={children}
                                onIncrement={handleChildrenIncrement}
                                onDecrement={handleChildrenDecrement}
                                min={0}
                            />
                        </Stack>
                    </Box>

                    <Box mb={3}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            spacing={1}
                            mb={1.5}
                        >
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', mb: { xs: 1, sm: 0 } }}>
                                Thông tin chi tiết
                            </Typography>
                            <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                                <IconButton 
                                    title="Làm mới" 
                                    size="medium" 
                                    sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1 }}
                                    onClick={handleRefresh}
                                >
                                    <RefreshIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                    title="Thêm khách" 
                                    size="medium" 
                                    sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1 }}
                                    onClick={handleOpenGuestForm}
                                >
                                    <AddIcon fontSize="small" />
                                </IconButton>
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    startIcon={<QrCodeScannerIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        color: 'text.primary',
                                        borderColor: 'grey.300',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Quét CCCD
                                </Button>
                                <Button
                                    variant="contained"
                                    size="medium"
                                    startIcon={<CameraAltOutlinedIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        bgcolor: '#E0F2F1',
                                        color: '#00796B',
                                        border: '1px solid #B2DFDB',
                                        boxShadow: 'none',
                                        whiteSpace: 'nowrap',
                                        '&:hover': {
                                            bgcolor: '#B2DFDB',
                                            boxShadow: 'none',
                                        }
                                    }}
                                >
                                    Chụp CCCD / Hộ chiếu
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>

                    <Box sx={{ bgcolor: '#E8F5E9', p: 1.5, borderRadius: 1.5, mb: 2 }}>
                        <Grid container spacing={1} textAlign="left">
                            <Grid item xs={12} sm={2.4} sx={{ px: 1 }}><Typography variant="body2" sx={{ fontWeight: 'medium' }}>Họ và tên</Typography></Grid>
                            <Grid item xs={12} sm={2.4} sx={{ display: { xs: 'none', sm: 'block' }, px: 1 }}><Typography variant="body2" sx={{ fontWeight: 'medium' }}>Thông tin cá nhân</Typography></Grid>
                            <Grid item xs={12} sm={2.4} sx={{ display: { xs: 'none', sm: 'block' }, px: 1 }}><Typography variant="body2" sx={{ fontWeight: 'medium' }}>Phòng</Typography></Grid>
                            <Grid item xs={12} sm={2.4} sx={{ display: { xs: 'none', sm: 'block' }, px: 1 }}><Typography variant="body2" sx={{ fontWeight: 'medium' }}>Thời gian khai báo</Typography></Grid>
                            <Grid item xs={12} sm={2.4} sx={{ display: { xs: 'none', sm: 'block' }, px: 1 }}><Typography variant="body2" sx={{ fontWeight: 'medium' }}>Thời gian lưu trú</Typography></Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 2 }}>
                        {renderCustomerList()}
                    </Box>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        mt={2}
                        flexWrap="wrap"
                        gap={1}
                    >
                        <Typography variant="caption" sx={{ color: 'grey.700', textAlign: { xs: 'left', sm: 'inherit' } }}>
                            Để xem danh sách khai báo lưu trú, vào menu
                        </Typography>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<MenuIcon />}
                                sx={{
                                    textTransform: 'none',
                                    color: 'text.secondary',
                                    borderColor: 'grey.300',
                                    fontWeight: 'normal'
                                }}
                            >
                                Nhiều hơn chọn
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<PersonOutlineIcon />}
                                onClick={handleOpenCustomerSelection}
                                sx={{
                                    textTransform: 'none',
                                    color: 'text.secondary',
                                    borderColor: 'grey.300',
                                    fontWeight: 'normal'
                                }}
                            >
                                Khách lưu trú
                            </Button>
                        </Stack>
                    </Stack>

                </DialogContent>

                <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                    <Button
                        onClick={handleDialogClose}
                        variant="contained"
                        sx={{
                            bgcolor: '#00695C',
                            color: 'white',
                            textTransform: 'none',
                            padding: '8px 24px',
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: '#004D40',
                            }
                        }}
                    >
                        Xong
                    </Button>
                </DialogActions>
            </Dialog>
            
            {openCustomerSelection && (
                <CustomerSelectionDialog
                    open={openCustomerSelection}
                    onClose={handleCloseCustomerSelection}
                    onSelectCustomers={handleSelectCustomers}
                />
            )}
            
            {openGuestForm && 
                <GuestRegistrationForm 
                    open={openGuestForm} 
                    onClose={() => setOpenGuestForm(false)}
                    onSuccess={handleCloseGuestForm}
                />
            }
        </>
    );
}

// --- Example Usage ---
function InforApp() {
    const [openDialog, setOpenDialog] = useState(false);

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Mở Dialog Đặt phòng
            </Button>
            <BookingDialog open={openDialog} handleClose={handleCloseDialog} />
        </div>
    );
}

export { BookingDialog };
export default InforApp;