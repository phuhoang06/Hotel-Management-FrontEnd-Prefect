import React from 'react';
import { Box, Button } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import GridViewIcon from '@mui/icons-material/GridView';
import MapIcon from '@mui/icons-material/Map';

export default function ViewModeButtons({ viewMode, onViewModeChange }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: '#e0e0e0',
                borderRadius: 1,
                padding: '2px',
            }}
        >
            <Button
                sx={{
                    backgroundColor: viewMode === 'Danh sách' ? '#279656' : 'transparent',
                    color: viewMode === 'Danh sách' ? '#ffffff' : '#666',
                    borderRadius: 1,
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    height: '28px',
                    '&:hover': {
                        backgroundColor: viewMode === 'Danh sách' ? '#279656' : '#d0d0d0',
                    },
                    minWidth: 'auto',
                }}
                startIcon={<ListIcon sx={{ fontSize: '1.2rem' }} />}
                onClick={() => onViewModeChange('Danh sách')}
            >
                {viewMode === 'Danh sách' && 'Danh sách'}
            </Button>
            <Button
                sx={{
                    backgroundColor: viewMode === 'Lưới' ? '#279656' : 'transparent',
                    color: viewMode === 'Lưới' ? '#ffffff' : '#666',
                    borderRadius: 1,
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    height: '28px',
                    '&:hover': {
                        backgroundColor: viewMode === 'Lưới' ? '#279656' : '#d0d0d0',
                    },
                    minWidth: 'auto',
                }}
                startIcon={<GridViewIcon sx={{ fontSize: '1.2rem' }} />}
                onClick={() => onViewModeChange('Lưới')}
            >
                {viewMode === 'Lưới' && 'Lưới'}
            </Button>
            <Button
                sx={{
                    backgroundColor: viewMode === 'Sơ đồ' ? '#279656' : 'transparent',
                    color: viewMode === 'Sơ đồ' ? '#ffffff' : '#666',
                    borderRadius: 1,
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    height: '28px',
                    '&:hover': {
                        backgroundColor: viewMode === 'Sơ đồ' ? '#279656' : '#d0d0d0',
                    },
                    minWidth: 'auto',
                }}
                startIcon={<MapIcon sx={{ fontSize: '1.2rem' }} />}
                onClick={() => onViewModeChange('Sơ đồ')}
            >
                {viewMode === 'Sơ đồ' && 'Sơ đồ'}
            </Button>
        </Box>
    );
}