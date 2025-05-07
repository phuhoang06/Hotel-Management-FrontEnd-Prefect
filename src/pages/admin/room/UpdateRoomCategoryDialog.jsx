import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Grid,
    FormHelperText,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import RoomViewService from '../../../service/admin/room.service';

const validationSchema = Yup.object({
    code: Yup.string()
        .required('Mã hạng phòng là bắt buộc')
        .max(20, 'Mã hạng phòng không được vượt quá 20 ký tự'),
    name: Yup.string()
        .required('Tên hạng phòng là bắt buộc')
        .max(100, 'Tên hạng phòng không được vượt quá 100 ký tự'),
    description: Yup.string().nullable(),
    hourlyPrice: Yup.number()
        .nullable()
        .min(0, 'Giá giờ phải lớn hơn hoặc bằng 0')
        .typeError('Giá giờ phải là số'),
    dailyPrice: Yup.number()
        .nullable()
        .min(0, 'Giá ngày phải lớn hơn hoặc bằng 0')
        .typeError('Giá ngày phải là số'),
    overnightPrice: Yup.number()
        .nullable()
        .min(0, 'Giá qua đêm phải lớn hơn hoặc bằng 0')
        .typeError('Giá qua đêm phải là số'),
    maxAdultCapacity: Yup.number()
        .nullable()
        .min(1, 'Sức chứa tối đa người lớn phải lớn hơn 0')
        .integer('Sức chứa phải là số nguyên')
        .typeError('Sức chứa phải là số'),
    maxChildCapacity: Yup.number()
        .nullable()
        .min(0, 'Sức chứa tối đa trẻ em phải lớn hơn hoặc bằng 0')
        .integer('Sức chứa phải là số nguyên')
        .typeError('Sức chứa phải là số'),
    standardAdultCapacity: Yup.number()
        .nullable()
        .min(1, 'Sức chứa tiêu chuẩn người lớn phải lớn hơn 0')
        .integer('Sức chứa phải là số nguyên')
        .typeError('Sức chứa phải là số'),
    standardChildCapacity: Yup.number()
        .nullable()
        .min(0, 'Sức chứa tiêu chuẩn trẻ em phải lớn hơn hoặc bằng 0')
        .integer('Sức chứa phải là số nguyên')
        .typeError('Sức chứa phải là số'),
    defaultExtraFee: Yup.number()
        .nullable()
        .min(0, 'Phụ phí mặc định phải lớn hơn hoặc bằng 0')
        .typeError('Phụ phí phải là số'),
    earlyCheckinFee: Yup.number()
        .nullable()
        .min(0, 'Phí check-in sớm phải lớn hơn hoặc bằng 0')
        .typeError('Phí check-in phải là số'),
    lateCheckoutFee: Yup.number()
        .nullable()
        .min(0, 'Phí checkout muộn phải lớn hơn hoặc bằng 0')
        .typeError('Phí checkout phải là số'),
    extraFeeType: Yup.string()
        .nullable()
        .oneOf(['FIXED', 'PERCENTAGE', null], 'Loại phụ phí không hợp lệ'),
    status: Yup.string()
        .required('Trạng thái là bắt buộc')
        .oneOf(['ACTIVE', 'INACTIVE'], 'Trạng thái không hợp lệ'),
    applyToAllCategories: Yup.boolean().nullable(),
    imgUrl: Yup.string().nullable(),
});

