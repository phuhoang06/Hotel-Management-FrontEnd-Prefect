import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import RoomViewService from "../../../service/admin/room.service";
import { toast } from "react-toastify";

// Validation schema using Yup
const validationSchema = Yup.object({
    code: Yup.string()
        .required("Mã hạng phòng là bắt buộc")
        .max(20, "Mã hạng phòng không được vượt quá 20 ký tự")
        .matches(/^[A-Z0-9]+$/, "Mã hạng phòng chỉ chứa chữ cái in hoa và số"),
    name: Yup.string()
        .required("Tên hạng phòng là bắt buộc")
        .max(100, "Tên hạng phòng không được vượt quá 100 ký tự"),
    hourlyPrice: Yup.number()
        .required("Giá giờ là bắt buộc")
        .positive("Giá giờ phải lớn hơn 0")
        .max(99999999.99, "Giá giờ quá lớn"),
    dailyPrice: Yup.number()
        .required("Giá ngày là bắt buộc")
        .positive("Giá ngày phải lớn hơn 0")
        .max(99999999.99, "Giá ngày quá lớn"),
    overnightPrice: Yup.number()
        .required("Giá qua đêm là bắt buộc")
        .positive("Giá qua đêm phải lớn hơn 0")
        .max(99999999.99, "Giá qua đêm quá lớn"),
    maxAdultCapacity: Yup.number()
        .required("Sức chứa người lớn tối đa là bắt buộc")
        .positive("Sức chứa người lớn tối đa phải lớn hơn 0")
        .integer("Sức chứa người lớn tối đa phải là số nguyên"),
    maxChildCapacity: Yup.number()
        .required("Sức chứa trẻ em tối đa là bắt buộc")
        .min(0, "Sức chứa trẻ em tối đa không được âm")
        .integer("Sức chứa trẻ em tối đa phải là số nguyên"),
    standardAdultCapacity: Yup.number()
        .required("Sức chứa người lớn chuẩn là bắt buộc")
        .positive("Sức chứa người lớn chuẩn phải lớn hơn 0")
        .integer("Sức chứa người lớn chuẩn phải là số nguyên")
        .when("maxAdultCapacity", (maxAdultCapacity, schema) =>
            schema.max(maxAdultCapacity, "Sức chứa người lớn chuẩn không được vượt quá sức chứa tối đa")
        ),
    standardChildCapacity: Yup.number()
        .required("Sức chứa trẻ em chuẩn là bắt buộc")
        .min(0, "Sức chứa trẻ em chuẩn không được âm")
        .integer("Sức chứa trẻ em chuẩn phải là số nguyên")
        .when("maxChildCapacity", (maxChildCapacity, schema) =>
            schema.max(maxChildCapacity, "Sức chứa trẻ em chuẩn không được vượt quá sức chứa tối đa")
        ),
    defaultExtraFee: Yup.number()
        .required("phụ phí khác là bắt buộc")
        .positive("phụ phí khác phải lớn hơn 0")
        .max(99999999.99, "phụ phí khác quá lớn"),
    earlyCheckinFee: Yup.number()
        .required("Phí check-in sớm là bắt buộc")
        .positive("Phí check-in sớm phải lớn hơn 0")
        .max(99999999.99, "Phí check-in sớm quá lớn"),
    lateCheckoutFee: Yup.number()
        .required("Phí checkout muộn là bắt buộc")
        .positive("Phí checkout muộn phải lớn hơn 0")
        .max(99999999.99, "Phí checkout muộn quá lớn"),
    extraFeeType: Yup.string()
        .required("Loại phí bổ sung là bắt buộc")
        .oneOf(["FIXED", "PERCENTAGE"], "Loại phí bổ sung không hợp lệ"),
    description: Yup.string()
        .max(1000, "Mô tả không được vượt quá 1000 ký tự")
        .nullable(),
    status: Yup.string()
        .required("Trạng thái là bắt buộc")
        .oneOf(["ACTIVE", "INACTIVE"], "Trạng thái không hợp lệ"),
    image: Yup.mixed()
        .nullable()
        .test("fileSize", "Tệp quá lớn (tối đa 5MB)", (value) => !value || value.size <= 5 * 1024 * 1024)
        .test("fileType", "Chỉ hỗ trợ định dạng JPG, PNG", (value) => !value || ["image/jpeg", "image/png"].includes(value.type)),
});

