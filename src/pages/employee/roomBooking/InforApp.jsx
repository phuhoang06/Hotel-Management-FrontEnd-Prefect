import React, { useState } from 'react';
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
    useMediaQuery
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


function BookingDialog({ open, handleClose }) {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [openGuestForm, setOpenGuestForm] = useState(false);
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

    // Hàm xử lý đóng GuestRegistrationForm
    const handleCloseGuestForm = () => {
        setOpenGuestForm(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md" // Adjust max width as needed
                fullWidth
                PaperProps={{ sx: { borderRadius: 2 } }} // Optional: Rounded corners
            >
                <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
                    Khách lưu trú - Đặt phòng 2
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
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

                <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}> {/* Add dividers and padding */}
                    {/* Section: Số lượng khách */}
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

                    {/* Section: Thông tin chi tiết */}
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
                            {/* Các nút hành động */}
                            <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                                <IconButton title="Làm mới" size="medium" sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
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
                                    variant="contained" // Looks like a contained button
                                    size="medium"
                                    startIcon={<CameraAltOutlinedIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        bgcolor: '#E0F2F1', // Light teal/green background
                                        color: '#00796B', // Darker teal/green text
                                        border: '1px solid #B2DFDB', // Matching border
                                        boxShadow: 'none',
                                        whiteSpace: 'nowrap',
                                        '&:hover': {
                                            bgcolor: '#B2DFDB', // Slightly darker on hover
                                            boxShadow: 'none',
                                        }
                                    }}
                                >
                                    Chụp CCCD / Hộ chiếu
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>

                    {/* Section: Guest List Header */}
                    <Box sx={{ bgcolor: '#E8F5E9', p: 1.5, borderRadius: 1.5, mb: 2 }}> {/* Light green background */}
                        <Grid container spacing={1} textAlign="left">
                            <Grid item xs={12} sm={2.4} sx={{ px: 1 }}><Typography variant="body2" sx={{ fontWeight: 'medium' }}>Họ và tên</Typography></Grid>
                            <Grid item xs={12} sm={2.4} sx={{ display: { xs: 'none', sm: 'block' }, px: 1 }}><Typography variant="body2" sx={{ fontWeight: 'medium' }}>Thông tin cá nhân</Typography></Grid>
                            <Grid item xs={12} sm={2.4} sx={{ display: { xs: 'none', sm: 'block' }, px: 1 }}><Typography variant="body2" sx={{ fontWeight: 'medium' }}>Phòng</Typography></Grid>
                            <Grid item xs={12} sm={2.4} sx={{ display: { xs: 'none', sm: 'block' }, px: 1 }}><Typography variant="body2" sx={{ fontWeight: 'medium' }}>Thời gian khai báo</Typography></Grid>
                            <Grid item xs={12} sm={2.4} sx={{ display: { xs: 'none', sm: 'block' }, px: 1 }}><Typography variant="body2" sx={{ fontWeight: 'medium' }}>Thời gian lưu trú</Typography></Grid>
                        </Grid>
                    </Box>

                    {/* Section: Guest List Body (Placeholder) */}
                    <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4 }, color: 'grey.600' }}>
                        <Typography variant="body1">Chưa có thông tin khách lưu trú</Typography>
                    </Box>

                    {/* Section: Footer Hint */}
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

                <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}> {/* Align button to the right */}
                    <Button
                        onClick={handleClose}
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
            
            {openGuestForm && <GuestRegistrationForm open={openGuestForm} onClose={handleCloseGuestForm} />}
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

export { BookingDialog }; // Export BookingDialog component
export default InforApp; // Or export BookingDialog if used elsewhere