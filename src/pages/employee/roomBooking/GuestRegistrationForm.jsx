import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    IconButton,
    InputAdornment,
    Typography,
    Box
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import ScannerIcon from '@mui/icons-material/Scanner';
import viLocale from 'date-fns/locale/vi';

function GuestRegistrationForm() {
    const [open, setOpen] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        gender: 'male',
        birthDate: null,
        phoneNumber: '',
        nationality: '',
        address: '',
        idType: '',
        idNumber: '',
        stayReason: '',
        notes: ''
    });

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setFormData(prevState => ({
            ...prevState,
            birthDate: date
        }));
    };

    const handleScanClick = () => {
        console.log('Scanning document...');
        // Functionality to scan documents would be implemented here
    };

    const handleSave = () => {
        console.log('Saving data:', formData);
        // Submit logic would go here
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 1,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }
            }}
        >
            <DialogTitle sx={{ borderBottom: '1px solid #f0f0f0', p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div">
                        Thêm thông tin khách lưu trú
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Left Column */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Họ và tên"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    variant="outlined"
                                    margin="dense"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    edge="end"
                                                    color="primary"
                                                    onClick={handleScanClick}
                                                    sx={{
                                                        border: '1px solid #1976d2',
                                                        borderRadius: 1,
                                                        p: 0.5
                                                    }}
                                                >
                                                    <ScannerIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl component="fieldset" margin="dense">
                                    <FormLabel component="legend">Giới tính</FormLabel>
                                    <RadioGroup
                                        row
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="male" control={<Radio color="primary" />} label="Nam" />
                                        <FormControlLabel value="female" control={<Radio color="primary" />} label="Nữ" />
                                        <FormControlLabel value="other" control={<Radio color="primary" />} label="Khác" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
                                    <DatePicker
                                        label="Ngày sinh"
                                        value={formData.birthDate}
                                        onChange={handleDateChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                variant="outlined"
                                                margin="dense"
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Số điện thoại"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    variant="outlined"
                                    margin="dense"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Quốc tịch"
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleChange}
                                    variant="outlined"
                                    margin="dense"
                                >
                                    <MenuItem value="">Chọn quốc tịch</MenuItem>
                                    <MenuItem value="VN">Việt Nam</MenuItem>
                                    <MenuItem value="US">United States</MenuItem>
                                    <MenuItem value="JP">Japan</MenuItem>
                                    <MenuItem value="KR">Korea</MenuItem>
                                    <MenuItem value="CN">China</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Địa chỉ"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    variant="outlined"
                                    margin="dense"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Loại giấy tờ"
                                    name="idType"
                                    value={formData.idType}
                                    onChange={handleChange}
                                    variant="outlined"
                                    margin="dense"
                                >
                                    <MenuItem value="">Chọn giấy tờ</MenuItem>
                                    <MenuItem value="CMND">CMND</MenuItem>
                                    <MenuItem value="CCCD">CCCD</MenuItem>
                                    <MenuItem value="HC">Hộ chiếu</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Số giấy tờ"
                                    name="idNumber"
                                    value={formData.idNumber}
                                    onChange={handleChange}
                                    variant="outlined"
                                    margin="dense"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Lý do lưu trú"
                                    name="stayReason"
                                    value={formData.stayReason}
                                    onChange={handleChange}
                                    variant="outlined"
                                    margin="dense"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Ghi chú"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    variant="outlined"
                                    margin="dense"
                                    multiline
                                    rows={3}
                                    placeholder="Nhập ghi chú..."
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ borderTop: '1px solid #f0f0f0', p: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    sx={{
                        bgcolor: '#00A67E',
                        '&:hover': {
                            bgcolor: '#008c69',
                        },
                        px: 3,
                    }}
                >
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default GuestRegistrationForm;