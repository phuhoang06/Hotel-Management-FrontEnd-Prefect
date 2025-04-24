import React from 'react';
import {
    Box,
    Card,
    Typography,
    Divider,
    Grid,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import {
    KeyboardArrowRight as ArrowRightIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';

export default function ReceptionActivityCard() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Dữ liệu hoạt động
    const activityData = [
        { title: 'Đã nhận', value: '1/1 phòng' },
        { title: 'Đã trả', value: '0/1 phòng' },
        { title: 'Có khách', value: '3 phòng' },
        { title: 'Quá dự kiến', value: '0 phòng' }
    ];

    return (
        <Card sx={{ p: 3,  borderRadius: 3, boxShadow: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, width: 600, height:12 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    HOẠT ĐỘNG LỄ TÂN HÔM NAY
                </Typography>

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

            {/* Activity Stats */}
            <Grid container spacing={2}>
                {activityData.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Box sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 0.5 }}>
                                <Typography variant="body2">
                                    {item.title}
                                </Typography>
                                <ArrowRightIcon fontSize="small" />
                            </Box>
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