import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import React from "react";

function EmployeePanel(){
    return(
        <>
            <Grid size={{xs: 4, md: 2.4}}>
                <Box sx={{mt: 2}}>
                    <Typography variant="h6" sx={{ml: 2, mb: 0.5, fontWeight: 'bold'}}>Danh sách nhân viên</Typography>
                    <Typography color="textSecondary" sx={{fontSize: 13, ml: 2, mb: 1}}>Đã sử dụng nhân
                        viên</Typography>
                </Box>

                <Box sx={{marginLeft: 1, p: 1, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3, boxShadow: 1}}>
                    <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 'bold', fontSize: 13}}>Trạng thái nhân
                        viên</Typography>
                    <Box sx={{display: 'flex', flexDirection: 'column', fontSize: 13}}>
                        <FormControlLabel control={<Checkbox defaultChecked size="small"/>}
                                          label={<Typography sx={{fontSize: 13}}>Đang làm việc</Typography>}/>
                        <FormControlLabel control={<Checkbox size="small"/>}
                                          label={<Typography sx={{fontSize: 13}}>Đã nghỉ</Typography>}/>
                    </Box>
                </Box>

                <Box sx={{
                    marginLeft: 1,
                    p: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    mb: 3,
                    boxShadow: 1,
                    backgroundColor: '#ffffff'
                }}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1}}>
                        <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 'bold', fontSize: 13}}>Phòng
                            ban</Typography>
                        <Box>
                            <IconButton size="small" sx={{mr: 0.5}}><AddIcon fontSize="small"/></IconButton>
                            <IconButton size="small"><ExpandLessIcon fontSize="small"/></IconButton>
                        </Box>
                    </Box>
                    <FormControl fullWidth size="small">
                        <Select displayEmpty defaultValue=""
                                sx={{borderRadius: 1, height: 32, ml: 1, mr: 1, mb: 2, backgroundColor: '#ffffff'}}>
                            <MenuItem value="" disabled>Chọn phòng ban</MenuItem>
                            <MenuItem value="Phòng PV">Phòng PV</MenuItem>
                            <MenuItem value="Phòng AI">Phòng AI</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{
                    marginLeft: 1,
                    p: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    mb: 3,
                    boxShadow: 1,
                    backgroundColor: '#ffffff'
                }}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1}}>
                        <Typography variant="subtitle2" sx={{mt: 1, ml: 1, mb: 1, fontWeight: 'bold', fontSize: 13}}>Chức
                            danh</Typography>
                        <Box>
                            <IconButton size="small" sx={{mr: 0.5}}><AddIcon fontSize="small"/></IconButton>
                            <IconButton size="small"><ExpandLessIcon fontSize="small"/></IconButton>
                        </Box>
                    </Box>
                    <FormControl fullWidth size="small">
                        <Select displayEmpty defaultValue=""
                                sx={{borderRadius: 1, height: 32, ml: 1, mr: 1, mb: 2, backgroundColor: '#ffffff'}}>
                            <MenuItem value="" disabled>Chọn chức danh</MenuItem>
                            <MenuItem value="Trưởng phòng">Trưởng phòng</MenuItem>
                            <MenuItem value="Nhân viên">Nhân viên</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{
                    ml: 1,
                    p: 1.5,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    boxShadow: 1,
                    backgroundColor: '#ffffff',
                    mb: 1
                }}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant="subtitle2" sx={{mb: 3, fontWeight: 'bold', fontSize: 13, height: 40}}>Số
                            bản ghi:</Typography>
                        <FormControl size="small" sx={{width: 80, height: 24}}>
                            <Select
                                    sx={{borderRadius: 1, height: 28}}>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Grid>
        </>
    )
}
export default EmployeePanel;