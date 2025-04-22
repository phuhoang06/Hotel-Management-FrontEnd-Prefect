import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Tabs, Tab,
    Grid, Box, Typography, TextField, FormControl, Select, MenuItem, RadioGroup, FormControlLabel,
    Radio, InputAdornment
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useFormik } from "formik";

function EditEmployeeDialog({ open, onClose, employeeData }) {
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    // Dữ liệu giả lập cho tỉnh và quận/huyện
    const mockProvinces = [
        { id: "01", full_name: "Hà Nội" },
        { id: "02", full_name: "Hồ Chí Minh" },
    ];

    const mockDistricts = {
        "01": [
            { id: "006", full_name: "Đống Đa" },
            { id: "007", full_name: "Ba Đình" },
        ],
        "02": [
            { id: "001", full_name: "Quận 1" },
            { id: "002", full_name: "Quận 3" },
        ],
    };

    const [provinces] = useState(mockProvinces);
    const [districts, setDistricts] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);

    // Dữ liệu tài khoản
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        const mockAccounts = [
            { id: "NV001", name: "Tài khoản 1" },
            { id: "TP002", name: "Tài khoản 2" },
            { id: "NV003", name: "Tài khoản 3" },
        ];
        setAccounts(mockAccounts);
    }, []);

    // Sử dụng Formik để quản lý dữ liệu form
    const formik = useFormik({
        initialValues: {
            userId: employeeData?.userId || "",
            fullName: employeeData?.fullName || "",
            phone: employeeData?.phone || "",
            startDate: employeeData?.startDate || "",
            department: employeeData?.department || "",
            position: employeeData?.position || "",
            note: employeeData?.note || "",
            idCard: employeeData?.idCard || "",
            dob: employeeData?.dob || "",
            gender: employeeData?.gender || "",
            address: employeeData?.address || "",
            province: employeeData?.province || "",
            district: employeeData?.district || "",
            email: employeeData?.email || "",
            method: employeeData?.method || "",
            image: employeeData?.image || "",
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            console.log("Dữ liệu nhân viên đã chỉnh sửa:", { ...values, image: imagePreview });
            alert("Dữ liệu đã được in ra console. Vui lòng kiểm tra!");
        },
    });

    // Cập nhật danh sách quận/huyện khi tỉnh thay đổi
    useEffect(() => {
        if (formik.values.province) {
            setDistricts(mockDistricts[formik.values.province] || []);
            if (!mockDistricts[formik.values.province]) {
                formik.setFieldValue('district', '');
            }
        } else {
            setDistricts([]);
            formik.setFieldValue('district', '');
        }
    }, [formik.values.province]);

    // Cập nhật imagePreview khi employeeData thay đổi
    useEffect(() => {
        if (employeeData?.image) {
            setImagePreview(employeeData.image);
        } else {
            setImagePreview(null);
        }
    }, [employeeData]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
            formik.setFieldValue('image', imageUrl);
        }
    };

    const handleClose = () => {
        formik.resetForm();
        setImagePreview(null);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            disableRestoreFocus={true}
            maxWidth={false}
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    width: '80vw',
                    height: '90vh',
                    maxWidth: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '10px',
                },
            }}
        >
            <DialogTitle sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                height: '70px',
                padding: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 'bold', color: '#333' }} variant="h6">
                        Chỉnh sửa nhân viên
                    </Typography>
                    <IconButton
                        aria-label="close"
                        sx={{ color: (theme) => theme.palette.grey[500] }}
                        onClick={handleClose}
                    >
                        <ClearIcon />
                    </IconButton>
                </Box>
                <Tabs value={0} sx={{ fontSize: 12, minHeight: 34 }}>
                    <Tab label="Thông tin" sx={{ textTransform: 'none', minHeight: 34, height: 34, padding: '6px 12px', color: '#1976d2', fontWeight: 'bold' }} />
                    <Tab label="Thiết lập lương" sx={{ textTransform: 'none', minHeight: 34, height: 34, padding: '4px 12px', color: '#555' }} />
                </Tabs>
            </DialogTitle>

            <DialogContent sx={{ flex: 1, overflowY: 'auto', p: 2, mt: 2, backgroundColor: '#f5f5f5' }}>
                <Grid container spacing={2}>
                    <Grid size={2.5} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box
                            sx={{
                                width: 144,
                                height: 144,
                                border: '1px dashed #ccc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                                mt: 3,
                                backgroundColor: '#f5f5f5',
                                borderRadius: '8px',
                                overflow: 'hidden',
                            }}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Employee"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <IconButton>
                                    <CameraAltIcon sx={{ color: '#999' }} />
                                </IconButton>
                            )}
                        </Box>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            sx={{ fontSize: 13 }}
                        >
                            Upload files
                            <VisuallyHiddenInput
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                multiple
                            />
                        </Button>
                    </Grid>

                    <Grid size={9.2}>
                        <Box sx={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', borderRadius: '10px', p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, mt: 1, color: '#333', fontSize: '16px' }}>
                                Thông tin khởi tạo
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 'bold' }}>
                                                Tên nhân viên
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder="Nhập tên nhân viên"
                                                size="small"
                                                variant="outlined"
                                                name="fullName"
                                                value={formik.values.fullName}
                                                onChange={formik.handleChange}
                                                sx={{
                                                    width: '100%',
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        backgroundColor: '#f5f5f5',
                                                        '& fieldset': { borderColor: '#e0e0e0' },
                                                        '&:hover fieldset': { borderColor: '#1976d2' },
                                                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 'bold' }}>
                                                Số điện thoại
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder="Nhập số điện thoại"
                                                size="small"
                                                variant="outlined"
                                                name="phone"
                                                value={formik.values.phone}
                                                onChange={formik.handleChange}
                                                sx={{
                                                    width: '100%',
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        backgroundColor: '#f5f5f5',
                                                        '& fieldset': { borderColor: '#e0e0e0' },
                                                        '&:hover fieldset': { borderColor: '#1976d2' },
                                                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', borderRadius: '10px', p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, mt: 1, color: '#333', fontSize: '16px' }}>
                                Thông tin công việc
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 'bold' }}>
                                                Ngày bắt đầu làm việc
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder="Nhập ngày bắt đầu làm việc"
                                                size="small"
                                                variant="outlined"
                                                type="date"
                                                name="startDate"
                                                value={formik.values.startDate}
                                                onChange={formik.handleChange}
                                                sx={{
                                                    width: '100%',
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        backgroundColor: '#f5f5f5',
                                                        '& fieldset': { borderColor: '#e0e0e0' },
                                                        '&:hover fieldset': { borderColor: '#1976d2' },
                                                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 'bold' }}>
                                                Phòng ban
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <FormControl fullWidth size="small">
                                                    <Select
                                                        displayEmpty
                                                        variant="outlined"
                                                        name="department"
                                                        value={formik.values.department}
                                                        onChange={formik.handleChange}
                                                        sx={{
                                                            borderRadius: '8px',
                                                            backgroundColor: '#f5f5f5',
                                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
                                                        }}
                                                    >
                                                        <MenuItem value="" disabled>Chọn phòng ban</MenuItem>
                                                        <MenuItem value="Front Desk">Front Desk</MenuItem>
                                                        <MenuItem value="Phòng IT">Phòng IT</MenuItem>
                                                        <MenuItem value="Phòng HR">Phòng HR</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        borderRadius: '8px',
                                                        borderColor: '#e0e0e0',
                                                        minWidth: '40px',
                                                        padding: '0 8px'
                                                    }}
                                                >
                                                    +
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 'bold' }}>
                                                Chức danh
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <FormControl fullWidth size="small">
                                                    <Select
                                                        displayEmpty
                                                        variant="outlined"
                                                        name="position"
                                                        value={formik.values.position}
                                                        onChange={formik.handleChange}
                                                        sx={{
                                                            borderRadius: '8px',
                                                            backgroundColor: '#f5f5f5',
                                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
                                                        }}
                                                    >
                                                        <MenuItem value="" disabled>Chọn chức danh</MenuItem>
                                                        <MenuItem value="Receptionist">Receptionist</MenuItem>
                                                        <MenuItem value="Trưởng phòng">Trưởng phòng</MenuItem>
                                                        <MenuItem value="Nhân viên">Nhân viên</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        borderRadius: '8px',
                                                        borderColor: '#e0e0e0',
                                                        minWidth: '40px',
                                                        padding: '0 8px'
                                                    }}
                                                >
                                                    +
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 'bold' }}>
                                                Tài khoản đăng nhập
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <FormControl fullWidth size="small">
                                                    <Select
                                                        displayEmpty
                                                        variant="outlined"
                                                        name="userId"
                                                        value={formik.values.userId}
                                                        onChange={(e) => {
                                                            console.log("Đã chọn tài khoản:", e.target.value);
                                                            formik.handleChange(e);
                                                        }}
                                                        disabled={false} // Cho phép chọn tài khoản
                                                        sx={{
                                                            borderRadius: '8px',
                                                            backgroundColor: '#f5f5f5',
                                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
                                                        }}
                                                    >
                                                        <MenuItem value="" disabled>Chọn tài khoản</MenuItem>
                                                        {accounts.map((account) => (
                                                            <MenuItem key={account.id} value={account.id}>
                                                                {account.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        borderRadius: '8px',
                                                        borderColor: '#e0e0e0',
                                                        minWidth: '40px',
                                                        padding: '0 8px'
                                                    }}
                                                >
                                                    +
                                                </Button>
                                            </Box>
                                            {accounts.length === 0 && (
                                                <Typography color="error" sx={{ fontSize: 12, mt: 1 }}>
                                                    Không có tài khoản nào để chọn.
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={12}>
                                    <Grid container spacing={1} alignItems="flex-start">
                                        <Grid size={2}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 'bold' }}>
                                                Ghi chú
                                            </Typography>
                                        </Grid>
                                        <Grid size={10}>
                                            <TextField
                                                multiline
                                                minRows={4}
                                                variant="outlined"
                                                placeholder=""
                                                name="note"
                                                value={formik.values.note}
                                                onChange={formik.handleChange}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EditIcon fontSize="small" sx={{ color: '#999' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    width: '100%',
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        backgroundColor: '#f5f5f5',
                                                        '& fieldset': { borderColor: '#e0e0e0' },
                                                        '&:hover fieldset': { borderColor: '#1976d2' },
                                                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', borderRadius: '10px', p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, mt: 1, color: '#333', fontSize: '16px' }}>
                                Thông tin cá nhân
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 'bold' }}>
                                                Số CMND/CCCD
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder="Nhập Số CMND/CCCD"
                                                size="small"
                                                variant="outlined"
                                                name="idCard"
                                                value={formik.values.idCard}
                                                onChange={formik.handleChange}
                                                sx={{
                                                    width: '100%',
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        backgroundColor: '#f5f5f5',
                                                        '& fieldset': { borderColor: '#e0e0e0' },
                                                        '&:hover fieldset': { borderColor: '#1976d2' },
                                                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 'bold' }}>
                                                Ngày sinh
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder="Nhập ngày sinh"
                                                size="small"
                                                variant="outlined"
                                                type="date"
                                                name="dob"
                                                value={formik.values.dob}
                                                onChange={formik.handleChange}
                                                sx={{
                                                    width: '100%',
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        backgroundColor: '#f5f5f5',
                                                        '& fieldset': { borderColor: '#e0e0e0' },
                                                        '&:hover fieldset': { borderColor: '#1976d2' },
                                                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} alignItems="center">
                                    <Grid size={2}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 0.5,
                                                color: '#555',
                                                whiteSpace: 'nowrap',
                                                fontSize: '14px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Giới tính
                                        </Typography>
                                    </Grid>
                                    <Grid size={10} sx={{ ml: 15 }}>
                                        <FormControl>
                                            <RadioGroup
                                                row
                                                name="gender"
                                                value={formik.values.gender}
                                                onChange={formik.handleChange}
                                                sx={{ columnGap: 4, ml:9 }}
                                            >
                                                <FormControlLabel value="MALE" control={<Radio size="small" />} label="Nam" />
                                                <FormControlLabel value="FEMALE" control={<Radio size="small" />} label="Nữ" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', borderRadius: '10px', p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, mt: 1, color: '#333', fontSize: '16px' }}>
                                Thông tin liên hệ
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 'bold' }}>
                                                Địa chỉ
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder=""
                                                size="small"
                                                variant="outlined"
                                                name="address"
                                                value={formik.values.address}
                                                onChange={formik.handleChange}
                                                sx={{
                                                    width: '100%',
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        backgroundColor: '#f5f5f5',
                                                        '& fieldset': { borderColor: '#e0e0e0' },
                                                        '&:hover fieldset': { borderColor: '#1976d2' },
                                                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 'bold' }}>
                                                Khu vực
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <FormControl fullWidth size="small">
                                                    <Select
                                                        displayEmpty
                                                        variant="outlined"
                                                        name="province"
                                                        value={formik.values.province}
                                                        onChange={formik.handleChange}
                                                        sx={{
                                                            borderRadius: '8px',
                                                            backgroundColor: '#f5f5f5',
                                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
                                                        }}
                                                    >
                                                        <MenuItem value="" disabled>Chọn Tỉnh/TP</MenuItem>
                                                        {provinces.map((province) => (
                                                            <MenuItem key={province.id} value={province.id}>
                                                                {province.full_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <FormControl fullWidth size="small">
                                                    <Select
                                                        displayEmpty
                                                        variant="outlined"
                                                        name="district"
                                                        value={formik.values.district}
                                                        onChange={formik.handleChange}
                                                        disabled={!formik.values.province}
                                                        sx={{
                                                            borderRadius: '8px',
                                                            backgroundColor: '#f5f5f5',
                                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
                                                        }}
                                                    >
                                                        <MenuItem value="" disabled>Chọn Quận/Huyện</MenuItem>
                                                        {districts.map((district) => (
                                                            <MenuItem key={district.id} value={district.id}>
                                                                {district.full_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 'bold' }}>
                                                Email
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <TextField
                                                placeholder=""
                                                size="small"
                                                variant="outlined"
                                                name="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                sx={{
                                                    width: '100%',
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        backgroundColor: '#f5f5f5',
                                                        '& fieldset': { borderColor: '#e0e0e0' },
                                                        '&:hover fieldset': { borderColor: '#1976d2' },
                                                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid size={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid size={4}>
                                            <Typography variant="body2" sx={{ mb: 0.5, color: '#555', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 'bold' }}>
                                                Phương thức
                                            </Typography>
                                        </Grid>
                                        <Grid size={8}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <FormControl fullWidth size="small">
                                                    <Select
                                                        displayEmpty
                                                        variant="outlined"
                                                        name="method"
                                                        value={formik.values.method}
                                                        onChange={formik.handleChange}
                                                        sx={{
                                                            borderRadius: '8px',
                                                            backgroundColor: '#f5f5f5',
                                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
                                                        }}
                                                    >
                                                        <MenuItem value="" disabled>Chọn Phương thức</MenuItem>
                                                        <MenuItem value="Facebook">Facebook</MenuItem>
                                                        <MenuItem value="Zalo">Zalo</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ position: 'sticky', bottom: 0, left: 0, backgroundColor: 'white', boxShadow: '0 -1px 3px rgba(0, 0, 0, 0.1)', zIndex: 1, p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ textTransform: 'none', mr: 1, borderRadius: '8px' }}
                    onClick={formik.handleSubmit}
                >
                    Cập nhật
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none', borderColor: '#e0e0e0', color: '#555', borderRadius: '8px' }}
                    onClick={handleClose}
                >
                    Bỏ qua
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditEmployeeDialog;