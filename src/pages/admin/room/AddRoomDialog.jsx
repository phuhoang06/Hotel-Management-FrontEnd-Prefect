import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as React from "react";

function AddRoomDialog({ open, onClose }) {
    return(
        <>
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
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Mã phòng"
                                fullWidth
                                variant="outlined"
                                size="small"
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal" size="small">
                                <InputLabel>Hạng phòng</InputLabel>
                                <Select
                                    label="Hạng phòng"
                                >
                                    {/*{roomCategories.map((category) => (*/}
                                    {/*    <MenuItem key={category.id} value={category.id}>*/}
                                    {/*        {category.name}*/}
                                    {/*    </MenuItem>*/}
                                    {/*))}*/}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Tầng"
                                fullWidth
                                variant="outlined"
                                size="small"
                                margin="normal"
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal" size="small">
                                <InputLabel>Tình trạng</InputLabel>
                                <Select
                                    label="Tình trạng"
                                >
                                    <MenuItem value="AVAILABLE">Trống</MenuItem>
                                    <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal" size="small">
                                <InputLabel>Trạng thái dọn dẹp</InputLabel>
                                <Select
                                    label="Trạng thái dọn dẹp"
                                >
                                    <MenuItem value={true}>Đã dọn dẹp</MenuItem>
                                    <MenuItem value={false}>Chưa dọn dẹp</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Ghi chú"
                                fullWidth
                                variant="outlined"
                                size="small"
                                margin="normal"
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontSize: '0.8rem' }}>
                                    Tải ảnh phòng (tối đa 4 ảnh)
                                </Typography>
                                <Button variant="outlined" component="label" sx={{ mt: 1, mr: 1 }}>
                                    Ảnh 1
                                    <input type="file" hidden />
                                </Button>
                                <Button variant="outlined" component="label" sx={{ mt: 1, mr: 1 }}>
                                    Ảnh 2
                                    <input type="file" hidden />
                                </Button>
                                <Button variant="outlined" component="label" sx={{ mt: 1, mr: 1 }}>
                                    Ảnh 3
                                    <input type="file" hidden />
                                </Button>
                                <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                                    Ảnh 4
                                    <input type="file" hidden />
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button  color="inherit">
                        Hủy
                    </Button>
                    <Button  variant="contained" color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddRoomDialog;