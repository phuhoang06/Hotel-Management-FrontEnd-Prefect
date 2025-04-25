import React from 'react';
import {
    Box,
    Card,
    Typography,
    Menu,
    MenuItem,
    Avatar
} from '@mui/material';
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    Speed as SpeedIcon
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function RoomOccupancyCard() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Dữ liệu công suất phòng
    const occupancyRate = 36.98;

    // Dữ liệu cho biểu đồ
    const chartData = [
        { day: '20', rate: 1 },
        { day: '21', rate: 1 },
        { day: '22', rate: 1 },
        { day: '23', rate: 29 },
        { day: '24', rate: 29 },
        { day: '25', rate: 38 },
        { day: '26', rate: 25 },
        { day: '27', rate: 25 },
        { day: '28', rate: 25 },
        { day: '29', rate: 25 },
        { day: '30', rate: 25 }
    ];

    return (
        <Card sx={{  boxSizing: 'border-box', p: 3 , borderRadius: 3, boxShadow: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    CÔNG SUẤT SỬ DỤNG PHÒNG THÁNG NÀY
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
                            Tháng này
                        </Typography>
                        <KeyboardArrowDownIcon fontSize="small" />
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Tháng này</MenuItem>
                        <MenuItem onClick={handleClose}>Tháng trước</MenuItem>
                        <MenuItem onClick={handleClose}>3 tháng gần đây</MenuItem>
                        <MenuItem onClick={handleClose}>6 tháng gần đây</MenuItem>
                    </Menu>
                </Box>
            </Box>

            {/* Occupancy Rate */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <SpeedIcon />
                </Avatar>
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Trung bình
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {occupancyRate}%
                    </Typography>
                </Box>
            </Box>

            {/* Chart */}
            <Box sx={{ width: '100%', height: 180, p: 3 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 0,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={{ stroke: '#E0E0E0' }}
                        />
                        <YAxis
                            tickFormatter={(value) => `${value}%`}
                            domain={[0, 100]}
                            ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                            tickLine={false}
                            axisLine={{ stroke: '#E0E0E0' }}
                        />
                        <Tooltip
                            formatter={(value) => [`${value}%`, 'Công suất']}
                            labelFormatter={(label) => `Ngày ${label}`}
                        />
                        <Line
                            type="monotone"
                            dataKey="rate"
                            stroke="#1976D2"
                            activeDot={{ r: 8 }}
                            dot={{ r: 4 }}
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>

            {/* Legend */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: 'primary.main',
                            mr: 1,
                            borderRadius: '2px'
                        }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        Chỉ nhành trung tâm
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
}