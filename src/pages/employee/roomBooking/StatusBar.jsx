import React from 'react';
import { Box, Typography } from '@mui/material';

export function StatusBar({ statusCounts, variant, onStatusFilter, totalRooms, activeFilter }) {
    const statusItems = [
        { label: 'Tất cả', key: 'all', color: '#757575', apiStatus: 'ALL', filterable: true },
        { label: 'Sắp nhận', key: 'soonCheckIn', color: '#FF9800', apiStatus: 'UPCOMING', filterable: true },
        { label: 'Đang sử dụng', key: 'inUse', color: '#4CAF50', apiStatus: 'IN_USE', filterable: true },
        { label: 'Sắp trả', key: 'soonCheckOut', color: '#0288D1', apiStatus: 'CHECKOUT_SOON', filterable: true },
        { label: 'Quá giờ trả', key: 'overdue', color: '#00ACC1', apiStatus: 'OVERDUE', filterable: true },
        { label: 'Đang trống', key: 'available', color: '#B0BEC5', apiStatus: 'AVAILABLE', filterable: true },
        { label: 'Bảo trì', key: 'maintenance', color: '#E53935', apiStatus: 'MAINTENANCE', filterable: true },
    ];

    return (
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {statusItems.map((item) => (
                <Box
                    key={item.key}
                    onClick={() => item.filterable && onStatusFilter(item.apiStatus)}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        backgroundColor: activeFilter === item.apiStatus ? '#FF9800' : '#FFFFFF',
                        p: 1,
                        borderRadius: 30,
                        border: variant === 'schematic' ? 'none' : '1px solid #e0e0e0',
                        cursor: item.filterable ? 'pointer' : 'default',
                        '&:hover': item.filterable ? { backgroundColor: activeFilter === item.apiStatus ? '#FF9800' : '#f0f0f0' } : {},
                    }}
                >
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: item.color,
                        }}
                    />
                    <Typography
                        variant="body2"
                        sx={{
                            color: activeFilter === item.apiStatus ? '#FFFFFF' : '#000000',
                        }}
                    >
                        {item.label} ({item.key === 'all' ? totalRooms : statusCounts[item.key]})
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}