const UpdateRoomCategoryDialog = ({ open, onClose, onSuccess, category }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            code: '',
            name: '',
            description: '',
            hourlyPrice: '',
            dailyPrice: '',
            overnightPrice: '',
            maxAdultCapacity: '',
            maxChildCapacity: '',
            standardAdultCapacity: '',
            standardChildCapacity: '',
            defaultExtraFee: '',
            earlyCheckinFee: '',
            lateCheckoutFee: '',
            extraFeeType: '',
            status: 'ACTIVE',
            applyToAllCategories: false,
            imgUrl: '',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                const roomCategoryData = {
                    ...values,
                    hourlyPrice: values.hourlyPrice ? Number(values.hourlyPrice) : null,
                    dailyPrice: values.dailyPrice ? Number(values.dailyPrice) : null,
                    overnightPrice: values.overnightPrice ? Number(values.overnightPrice) : null,
                    maxAdultCapacity: values.maxAdultCapacity ? Number(values.maxAdultCapacity) : null,
                    maxChildCapacity: values.maxChildCapacity ? Number(values.maxChildCapacity) : null,
                    standardAdultCapacity: values.standardAdultCapacity ? Number(values.standardAdultCapacity) : null,
                    standardChildCapacity: values.standardChildCapacity ? Number(values.standardChildCapacity) : null,
                    defaultExtraFee: values.defaultExtraFee ? Number(values.defaultExtraFee) : null,
                    earlyCheckinFee: values.earlyCheckinFee ? Number(values.earlyCheckinFee) : null,
                    lateCheckoutFee: values.lateCheckoutFee ? Number(values.lateCheckoutFee) : null,
                    extraFeeType: values.extraFeeType || null,
                };

                const response = await RoomViewService.updateRoomCategory(category.id, roomCategoryData, imageFile);
                toast.success('Cập nhật hạng phòng thành công');
                onSuccess(response.data);
                onClose();
            } catch (error) {
                console.error('Lỗi khi cập nhật hạng phòng:', error);
                if (error.response?.status === 400 && error.response?.data?.errors) {
                    const apiErrors = error.response.data.errors;
                    const formattedErrors = {};
                    Object.keys(apiErrors).forEach((key) => {
                        formattedErrors[key] = apiErrors[key];
                    });
                    setErrors(formattedErrors);
                }
                toast.error(`Không thể cập nhật hạng phòng: ${error.response?.data?.message || error.message}`);
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        if (category) {
            formik.setValues({
                code: category.code || '',
                name: category.name || '',
                description: category.description || '',
                hourlyPrice: category.hourlyPrice || '',
                dailyPrice: category.dailyPrice || '',
                overnightPrice: category.overnightPrice || '',
                maxAdultCapacity: category.maxAdultCapacity || '',
                maxChildCapacity: category.maxChildCapacity || '',
                standardAdultCapacity: category.standardAdultCapacity || '',
                standardChildCapacity: category.standardChildCapacity || '',
                defaultExtraFee: category.defaultExtraFee || '',
                earlyCheckinFee: category.earlyCheckinFee || '',
                lateCheckoutFee: category.lateCheckoutFee || '',
                extraFeeType: category.extraFeeType || '',
                status: category.status || 'ACTIVE',
                applyToAllCategories: category.applyToAllCategories || false,
                imgUrl: category.imgUrl || '',
            });
            setImagePreview(category.imgUrl ? (category.imgUrl.startsWith('http') ? category.imgUrl : `http://localhost:8080/${category.imgUrl}`) : null);
            setImageFile(null);
        } else {
            setImagePreview(null);
            setImageFile(null);
        }
    }, [category]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                toast.error('Chỉ hỗ trợ định dạng JPEG hoặc PNG');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Kích thước tệp không được vượt quá 5MB');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClose = () => {
        setImagePreview(null);
        setImageFile(null);
        formik.resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontSize: '1.25rem' }}>Cập nhật hạng phòng</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Mã hạng phòng"
                                name="code"
                                value={formik.values.code}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.code && Boolean(formik.errors.code)}
                                helperText={formik.touched.code && formik.errors.code}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Tên hạng phòng"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Mô tả"
                                name="description"
                                multiline
                                rows={4}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Giá giờ (VNĐ)"
                                name="hourlyPrice"
                                type="number"
                                value={formik.values.hourlyPrice}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.hourlyPrice && Boolean(formik.errors.hourlyPrice)}
                                helperText={formik.touched.hourlyPrice && formik.errors.hourlyPrice}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Giá ngày (VNĐ)"
                                name="dailyPrice"
                                type="number"
                                value={formik.values.dailyPrice}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.dailyPrice && Boolean(formik.errors.dailyPrice)}
                                helperText={formik.touched.dailyPrice && formik.errors.dailyPrice}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Giá qua đêm (VNĐ)"
                                name="overnightPrice"
                                type="number"
                                value={formik.values.overnightPrice}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.overnightPrice && Boolean(formik.errors.overnightPrice)}
                                helperText={formik.touched.overnightPrice && formik.errors.overnightPrice}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Sức chứa tối đa người lớn"
                                name="maxAdultCapacity"
                                type="number"
                                value={formik.values.maxAdultCapacity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.maxAdultCapacity && Boolean(formik.errors.maxAdultCapacity)}
                                helperText={formik.touched.maxAdultCapacity && formik.errors.maxAdultCapacity}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Sức chứa tối đa trẻ em"
                                name="maxChildCapacity"
                                type="number"
                                value={formik.values.maxChildCapacity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.maxChildCapacity && Boolean(formik.errors.maxChildCapacity)}
                                helperText={formik.touched.maxChildCapacity && formik.errors.maxChildCapacity}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Sức chứa tiêu chuẩn người lớn"
                                name="standardAdultCapacity"
                                type="number"
                                value={formik.values.standardAdultCapacity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.standardAdultCapacity && Boolean(formik.errors.standardAdultCapacity)}
                                helperText={formik.touched.standardAdultCapacity && formik.errors.standardAdultCapacity}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Sức chứa tiêu chuẩn trẻ em"
                                name="standardChildCapacity"
                                type="number"
                                value={formik.values.standardChildCapacity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.standardChildCapacity && Boolean(formik.errors.standardChildCapacity)}
                                helperText={formik.touched.standardChildCapacity && formik.errors.standardChildCapacity}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Phụ phí mặc định (VNĐ)"
                                name="defaultExtraFee"
                                type="number"
                                value={formik.values.defaultExtraFee}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.defaultExtraFee && Boolean(formik.errors.defaultExtraFee)}
                                helperText={formik.touched.defaultExtraFee && formik.errors.defaultExtraFee}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Phí check-in sớm (VNĐ)"
                                name="earlyCheckinFee"
                                type="number"
                                value={formik.values.earlyCheckinFee}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.earlyCheckinFee && Boolean(formik.errors.earlyCheckinFee)}
                                helperText={formik.touched.earlyCheckinFee && formik.errors.earlyCheckinFee}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Phí checkout muộn (VNĐ)"
                                name="lateCheckoutFee"
                                type="number"
                                value={formik.values.lateCheckoutFee}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.lateCheckoutFee && Boolean(formik.errors.lateCheckoutFee)}
                                helperText={formik.touched.lateCheckoutFee && formik.errors.lateCheckoutFee}
                                size="small"
                                sx={{ mb: 2 }}
                            />
                            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                <InputLabel>Loại phụ phí</InputLabel>
                                <Select
                                    name="extraFeeType"
                                    value={formik.values.extraFeeType}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.extraFeeType && Boolean(formik.errors.extraFeeType)}
                                >
                                    <MenuItem value="">Không chọn</MenuItem>
                                    <MenuItem value="FIXED">Cố định</MenuItem>
                                    <MenuItem value="PERCENTAGE">Phần trăm</MenuItem>
                                </Select>
                                {formik.touched.extraFeeType && formik.errors.extraFeeType && (
                                    <FormHelperText error>{formik.errors.extraFeeType}</FormHelperText>
                                )}
                            </FormControl>
                            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    name="status"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.status && Boolean(formik.errors.status)}
                                >
                                    <MenuItem value="ACTIVE">Đang kinh doanh</MenuItem>
                                    <MenuItem value="INACTIVE">Ngừng kinh doanh</MenuItem>
                                </Select>
                                {formik.touched.status && formik.errors.status && (
                                    <FormHelperText error>{formik.errors.status}</FormHelperText>
                                )}
                            </FormControl>
                            <Box sx={{ mb: 2 }}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="image-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="image-upload">
                                    <Button variant="outlined" component="span" size="small">
                                        Chọn ảnh
                                    </Button>
                                </label>
                                {imagePreview && (
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="body2">Ảnh xem trước:</Typography>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit" size="small">
                    Hủy
                </Button>
                <Button
                    onClick={formik.handleSubmit}
                    color="primary"
                    variant="contained"
                    size="small"
                    disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateRoomCategoryDialog;