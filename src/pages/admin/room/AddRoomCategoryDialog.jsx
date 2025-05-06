import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as React from "react";

function AddRoomCategoryDialog({ open, onClose }) {
    return(
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                Thêm hạng phòng mới
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Mã hạng phòng"
                            fullWidth
                            variant="outlined"
                            size="small"
                            margin="normal"
                            name="code"
                        />
                        <TextField
                            label="Tên hạng phòng"
                            fullWidth
                            variant="outlined"
                            size="small"
                            margin="normal"
                            name="name"
                        />
                        <TextField
                            label="Giá giờ"
                            fullWidth
                            variant="outlined"
                            size="small"
                            margin="normal"
                            type="number"
                            name="hourlyPrice"
                        />
                        <TextField
                            label="Giá ngày"
                            fullWidth
                            variant="outlined"
                            size="small"
                            margin="normal"
                            type="number"
                            name="dailyPrice"
                        />
                        <TextField
                            label="Giá qua đêm"
                            fullWidth
                            variant="outlined"
                            size="small"
                            margin="normal"
                            type="number"
                            name="overnightPrice"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Sức chứa người lớn (tối đa)"
                            fullWidth
                            variant="outlined"
                            size="small"
                            margin="normal"
                            type="number"
                            name="maxAdultCapacity"
                        />
                        <TextField
                            label="Sức chứa trẻ em (tối đa)"
                            fullWidth
                            variant="outlined"
                            size="small"
                            margin="normal"
                            type="number"
                            name="maxChildCapacity"
                        />
                        <TextField
                            label="Sức chứa người lớn (chuẩn)"
                            fullWidth
                            variant="outlined"
                            size="small"
                            margin="normal"
                            type="number"
                            name="standardAdultCapacity"
                        />
                        <TextField
                            label="Sức chứa trẻ em (chuẩn)"
                            fullWidth
                            variant="outlined"
                            size="small"
                            margin="normal"
                            type="number"
                            name="standardChildCapacity"
                        />
                        <TextField
                            label="Phí thuê giường"
                            fullWidth
                            variant="outlined"
                            size="small"
                            margin="normal"
                            type="number"
                            name="defaultExtraFee"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontSize: '0.8rem' }}>
                                Tải ảnh hạng phòng
                            </Typography>
                            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                                Chọn ảnh
                                <input type="file" hidden />
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="inherit" onClick={onClose}>
                    Hủy
                </Button>
                <Button variant="contained" color="primary">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddRoomCategoryDialog;