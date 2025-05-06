import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Button,
    CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import RoomViewService from '../../../service/admin/room.service';

// Validation schema using Yup
const validationSchema = Yup.object({
    roomCategoryId: Yup.number()
        .required('Hạng phòng là bắt buộc')
        .positive('Hạng phòng không hợp lệ')
        .integer('Hạng phòng không hợp lệ'),
    status: Yup.string()
        .required('Tình trạng là bắt buộc')
        .oneOf(
            ['AVAILABLE', 'UPCOMING', 'IN_USE', 'CHECKOUT_SOON', 'MAINTENANCE', 'OVERDUE'],
            'Tình trạng không hợp lệ'
        ),
    isClean: Yup.boolean().required('Trạng thái dọn dẹp là bắt buộc'),
    floor: Yup.number()
        .nullable()
        .positive('Tầng phải là số dương')
        .integer('Tầng phải là số nguyên')
        .max(100, 'Tầng không được vượt quá 100'),
    note: Yup.string().nullable().max(500, 'Ghi chú không được vượt quá 500 ký tự'),
    startDate: Yup.date().nullable().typeError('Ngày bắt đầu không hợp lệ'),
    checkInDuration: Yup.number()
        .nullable()
        .min(0, 'Thời gian check-in phải lớn hơn hoặc bằng 0')
        .integer('Thời gian check-in phải là số nguyên'),
    images: Yup.array()
        .of(
            Yup.mixed()
                .nullable() // Allow null values
                .test('fileSize', 'Kích thước ảnh không được vượt quá 5MB', (value) =>
                    !value || (value instanceof File && value.size <= 5 * 1024 * 1024)
                )
                .test('fileType', 'Chỉ hỗ trợ định dạng ảnh (jpg, jpeg, png)', (value) =>
                    !value || (value instanceof File && ['image/jpeg', 'image/png'].includes(value.type))
                )
                .test('isValidUrlOrFile', 'Phải là file ảnh hoặc URL hợp lệ', (value) =>
                    !value || value instanceof File || (typeof value === 'string' && value.trim().length > 0)
                )
        )
        .max(4, 'Tối đa 4 ảnh'),
});

function UpdateRoomDialog({ open, onClose, onSuccess, room }) {
    const [roomCategories, setRoomCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loading, setLoading] = useState(false);
    const [existingImages, setExistingImages] = useState([null, null, null, null]); // To store existing image URLs

    // Load room categories
    useEffect(() => {
        if (open) {
            const fetchRoomCategories = async () => {
                try {
                    setLoadingCategories(true);
                    const response = await RoomViewService.getRoomCategories();
                    setRoomCategories(response?.data || []);
                } catch (err) {
                    toast.error('Không thể tải danh sách hạng phòng');
                    setRoomCategories([]);
                } finally {
                    setLoadingCategories(false);
                }
            };
            fetchRoomCategories();
        }
    }, [open]);

    // Initialize existing images from room data
    useEffect(() => {
        if (room) {
            const images = [
                room.img1 || null,
                room.img2 || null,
                room.img3 || null,
                room.img4 || null,
            ];
            setExistingImages(images);
            // Initialize formik.values.images with existing image URLs
            formik.setFieldValue('images', images.map(img => img || null));
        }
    }, [room]);

    // Formik setup
    const formik = useFormik({
        initialValues: {
            roomCategoryId: room?.roomCategory?.id || '',
            status: room?.status || 'AVAILABLE',
            isClean: room?.isClean || false,
            floor: room?.floor || '',
            note: room?.note || '',
            startDate: room?.startDate ? new Date(room.startDate).toISOString().split('T')[0] : '',
            checkInDuration: room?.checkInDuration || 0,
            images: [null, null, null, null], // Will be overridden by useEffect
        },
        enableReinitialize: true, // Reinitialize form when room prop changes
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                // Prepare roomData
                const roomData = {
                    roomCategory: { id: values.roomCategoryId },
                    status: values.status,
                    isClean: values.isClean,
                    floor: values.floor || null,
                    note: values.note || null,
                    startDate: values.startDate || null,
                    checkInDuration: values.checkInDuration || 0,
                };

                // Prepare images - include existing images if no new image is uploaded
                const images = {};
                values.images.forEach((image, index) => {
                    const imgKey = `img${index + 1}`;
                    if (image instanceof File) {
                        images[imgKey] = image; // Send new image if uploaded
                    } else if (typeof image === 'string' && image) {
                        images[imgKey] = image; // Send existing image URL if no change
                    }
                });

                // Call API to update room
                await RoomViewService.updateRoom(room.id, roomData, images);
                toast.success('Cập nhật phòng thành công');
                formik.resetForm();
                setExistingImages([null, null, null, null]); // Reset existing images
                onSuccess();
                onClose();
            } catch (err) {
                let errorMessage = 'Không thể cập nhật phòng';
                if (err.response) {
                    if (err.response.status === 400) {
                        errorMessage =
                            err.response.data.message ||
                            'Dữ liệu không hợp lệ';
                        if (err.response.data.errors) {
                            errorMessage = Object.values(
                                err.response.data.errors
                            ).join(', ');
                        }
                    } else if (err.response.status === 403) {
                        errorMessage = 'Bạn không có quyền cập nhật phòng';
                    } else if (err.response.status === 404) {
                        errorMessage = 'Phòng không tồn tại';
                    } else {
                        errorMessage =
                            err.response.data.message || err.message;
                    }
                } else {
                    errorMessage = err.message;
                }
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        },
    });

    // Handle image change
    const handleImageChange = (index) => (event) => {
        const file = event.target.files[0];
        const newImages = [...formik.values.images];
        newImages[index] = file || null;
        formik.setFieldValue('images', newImages);

        // Update existing images (remove the existing image URL when a new file is selected)
        const newExistingImages = [...existingImages];
        newExistingImages[index] = null;
        setExistingImages(newExistingImages);
    };

    // Handle image removal
    const handleRemoveImage = (index) => () => {
        const newImages = [...formik.values.images];
        newImages[index] = null;
        formik.setFieldValue('images', newImages);

        const newExistingImages = [...existingImages];
        newExistingImages[index] = null;
        setExistingImages(newExistingImages);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                Cập nhật phòng
            </DialogTitle>
            <DialogContent dividers>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                fullWidth
                                margin="normal"
                                size="small"
                                error={
                                    formik.touched.roomCategoryId &&
                                    Boolean(formik.errors.roomCategoryId)
                                }
                            >
                                <InputLabel sx={{ fontSize: '0.875rem' }}>
                                    Hạng phòng
                                </InputLabel>
                                <Select
                                    name="roomCategoryId"
                                    value={formik.values.roomCategoryId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    label="Hạng phòng"
                                    disabled={loadingCategories}
                                    sx={{ fontSize: '0.875rem' }}
                                >
                                    <MenuItem
                                        value=""
                                        sx={{ fontSize: '0.875rem' }}
                                    >
                                        Chọn hạng phòng
                                    </MenuItem>
                                    {roomCategories.map((category) => (
                                        <MenuItem
                                            key={category.id}
                                            value={category.id}
                                            sx={{ fontSize: '0.875rem' }}
                                        >
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.touched.roomCategoryId &&
                                    formik.errors.roomCategoryId && (
                                        <Typography
                                            color="error"
                                            variant="caption"
                                            sx={{ mt: 0.5 }}
                                        >
                                            {formik.errors.roomCategoryId}
                                        </Typography>
                                    )}
                            </FormControl>
                            <TextField
                                label="Tầng"
                                name="floor"
                                value={formik.values.floor}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                fullWidth
                                variant="outlined"
                                size="small"
                                margin="normal"
                                type="number"
                                error={
                                    formik.touched.floor &&
                                    Boolean(formik.errors.floor)
                                }
                                helperText={
                                    formik.touched.floor && formik.errors.floor
                                }
                                sx={{ fontSize: '0.875rem' }}
                            />
                            <FormControl
                                fullWidth
                                margin="normal"
                                size="small"
                                error={
                                    formik.touched.status &&
                                    Boolean(formik.errors.status)
                                }
                            >
                                <InputLabel sx={{ fontSize: '0.875rem' }}>
                                    Tình trạng
                                </InputLabel>
                                <Select
                                    name="status"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    label="Tình trạng"
                                    sx={{ fontSize: '0.875rem' }}
                                >
                                    <MenuItem
                                        value="AVAILABLE"
                                        sx={{ fontSize: '0.875rem' }}
                                    >
                                        Trống
                                    </MenuItem>
                                    <MenuItem
                                        value="UPCOMING"
                                        sx={{ fontSize: '0.875rem' }}
                                    >
                                        Sắp tới
                                    </MenuItem>
                                    <MenuItem
                                        value="IN_USE"
                                        sx={{ fontSize: '0.875rem' }}
                                    >
                                        Đang sử dụng
                                    </MenuItem>
                                    <MenuItem
                                        value="CHECKOUT_SOON"
                                        sx={{ fontSize: '0.875rem' }}
                                    >
                                        Sắp trả phòng
                                    </MenuItem>
                                    <MenuItem
                                        value="MAINTENANCE"
                                        sx={{ fontSize: '0.875rem' }}
                                    >
                                        Bảo trì
                                    </MenuItem>
                                    <MenuItem
                                        value="OVERDUE"
                                        sx={{ fontSize: '0.875rem' }}
                                    >
                                        Quá hạn
                                    </MenuItem>
                                </Select>
                                {formik.touched.status &&
                                    formik.errors.status && (
                                        <Typography
                                            color="error"
                                            variant="caption"
                                            sx={{ mt: 0.5 }}
                                        >
                                            {formik.errors.status}
                                        </Typography>
                                    )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl
                                fullWidth
                                margin="normal"
                                size="small"
                                error={
                                    formik.touched.isClean &&
                                    Boolean(formik.errors.isClean)
                                }
                            >
                                <InputLabel sx={{ fontSize: '0.875rem' }}>
                                    Trạng thái dọn dẹp
                                </InputLabel>
                                <Select
                                    name="isClean"
                                    value={formik.values.isClean}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    label="Trạng thái dọn dẹp"
                                    sx={{ fontSize: '0.875rem' }}
                                >
                                    <MenuItem
                                        value={true}
                                        sx={{ fontSize: '0.875rem' }}
                                    >
                                        Đã dọn dẹp
                                    </MenuItem>
                                    <MenuItem
                                        value={false}
                                        sx={{ fontSize: '0.875rem' }}
                                    >
                                        Chưa dọn dẹp
                                    </MenuItem>
                                </Select>
                                {formik.touched.isClean &&
                                    formik.errors.isClean && (
                                        <Typography
                                            color="error"
                                            variant="caption"
                                            sx={{ mt: 0.5 }}
                                        >
                                            {formik.errors.isClean}
                                        </Typography>
                                    )}
                            </FormControl>
                            <TextField
                                label="Ghi chú"
                                name="note"
                                value={formik.values.note}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                fullWidth
                                variant="outlined"
                                size="small"
                                margin="normal"
                                multiline
                                rows={3}
                                error={
                                    formik.touched.note &&
                                    Boolean(formik.errors.note)
                                }
                                helperText={
                                    formik.touched.note && formik.errors.note
                                }
                                sx={{ fontSize: '0.875rem' }}
                            />
                            <TextField
                                label="Ngày bắt đầu"
                                name="startDate"
                                type="date"
                                value={formik.values.startDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                fullWidth
                                variant="outlined"
                                size="small"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                error={
                                    formik.touched.startDate &&
                                    Boolean(formik.errors.startDate)
                                }
                                helperText={
                                    formik.touched.startDate &&
                                    formik.errors.startDate
                                }
                                sx={{ fontSize: '0.875rem' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 2 }}>
                                <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                    sx={{ fontSize: '0.8rem' }}
                                >
                                    Ảnh phòng (tối đa 4 ảnh, định dạng JPG/PNG, tối đa 5MB mỗi ảnh)
                                </Typography>
                                <Grid container spacing={2}>
                                    {[...Array(4)].map((_, index) => (
                                        <Grid item xs={3} key={index}>
                                            <Box
                                                sx={{
                                                    border: '1px dashed #ccc',
                                                    borderRadius: '4px',
                                                    p: 1,
                                                    textAlign: 'center',
                                                    position: 'relative',
                                                }}
                                            >
                                                {existingImages[index] ? (
                                                    <>
                                                        <img
                                                            src={
                                                                existingImages[index].startsWith('http')
                                                                    ? existingImages[index]
                                                                    : `http://localhost:8080/${existingImages[index]}`
                                                            }
                                                            alt={`Existing ${index + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100px',
                                                                objectFit: 'cover',
                                                                borderRadius: '4px',
                                                            }}
                                                        />
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            onClick={handleRemoveImage(index)}
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                right: 0,
                                                                minWidth: 'auto',
                                                                p: 0.5,
                                                            }}
                                                        >
                                                            X
                                                        </Button>
                                                    </>
                                                ) : formik.values.images[index] ? (
                                                    <>
                                                        <img
                                                            src={URL.createObjectURL(formik.values.images[index])}
                                                            alt={`Preview ${index + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100px',
                                                                objectFit: 'cover',
                                                                borderRadius: '4px',
                                                            }}
                                                        />
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            onClick={handleRemoveImage(index)}
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                right: 0,
                                                                minWidth: 'auto',
                                                                p: 0.5,
                                                            }}
                                                        >
                                                            X
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        variant="outlined"
                                                        component="label"
                                                        fullWidth
                                                        sx={{ fontSize: '0.75rem' }}
                                                    >
                                                        Chọn ảnh {index + 1}
                                                        <input
                                                            type="file"
                                                            accept="image/jpeg,image/png"
                                                            hidden
                                                            onChange={handleImageChange(index)}
                                                        />
                                                    </Button>
                                                )}
                                            </Box>
                                            {formik.touched.images &&
                                                formik.errors.images &&
                                                formik.errors.images[index] && (
                                                    <Typography
                                                        color="error"
                                                        variant="caption"
                                                        sx={{ mt: 0.5 }}
                                                    >
                                                        {formik.errors.images[index]}
                                                    </Typography>
                                                )}
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        formik.resetForm();
                        setExistingImages([null, null, null, null]);
                        onClose();
                    }}
                    color="inherit"
                    disabled={loading}
                    sx={{ fontSize: '0.875rem' }}
                >
                    Hủy
                </Button>
                <Button
                    onClick={formik.handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{ fontSize: '0.875rem' }}
                >
                    {loading ? (
                        <CircularProgress size={20} />
                    ) : (
                        'Cập nhật'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UpdateRoomDialog;