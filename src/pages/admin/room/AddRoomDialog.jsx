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
            ['AVAILABLE', 'MAINTENANCE'],
            'Tình trạng phải là "Trống" hoặc "Bảo trì"'
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
                .test('fileSize', 'Kích thước ảnh không được vượt quá 5MB', (value) =>
                    !value || value.size <= 5 * 1024 * 1024
                )
                .test('fileType', 'Chỉ hỗ trợ định dạng ảnh (jpg, jpeg, png)', (value) =>
                    !value || ['image/jpeg', 'image/png'].includes(value.type)
                )
        )
        .max(4, 'Tối đa 4 ảnh'),
});

function AddRoomDialog({ open, onClose, onSuccess }) {
    const [roomCategories, setRoomCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loading, setLoading] = useState(false);

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

    // Formik setup
    const formik = useFormik({
        initialValues: {
            roomCategoryId: '',
            status: 'AVAILABLE',
            isClean: true,
            floor: '',
            note: '',
            startDate: '',
            checkInDuration: 0,
            images: [null, null, null, null], // Array for 4 images
        },
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

                // Prepare images
                const images = {
                    img1: values.images[0],
                    img2: values.images[1],
                    img3: values.images[2],
                    img4: values.images[3],
                };

                // Call API
                await RoomViewService.addRoom(roomData, images);
                toast.success('Thêm phòng thành công');
                formik.resetForm();
                onSuccess();
                onClose();
            } catch (err) {
                let errorMessage = 'Không thể thêm phòng';
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
                        errorMessage = 'Bạn không có quyền thêm phòng';
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
    };

    // Handle image removal
    const handleRemoveImage = (index) => () => {
        const newImages = [...formik.values.images];
        newImages[index] = null;
        formik.setFieldValue('images', newImages);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                Thêm phòng mới
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
                                        value="MAINTENANCE"
                                        sx={{ fontSize: '0.875rem' }}
                                    >
                                        Bảo trì
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
                                    Tải ảnh phòng (tối đa 4 ảnh, định dạng JPG/PNG, tối đa 5MB mỗi ảnh)
                                </Typography>
                                <Grid container spacing={2}>
                                    {formik.values.images.map((image, index) => (
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
                                                {image ? (
                                                    <>
                                                        <img
                                                            src={URL.createObjectURL(
                                                                image
                                                            )}
                                                            alt={`Preview ${index + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100px',
                                                                objectFit:
                                                                    'cover',
                                                                borderRadius:
                                                                    '4px',
                                                            }}
                                                        />
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            onClick={handleRemoveImage(
                                                                index
                                                            )}
                                                            sx={{
                                                                position:
                                                                    'absolute',
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
                                                            onChange={handleImageChange(
                                                                index
                                                            )}
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
                                                        {formik.errors.images[
                                                            index
                                                            ]}
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
                        'Lưu'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddRoomDialog;