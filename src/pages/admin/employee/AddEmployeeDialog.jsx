import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Tabs, Tab,
    Grid, Box, Typography, TextField, FormControl, Select, MenuItem, RadioGroup, FormControlLabel,
    Radio
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useFormik } from "formik";
import * as Yup from "yup";
import EmployeeService from "../../../service/admin/employee.service.js";
import { toast } from "react-toastify";

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

function AddEmployeeDialog({ open, onClose, isEditMode, employeeData, onAddSuccess }) {
    const [imagePreview, setImagePreview] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    // Ánh xạ thông điệp lỗi từ server sang tiếng Việt
    const errorMessages = {
        "ID Card already exists": "Số CMND/CCCD đã tồn tại",
        "User is already linked to another employee": "Tài khoản này đã được liên kết với nhân viên khác",
        "Validation Failed": "Xác thực thất bại",
    };

    // Fetch accounts for userId selection
    useEffect(() => {
        EmployeeService.getAllUsers().then(res => {
            setAccounts(res.data);
        }).catch(err => {
            toast.error("Không thể tải danh sách tài khoản.");
        });
    }, []);

    // Yup validation schema based on Java annotations
    const validationSchema = Yup.object({
        userId: Yup.number()
            .required("ID người dùng là bắt buộc"),
        fullName: Yup.string()
            .required("Họ và tên không được để trống")
            .max(100, "Họ và tên tối đa 100 ký tự"),
        gender: Yup.string()
            .required("Giới tính là bắt buộc")
            .oneOf(["MALE", "FEMALE"], "Giới tính không hợp lệ"),
        dob: Yup.date()
            .required("Ngày sinh là bắt buộc")
            .max(new Date(), "Ngày sinh phải nằm trong quá khứ")
            .typeError("Định dạng ngày không hợp lệ"),
        phone: Yup.string()
            .matches(/^[0-9]{10,15}$/, "Số điện thoại phải có 10–15 chữ số")
            .required("Số điện thoại là bắt buộc"),
        idCard: Yup.string()
            .matches(/^[A-Z0-9]{5,20}$/, "CMND/CCCD phải có 5–20 ký tự, chỉ gồm chữ cái và số")
            .required("CMND/CCCD là bắt buộc"),
        address: Yup.string()
            .max(255, "Địa chỉ tối đa 255 ký tự"),
        position: Yup.string()
            .max(100, "Chức danh tối đa 100 ký tự"),
        department: Yup.string()
            .max(100, "Phòng ban tối đa 100 ký tự"),
        startDate: Yup.date()
            .required("Ngày bắt đầu là bắt buộc")
            .max(new Date(), "Ngày bắt đầu không được nằm trong tương lai")
            .typeError("Định dạng ngày không hợp lệ"),
        note: Yup.string()
            .max(65535, "Ghi chú quá dài"),
        imgUrl: Yup.string()
            .max(255, "URL ảnh không được vượt quá 255 ký tự"),
    });

    // Formik setup
    const formik = useFormik({
        initialValues: {
            userId: employeeData?.userId || "",
            fullName: employeeData?.fullName || "",
            gender: employeeData?.gender || "",
            dob: employeeData?.dob || "",
            phone: employeeData?.phone || "",
            idCard: employeeData?.idCard || "",
            address: employeeData?.address || "",
            position: employeeData?.position || "",
            department: employeeData?.department || "",
            startDate: employeeData?.startDate || "",
            note: employeeData?.note || "",
            imgUrl: employeeData?.imgUrl || "",
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append('employee', JSON.stringify(values));
            if (imageFile) {
                formData.append('image', imageFile);
            }

            EmployeeService.addEmployeeWithImage(formData)
                .then(() => {
                    toast.success(isEditMode ? "Cập nhật nhân viên thành công" : "Thêm nhân viên thành công");
                    handleClose();
                    if (!isEditMode && onAddSuccess) {
                        onAddSuccess();
                    }
                })
                .catch((err) => {
                    if (err.response && err.response.status === 403) {
                        toast.error("Bạn không có quyền thực hiện hành động này!");
                    } else if (err.response && err.response.data && err.response.data.errors) {
                        // Xử lý lỗi validation từ server
                        const errors = err.response.data.errors;
                        Object.keys(errors).forEach((key) => {
                            const errorMessage = errors[key];
                            const displayMessage = errorMessages[errorMessage] || errorMessage;
                            // Hiển thị thông điệp lỗi từ server
                            toast.error(displayMessage);
                        });
                    } else {
                        // Hiển thị thông điệp lỗi chung nếu không có chi tiết lỗi
                        const serverMessage = err.response?.data?.message;
                        const displayMessage = errorMessages[serverMessage] || serverMessage || "Có lỗi xảy ra, vui lòng thử lại!";
                        toast.error(displayMessage);
                    }
                    console.error("Error adding employee:", err);
                });
        },
    });

    useEffect(() => {
        if (isEditMode && employeeData?.imgUrl) {
            setImagePreview(employeeData.imgUrl);
        } else {
            setImagePreview(null);
        }
    }, [isEditMode, employeeData]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
            formik.setFieldValue('imgUrl', imageUrl);
        }
    };

    const handleClose = () => {
        formik.resetForm();
        setImagePreview(null);
        setImageFile(null);
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
                        {isEditMode ? "Chỉnh sửa nhân viên" : "Thêm mới nhân viên"}
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
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                                                helperText={formik.touched.fullName && formik.errors.fullName}
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
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                                helperText={formik.touched.phone && formik.errors.phone}
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
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                                helperText={formik.touched.startDate && formik.errors.startDate}
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
                                                        onBlur={formik.handleBlur}
                                                        error={formik.touched.department && Boolean(formik.errors.department)}
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
                                                    {formik.touched.department && formik.errors.department && (
                                                        <Typography color="error" sx={{ fontSize: 12, mt: 1 }}>
                                                            {formik.errors.department}
                                                        </Typography>
                                                    )}
                                                </FormControl>
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
                                                        onBlur={formik.handleBlur}
                                                        error={formik.touched.position && Boolean(formik.errors.position)}
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
                                                    {formik.touched.position && formik.errors.position && (
                                                        <Typography color="error" sx={{ fontSize: 12, mt: 1 }}>
                                                            {formik.errors.position}
                                                        </Typography>
                                                    )}
                                                </FormControl>
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
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={formik.touched.userId && Boolean(formik.errors.userId)}
                                                        disabled={isEditMode}
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
                                                                {account.username}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {formik.touched.userId && formik.errors.userId && (
                                                        <Typography color="error" sx={{ fontSize: 12, mt: 1 }}>
                                                            {formik.errors.userId}
                                                        </Typography>
                                                    )}
                                                </FormControl>
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
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.note && Boolean(formik.errors.note)}
                                                helperText={formik.touched.note && formik.errors.note}
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
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.idCard && Boolean(formik.errors.idCard)}
                                                helperText={formik.touched.idCard && formik.errors.idCard}
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
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.dob && Boolean(formik.errors.dob)}
                                                helperText={formik.touched.dob && formik.errors.dob}
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
                                                onBlur={formik.handleBlur}
                                                sx={{ columnGap: 4, ml: 9 }}
                                            >
                                                <FormControlLabel value="MALE" control={<Radio size="small" />} label="Nam" />
                                                <FormControlLabel value="FEMALE" control={<Radio size="small" />} label="Nữ" />
                                            </RadioGroup>
                                            {formik.touched.gender && formik.errors.gender && (
                                                <Typography color="error" sx={{ fontSize: 12, mt: 1, ml: 9 }}>
                                                    {formik.errors.gender}
                                                </Typography>
                                            )}
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
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.address && Boolean(formik.errors.address)}
                                                helperText={formik.touched.address && formik.errors.address}
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
                    {isEditMode ? "Cập nhật" : "Lưu"}
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

export default AddEmployeeDialog;