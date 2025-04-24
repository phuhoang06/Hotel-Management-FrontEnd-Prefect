import React from 'react';
import {
    Box,
    Card,
    Typography,
    Paper,
    Grid,   
    Avatar,
    Stack,
    Divider,
    IconButton,
    MenuItem,
    Menu
} from '@mui/material';
import {
    Launch as LaunchIcon,
    CreditCard as CreditCardIcon,
    Archive as ArchiveIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';

export default function RevenueDashboard() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, width: 600, height:12 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                        DOANH THU HÔM NAY
                    </Typography>
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                        <LaunchIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: 'primary.main'
                        }}
                        onClick={handleClick}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Hôm nay
                        </Typography>
                        <KeyboardArrowDownIcon fontSize="small" />
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Hôm nay</MenuItem>
                        <MenuItem onClick={handleClose}>Hôm qua</MenuItem>
                        <MenuItem onClick={handleClose}>7 ngày qua</MenuItem>
                        <MenuItem onClick={handleClose}>30 ngày qua</MenuItem>
                    </Menu>
                </Box>
            </Box>

            <Grid container spacing={4}>
                {/* Tổng doanh thu */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                            <CreditCardIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Tổng
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                445,685,000
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ pl: 5 }}>
                        <Typography variant="body2" color="text.secondary">
                            Trung bình
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 0.5 }}>
                                0
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                /phòng/ngày
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Hóa đơn */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                            <ArchiveIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Hóa đơn
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                                10
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Card>
    );
}