import React from 'react';
import {
    Box,
    Card,
    Typography,
    Grid,
    Menu,
    MenuItem
} from '@mui/material';
import {
    KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';

export default function BookingSummaryCard() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Dữ liệu đặt phòng
    const bookingData = [
        { title: 'Đặt phòng mới', value: '10 đặt phòng' },
        { title: 'Đặt phòng hủy', value: '0 đặt phòng' }
    ];

    return (
        <Card sx={{ p: 3, maxWidth: 400 , borderRadius: 3, boxShadow: 3  }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 , height: 20, width: 380}}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    ĐẶT PHÒNG HÔM NAY
                </Typography>

                <Box>
                    <Box
                        x={{
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

            {/* Booking Stats */}
            <Grid container spacing={4}>
                {bookingData.map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {item.title}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {item.value}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Card>
    );
}