function AddRoomCategoryDialog({ open, onClose }) {
    const initialValues = {
        code: "",
        name: "",
        hourlyPrice: "",
        dailyPrice: "",
        overnightPrice: "",
        maxAdultCapacity: "",
        maxChildCapacity: "",
        standardAdultCapacity: "",
        standardChildCapacity: "",
        defaultExtraFee: "",
        earlyCheckinFee: "",
        lateCheckoutFee: "",
        extraFeeType: "FIXED",
        description: "",
        status: "ACTIVE",
        image: null,
    };

    const fileInputRef = useRef(null);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const roomCategoryData = {
                code: values.code,
                name: values.name,
                hourlyPrice: parseFloat(values.hourlyPrice),
                dailyPrice: parseFloat(values.dailyPrice),
                overnightPrice: parseFloat(values.overnightPrice),
                maxAdultCapacity: parseInt(values.maxAdultCapacity),
                maxChildCapacity: parseInt(values.maxChildCapacity),
                standardAdultCapacity: parseInt(values.standardAdultCapacity),
                standardChildCapacity: parseInt(values.standardChildCapacity),
                defaultExtraFee: parseFloat(values.defaultExtraFee),
                earlyCheckinFee: parseFloat(values.earlyCheckinFee),
                lateCheckoutFee: parseFloat(values.lateCheckoutFee),
                extraFeeType: values.extraFeeType,
                description: values.description || null,
                status: values.status,
            };

            await RoomViewService.addRoomCategory(roomCategoryData, values.image);
            toast.success("Thêm hạng phòng thành công");
            resetForm();
            fileInputRef.current.value = null; // Reset file input
            onClose();
        } catch (error) {
            console.error("Lỗi khi thêm hạng phòng:", error);
            toast.error(error.message || "Không thể thêm hạng phòng");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ fontSize: "1rem", fontWeight: "bold" }}>
                Thêm hạng phòng mới
            </DialogTitle>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, setFieldValue, isSubmitting, values }) => (
                    <Form>
                        <DialogContent dividers>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        name="code"
                                        as={TextField}
                                        label="Mã hạng phòng"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        margin="normal"
                                        error={touched.code && !!errors.code}
                                        helperText={touched.code && errors.code}
                                    />
                                    <Field
                                        name="name"
                                        as={TextField}
                                        label="Tên hạng phòng"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        margin="normal"
                                        error={touched.name && !!errors.name}
                                        helperText={touched.name && errors.name}
                                    />
                                    <Field
                                        name="hourlyPrice"
                                        as={TextField}
                                        label="Giá giờ"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        margin="normal"
                                        error={touched.hourlyPrice && !!errors.hourlyPrice}
                                        helperText={touched.hourlyPrice && errors.hourlyPrice}
                                    />
                                    <Field
                                        name="dailyPrice"
                                        as={TextField}
                                        label="Giá ngày"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        margin="normal"
                                        error={touched.dailyPrice && !!errors.dailyPrice}
                                        helperText={touched.dailyPrice && errors.dailyPrice}
                                    />
                                    <Field
                                        name="overnightPrice"
                                        as={TextField}
                                        label="Giá qua đêm"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        margin="normal"
                                        error={touched.overnightPrice && !!errors.overnightPrice}
                                        helperText={touched.overnightPrice && errors.overnightPrice}
                                    />
                                    <Field
                                        name="defaultExtraFee"
                                        as={TextField}
                                        label="phụ phí khác"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        margin="normal"
                                        error={touched.defaultExtraFee && !!errors.defaultExtraFee}
                                        helperText={touched.defaultExtraFee && errors.defaultExtraFee}
                                    />
                                    <Field
                                        name="earlyCheckinFee"
                                        as={TextField}
                                        label="Phí check-in sớm"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        margin="normal"
                                        error={touched.earlyCheckinFee && !!errors.earlyCheckinFee}
                                        helperText={touched.earlyCheckinFee && errors.earlyCheckinFee}
                                    />
                                    <Field
                                        name="lateCheckoutFee"
                                        as={TextField}
                                        label="Phí checkout muộn"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        margin="normal"
                                        error={touched.lateCheckoutFee && !!errors.lateCheckoutFee}
                                        helperText={touched.lateCheckoutFee && errors.lateCheckoutFee}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        name="maxAdultCapacity"
                                        as={TextField}
                                        label="Sức chứa người lớn (tối đa)"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        margin="normal"
                                        error={touched.maxAdultCapacity && !!errors.maxAdultCapacity}
                                        helperText={touched.maxAdultCapacity && errors.maxAdultCapacity}
                                    />
                                    <Field
                                        name="maxChildCapacity"
                                        as={TextField}
                                        label="Sức chứa trẻ em (tối đa)"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        margin="normal"
                                        error={touched.maxChildCapacity && !!errors.maxChildCapacity}
                                        helperText={touched.maxChildCapacity && errors.maxChildCapacity}
                                    />
                                    <Field
                                        name="standardAdultCapacity"
                                        as={TextField}
                                        label="Sức chứa người lớn (chuẩn)"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        margin="normal"
                                        error={touched.standardAdultCapacity && !!errors.standardAdultCapacity}
                                        helperText={touched.standardAdultCapacity && errors.standardAdultCapacity}
                                    />
                                    <Field
                                        name="standardChildCapacity"
                                        as={TextField}
                                        label="Sức chứa trẻ em (chuẩn)"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        margin="normal"
                                        error={touched.standardChildCapacity && !!errors.standardChildCapacity}
                                        helperText={touched.standardChildCapacity && errors.standardChildCapacity}
                                    />
                                    <FormControl fullWidth size="small" margin="normal" error={touched.extraFeeType && !!errors.extraFeeType}>
                                        <InputLabel>Loại phí bổ sung</InputLabel>
                                        <Field
                                            name="extraFeeType"
                                            as={Select}
                                            label="Loại phí bổ sung"
                                        >
                                            <MenuItem value="FIXED">Cố định</MenuItem>
                                            <MenuItem value="PERCENTAGE">Phần trăm</MenuItem>
                                        </Field>
                                        {touched.extraFeeType && errors.extraFeeType && (
                                            <Typography color="error" variant="caption">
                                                {errors.extraFeeType}
                                            </Typography>
                                        )}
                                    </FormControl>
                                    <FormControl fullWidth size="small" margin="normal" error={touched.status && !!errors.status}>
                                        <InputLabel>Trạng thái</InputLabel>
                                        <Field
                                            name="status"
                                            as={Select}
                                            label="Trạng thái"
                                        >
                                            <MenuItem value="ACTIVE">Đang kinh doanh</MenuItem>
                                            <MenuItem value="INACTIVE">Ngừng kinh doanh</MenuItem>
                                        </Field>
                                        {touched.status && errors.status && (
                                            <Typography color="error" variant="caption">
                                                {errors.status}
                                            </Typography>
                                        )}
                                    </FormControl>
                                    <Field
                                        name="description"
                                        as={TextField}
                                        label="Mô tả"
                                        multiline
                                        rows={3}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        margin="normal"
                                        error={touched.description && !!errors.description}
                                        helperText={touched.description && errors.description}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle1" gutterBottom sx={{ fontSize: "0.8rem" }}>
                                            Tải ảnh hạng phòng
                                        </Typography>
                                        <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                                            Chọn ảnh
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/jpeg,image/png"
                                                ref={fileInputRef}
                                                onChange={(event) => {
                                                    const file = event.target.files[0];
                                                    setFieldValue("image", file);
                                                }}
                                            />
                                        </Button>
                                        {touched.image && errors.image && (
                                            <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
                                                {errors.image}
                                            </Typography>
                                        )}
                                        {values.image && (
                                            <Typography variant="body2" sx={{ mt: 1, fontSize: "0.7rem" }}>
                                                Tệp đã chọn: {values.image.name}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button color="inherit" onClick={onClose} disabled={isSubmitting}>
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                            >
                                Lưu
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
}

export default AddRoomCategoryDialog;