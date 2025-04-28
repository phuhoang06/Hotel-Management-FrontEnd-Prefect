import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid,
    MenuItem, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
    IconButton, InputAdornment, Typography, Box, CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SaveIcon from '@mui/icons-material/Save'; // Import Save icon
import viLocale from 'date-fns/locale/vi';

// Sample data - replace with your actual data fetching
const idTypes = ['CMND', 'CCCD', 'Hộ chiếu'];
const nationalities = ['Việt Nam', 'Hoa Kỳ', 'Nhật Bản', 'Hàn Quốc', 'Trung Quốc'];

// Custom styling for input fields for a modern look
const modernInputStyles = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px', // More rounded corners
        backgroundColor: '#f9fafb', // Light background color
        '& fieldset': {
            borderColor: '#e5e7eb', // Lighter border color
            transition: 'border-color 0.2s ease-in-out',
        },
        '&:hover fieldset': {
            borderColor: '#d1d5db', // Darker border on hover
        },
        '&.Mui-focused fieldset': {
            borderColor: '#3b82f6', // Primary color border on focus
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)', // Subtle focus ring
        },
    },
    '& .MuiInputBase-input': {
        padding: '10px 14px', // Adjust padding
        fontSize: '0.9rem', // Slightly larger font
        color: '#374151', // Darker text color
    },
    // Reduced margin top to bring input closer to label
    marginTop: '2px !important', // Use !important to override potential default margin
};

const modernLabelStyles = {
    fontSize: '0.9rem', // Match input font size
    fontWeight: '600', // Slightly bolder label
    color: '#1f2937', // Darker label color
    marginBottom: '4px', // Space below label
    display: 'block', // Ensure label takes full width
};

function GuestRegistrationForm({ open = true, onClose }) {
    const [formData, setFormData] = useState({
        room: 'P.203',
        fullName: '',
        gender: 'Nam',
        birthDate: null,
        phoneNumber: '',
        nationality: 'Việt Nam', // Default value for Nationality
        address: '',
        idType: 'CCCD', // Default value for ID Type
        idNumber: '',
        stayReason: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Basic validation - can be expanded
    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
        if (!formData.idType) newErrors.idType = 'Vui lòng chọn loại giấy tờ';
        if (!formData.idNumber.trim()) newErrors.idNumber = 'Vui lòng nhập số giấy tờ';
        if (!formData.nationality) newErrors.nationality = 'Vui lòng chọn quốc tịch';
        // Add validation for other fields as needed
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing/selecting
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleDateChange = (newVal) => {
        setFormData((prev) => ({ ...prev, birthDate: newVal }));
    };

    const handleScanClick = () => {
        console.log('Scanning document...');
        // Implement document scanning logic here
        // This would likely involve accessing the user's camera or file system
    };

    const handleSave = async () => {
        if (!validateForm()) {
            console.log('Validation failed', errors);
            return;
        }
        setIsLoading(true);
        try {
            console.log('Saving data:', formData);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Close dialog on successful save
            if (onClose) onClose();
            // Reset form after successful save (optional)
            // setFormData({ ...initialFormData });
        } catch (err) {
            console.error('Error saving data:', err);
            // Display error message to user
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md" // Adjust max width as needed
            PaperProps={{
                sx: {
                    borderRadius: '12px', // More pronounced rounded corners
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', // Stronger shadow
                    mx: { xs: 1, sm: 2, md: 3 }, // Responsive horizontal margin
                    my: { xs: 2, sm: 4 }, // Responsive vertical margin
                    width: '100%', // Ensure dialog takes full width on small screens
                }
            }}
        >
            <DialogTitle sx={{
                padding: '16px 24px', // Increased padding
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f9fafb', // Light background for title
            }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: '600', color: '#1f2937' }}>
                    Thêm thông tin khách lưu trú
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: '#9ca3af',
                        '&:hover': {
                            color: '#6b7280',
                            backgroundColor: 'rgba(0, 0, 0, 0.04)', // Subtle hover effect
                        },
                        transition: 'color 0.2s ease-in-out, background-color 0.2s ease-in-out',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ padding: '24px' }}> {/* Increased padding */}
                <Grid container spacing={3}> {/* Increased spacing between main columns */}

                    {/* Left Column (50%) */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}> {/* Increased gap between items in column */}


                            {/* Họ và tên (Full width within 50% column) */}
                            <div>
                                <FormLabel component="legend" sx={modernLabelStyles}>Họ và tên</FormLabel>
                                <TextField
                                    fullWidth
                                    placeholder="Nhập họ và tên"
                                    value={formData.fullName}
                                    onChange={handleChange('fullName')}
                                    error={!!errors.fullName}
                                    helperText={errors.fullName}
                                    size="small"
                                    sx={modernInputStyles}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="scan document"
                                                    onClick={handleScanClick}
                                                    edge="end"
                                                    sx={{
                                                        color: '#9ca3af',
                                                        '&:hover': { color: '#6b7280' },
                                                        transition: 'color 0.2s ease-in-out',
                                                    }}
                                                >
                                                    <CameraAltIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>

                            {/* Giới tính và Ngày sinh (Grouped within 50% column) */}
                            <Grid container spacing={2}> {/* Inner grid for grouping */}
                                <Grid item xs={12} sm={6}> {/* Giới tính takes half width on sm+ */}
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend" sx={modernLabelStyles}>Giới tính</FormLabel>
                                        <RadioGroup
                                            row
                                            value={formData.gender}
                                            onChange={handleChange('gender')}
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                                        >
                                            {['Nam', 'Nữ', 'Khác'].map((g) => (
                                                <FormControlLabel
                                                    key={g}
                                                    value={g}
                                                    control={
                                                        <Radio
                                                            sx={{
                                                                color: '#d1d5db',
                                                                '&.Mui-checked': { color: '#2563eb' },
                                                                transition: 'color 0.2s ease-in-out',
                                                            }}
                                                        />
                                                    }
                                                    label={<Typography variant="body2" sx={{ color: '#374151' }}>{g}</Typography>}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}> {/* Ngày sinh takes half width on sm+ */}
                                    <div>
                                        <FormLabel component="legend" sx={modernLabelStyles}>Ngày sinh</FormLabel>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
                                            <DatePicker
                                                value={formData.birthDate}
                                                onChange={handleDateChange}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        size: "small",
                                                        placeholder: "DD / MM /YYYY",
                                                        sx: modernInputStyles,
                                                        InputProps: {
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label="toggle date picker"
                                                                        edge="end"
                                                                        sx={{
                                                                            color: '#9ca3af',
                                                                            '&:hover': { color: '#6b7280' },
                                                                            transition: 'color 0.2s ease-in-out',
                                                                        }}
                                                                    >
                                                                        <CalendarTodayIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </Grid>
                            </Grid>

                            {/* Số điện thoại và Quốc tịch (Grouped within 50% column) */}
                            <Grid container spacing={2}> {/* Inner grid for grouping */}
                                <Grid item xs={12} sm={6}> {/* Số điện thoại takes half width on sm+ */}
                                    <div>
                                        <FormLabel component="legend" sx={modernLabelStyles}>Số điện thoại</FormLabel>
                                        <TextField
                                            fullWidth
                                            placeholder="Nhập số điện thoại"
                                            value={formData.phoneNumber}
                                            onChange={handleChange('phoneNumber')}
                                            error={!!errors.phoneNumber}
                                            helperText={errors.phoneNumber}
                                            type="tel"
                                            size="small"
                                            sx={modernInputStyles}
                                            InputProps={{
                                                inputMode: 'numeric',
                                                pattern: '[0-9]*'
                                            }}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={6}> {/* Quốc tịch takes half width on sm+ */}
                                    <div>
                                        <FormLabel component="legend" sx={modernLabelStyles}>Quốc tịch</FormLabel>
                                        <TextField
                                            select
                                            fullWidth
                                            value={formData.nationality}
                                            onChange={handleChange('nationality')}
                                            error={!!errors.nationality}
                                            helperText={errors.nationality}
                                            displayEmpty
                                            size="small"
                                            sx={modernInputStyles}
                                        >
                                            <MenuItem value="" disabled>Chọn quốc tịch</MenuItem>
                                            {nationalities.map((n) => (
                                                <MenuItem key={n} value={n}>
                                                    {n}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    {/* Right Column (50%) */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}> {/* Increased gap between items in column */}

                            {/* Loại giấy tờ và Số giấy tờ (Grouped within 50% column) */}
                            <Grid container spacing={2}> {/* Inner grid for grouping */}
                                <Grid item xs={12} sm={6}> {/* Loại giấy tờ takes half width on sm+ */}
                                    <div>
                                        <FormLabel component="legend" sx={modernLabelStyles}>Loại giấy tờ</FormLabel>
                                        <TextField
                                            select
                                            fullWidth
                                            value={formData.idType}
                                            onChange={handleChange('idType')}
                                            error={!!errors.idType}
                                            helperText={errors.idType}
                                            displayEmpty
                                            size="small"
                                            sx={modernInputStyles}
                                        >
                                            <MenuItem value="" disabled>Chọn loại giấy tờ</MenuItem>
                                            {idTypes.map((t) => (
                                                <MenuItem key={t} value={t}>
                                                    {t}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={6}> {/* Số giấy tờ takes half width on sm+ */}
                                    <div>
                                        <FormLabel component="legend" sx={modernLabelStyles}>Số giấy tờ</FormLabel>
                                        <TextField
                                            fullWidth
                                            placeholder="Nhập số giấy tờ"
                                            value={formData.idNumber}
                                            onChange={handleChange('idNumber')}
                                            error={!!errors.idNumber}
                                            helperText={errors.idNumber}
                                            size="small"
                                            sx={modernInputStyles}
                                        />
                                    </div>
                                </Grid>
                            </Grid>

                            {/* Địa chỉ (Full width within 50% column) */}
                            <div>
                                <FormLabel component="legend" sx={modernLabelStyles}>Địa chỉ</FormLabel>
                                <TextField
                                    fullWidth
                                    placeholder="Nhập địa chỉ"
                                    value={formData.address}
                                    onChange={handleChange('address')}
                                    size="small"
                                    sx={modernInputStyles}
                                />
                            </div>

                            {/* Lý do lưu trú (Full width within 50% column) */}
                            <div>
                                <FormLabel component="legend" sx={modernLabelStyles}>Lý do lưu trú</FormLabel>
                                <TextField
                                    fullWidth
                                    placeholder="Nhập lý do lưu trú"
                                    value={formData.stayReason}
                                    onChange={handleChange('stayReason')}
                                    size="small"
                                    sx={modernInputStyles}
                                />
                            </div>

                            {/* Ghi chú (Full width within 50% column, increased height) */}
                            <div>
                                <FormLabel component="legend" sx={modernLabelStyles}>Ghi chú</FormLabel>
                                <TextField
                                    fullWidth
                                    placeholder="Nhập ghi chú ..."
                                    value={formData.notes}
                                    onChange={handleChange('notes')}
                                    multiline
                                    rows={4} // Increased rows for better appearance
                                    size="small" // Apply size to multiline as well
                                    sx={modernInputStyles}
                                />
                            </div>
                        </Box>
                    </Grid>

                </Grid>
            </DialogContent>
            <Box sx={{
                px: 3,
                py: 2,
                bgcolor: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between', // Changed to space-between
                alignItems: 'center', // Vertically align items
                gap: 2, // Increased gap between buttons
                borderBottomLeftRadius: '12px', // Match dialog border radius
                borderBottomRightRadius: '12px', // Match dialog border radius
            }}>
                {/* "Hủy" button - aligned to start */}
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                        padding: '10px 20px', // Adjusted padding
                        borderRadius: '8px', // Match input border radius
                        fontSize: '0.9rem', // Match input font size
                        fontWeight: '500',
                        textTransform: 'none',
                        borderColor: '#d1d5db', // Added subtle border
                        color: '#374151',
                        '&:hover': {
                            backgroundColor: '#f3f4f6', // Light hover background
                            borderColor: '#d1d5db',
                        },
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Subtle shadow
                    }}
                >
                    Hủy
                </Button>
                {/* "Lưu" button - aligned to end with icon */}
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} // Add Save icon and loading spinner
                    sx={{
                        padding: '10px 20px', // Adjusted padding
                        borderRadius: '8px', // Match input border radius
                        fontSize: '0.9rem', // Match input font size
                        fontWeight: '500',
                        textTransform: 'none',
                        backgroundColor: '#e5e7eb', // Less prominent default color
                        color: '#4b5563', // Darker text for contrast
                        '&:hover': {
                            backgroundColor: '#10b981', // Green on hover
                            color: '#fff', // White text on green hover
                        },
                        '&:disabled': {
                            backgroundColor: '#e5e7eb', // Keep less prominent color when disabled
                            color: '#9ca3af', // Lighter text when disabled
                        },
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Subtle shadow
                        transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out', // Smooth transition
                    }}
                >
                    Lưu
                </Button>
            </Box>
        </Dialog>
    );
}

export default GuestRegistrationForm;
