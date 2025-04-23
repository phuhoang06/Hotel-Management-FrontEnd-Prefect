import React from 'react';
import {
    Box,
    Card,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Grid,
    Avatar
} from '@mui/material';
import {
    Launch as LaunchIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';

export default function RevenueExpenseCard() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Giá trị doanh thu & chi phí
    const totalBalance = 423357000;
    const totalRevenue = 445685000;
    const totalExpense = 22328000;

    // Tính toán tỷ lệ cho biểu đồ
    const maxValue = Math.max(totalRevenue, totalExpense);
    const revenueBarHeight = 100; // Chiều cao cố định cho thanh cao nhất
    const expenseBarHeight = (totalExpense / maxValue) * revenueBarHeight;

    return (
        <Card sx={{ p: 3, maxWidth: 400, borderRadius: 3, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between' }}>
                {/* Left content */}
                <Box sx={{ flex: 1, pr: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>

                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        THU - CHI HÔM NAY
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

                {/* Balance */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 36, height: 36 }}>
                        <WalletIcon />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: 32 }}>
                        {totalBalance.toLocaleString()}
                    </Typography>
                </Box>

                {/* Revenue & Expense details */}
                <Grid container spacing={2} sx={{ mb: 1 }}>
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    mr: 1
                                }}
                            />
                            <Typography variant="body2">Tổng thu</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', ml: 3 }}>
                            {totalRevenue.toLocaleString()}
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: 'error.main',
                                    mr: 1
                                }}
                            />
                            <Typography variant="body2">Tổng chi</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', ml: 3 }}>
                            {totalExpense.toLocaleString()}
                        </Typography>
                    </Grid>
                </Grid>
                {/* Đóng Box bên trái */}
                </Box>
                {/* Chart bên phải */}
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', minWidth: 36, ml: 2 }}>
                    <Box
                        sx={{
                            width: 18,
                            height: `${revenueBarHeight}px`,
                            bgcolor: 'primary.main',
                            borderRadius: 1,
                            mr: 1
                        }}
                    />
                    <Box
                        sx={{
                            width: 18,
                            height: `${expenseBarHeight}px`,
                            bgcolor: 'error.main',
                            borderRadius: 1
                        }}
                    />
                </Box>
            {/* Đóng Box ngoài cùng */}
            </Box>
        </Card>
    );
}