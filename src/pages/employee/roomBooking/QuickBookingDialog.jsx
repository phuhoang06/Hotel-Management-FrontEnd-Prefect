import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    IconButton,
    TextField,
    InputAdornment,
    Tabs,
    Tab,
    Grid,
    Button,
    Select,
    MenuItem,
    FormControl,
    Divider,
    Avatar,
    Badge,
    OutlinedInput,
    Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import WalkingIcon from '@mui/icons-material/DirectionsWalk';

// Quick Booking Dialog Component
const QuickBookingDialog = ({ open, onClose }) => {
    const [activeTab, setActiveTab] = useState('hienTai');

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2 }}>
                <Typography variant="h6">Đặt/Nhận phòng nhanh</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 3 }}>
                {/* Search and guest info section */}
                <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                    <TextField
                        placeholder="Nhập mã, Tên, SĐT khách hàng"
                        sx={{ flexGrow: 1 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton>
                                        <PeopleAltOutlinedIcon />
                                    </IconButton>
                                    <IconButton>
                                        <AccessTimeIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #e0e0e0', borderRadius: 1, px: 2 }}>
                        <Avatar sx={{ bgcolor: '#e0e0e0', width: 24, height: 24 }}>
                            <PersonOutlineIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2">1</Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        <InventoryOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2">0</Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        <Badge badgeContent={0} color="primary">
                            <InventoryOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </Badge>
                        <Typography variant="body2">0</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton>
                            <WalkingIcon />
                        </IconButton>
                        <Typography variant="body2" sx={{ mr: 2 }}>Mã kênh bán</Typography>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select
                                value="bangGiaChung"
                                displayEmpty
                            >
                                <MenuItem value="bangGiaChung">Bảng giá chung</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* Booking tabs section */}
                <Box sx={{ width: '100%', mb: 2 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={activeTab} onChange={handleTabChange}>
                            <Tab label="Hạng phòng" value="hangPhong" />
                            <Tab label="Phòng" value="phong" />
                            <Tab label="Hình thức" value="hinhThuc" />
                            <Tab label="Nhận" value="nhan" />
                            <Box sx={{ display: 'flex', gap: 1, ml: 2, mt: 1 }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    sx={{
                                        borderRadius: 4,
                                        bgcolor: activeTab === 'hienTai' ? 'primary.main' : 'transparent',
                                        color: activeTab === 'hienTai' ? 'white' : 'primary.main',
                                        '&:hover': {
                                            bgcolor: activeTab === 'hienTai' ? 'primary.dark' : 'rgba(25, 118, 210, 0.04)'
                                        }
                                    }}
                                    onClick={(e) => handleTabChange(e, 'hienTai')}
                                >
                                    Hiện tại
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    size="small"
                                    sx={{
                                        borderRadius: 4,
                                        bgcolor: activeTab === 'quyDinh' ? 'success.main' : 'transparent',
                                        color: activeTab === 'quyDinh' ? 'white' : 'success.main',
                                        '&:hover': {
                                            bgcolor: activeTab === 'quyDinh' ? 'success.dark' : 'rgba(46, 125, 50, 0.04)'
                                        }
                                    }}
                                    onClick={(e) => handleTabChange(e, 'quyDinh')}
                                >
                                    Quy định
                                </Button>
                            </Box>
                            <Tab label="Trả phòng" value="traPhong" sx={{ ml: 'auto' }} />
                            <Tab
                                label="Dự kiến"
                                value="duKien"
                                icon={<HelpOutlineIcon fontSize="small" />}
                                iconPosition="end"
                            />
                            <Tab
                                label="Thành tiền"
                                value="thanhTien"
                                icon={<HelpOutlineIcon fontSize="small" />}
                                iconPosition="end"
                            />
                        </Tabs>
                    </Box>
                </Box>

                {/* Room booking information */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={3}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Phòng 01 giường đôi cho 2 người</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl fullWidth size="small">
                            <Select defaultValue="p201">
                                <MenuItem value="p201">P.201</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={1}>
                        <FormControl fullWidth size="small">
                            <Select defaultValue="hour">
                                <MenuItem value="hour">Giờ</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <OutlinedInput
                            size="small"
                            fullWidth
                            value="26 Thg 04, 10:03"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton size="small">
                                        <CalendarTodayIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small">
                                        <AccessTimeIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <OutlinedInput
                            size="small"
                            fullWidth
                            value="26 Thg 04, 11:03"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton size="small">
                                        <CalendarTodayIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small">
                                        <AccessTimeIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Typography variant="body1" sx={{ pt: 1 }}>1 giờ</Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ pt: 1 }}>180,000</Typography>
                            <IconButton size="small">
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>

                {/* Action buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Chọn thêm phòng
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ShoppingCartIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Sản phẩm, dịch vụ
                    </Button>
                </Box>

                {/* Notes section */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>Ghi chú</Typography>
                    <TextField
                        fullWidth
                        placeholder="Nhập ghi chú..."
                        size="small"
                        multiline
                        rows={1}
                    />
                </Box>

                {/* Payment details */}
                <Paper sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1">Khách cần trả</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>180,000</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1">Khách thanh toán</Typography>
                            <LocalOfferIcon sx={{ ml: 1, fontSize: 18, color: 'success.main' }} />
                        </Box>
                        <Typography variant="body1">0</Typography>
                    </Box>
                </Paper>

                {/* Bottom action buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    <Button variant="text" sx={{ textTransform: 'none' }}>
                        Thêm tùy chọn
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ textTransform: 'none' }}
                    >
                        Nhận phòng
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        sx={{ textTransform: 'none', bgcolor: '#ff9800' }}
                    >
                        Đặt trước
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default QuickBookingDialog;