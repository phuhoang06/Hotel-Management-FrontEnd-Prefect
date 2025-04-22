import React from 'react';
import { Search, SearchIconWrapper, StyledInputBase } from '../common/StyledComponents';
import SearchIcon from '@mui/icons-material/Search';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function SearchBar({ searchValue, onSearchChange, anchorEl, onSearchClick, onSearchClose }) {
    return (
        <>
            <Box sx={{ width: '25%' }}>
                <Search sx={{ width: '90%', backgroundColor: 'white' }}>
                    <SearchIconWrapper>
                        <SearchIcon sx={{ color: '#3c3c3c', fontSize: '1.2rem' }} />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Tìm kiếm khách hàng, mã đặt phòng..."
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchValue}
                        onChange={onSearchChange}
                        onClick={onSearchClick}
                    />
                </Search>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={onSearchClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <MenuItem sx={{ fontSize: '0.8rem' }}>Tiểu chi tiết tìm kiếm</MenuItem>
                <Box sx={{ display: 'flex', gap: 0.5, px: 1, py: 0.7 }}>
                    <Button
                        sx={{
                            backgroundColor: '#E3F2FD',
                            color: '#1976d2',
                            borderRadius: 1,
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            padding: '4px 10px',
                            height: '28px',
                            '&:hover': { backgroundColor: '#BBDEFB' },
                        }}
                    >
                        Khách hàng
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: '#E3F2FD',
                            color: '#1976d2',
                            borderRadius: 1,
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            padding: '4px 10px',
                            height: '28px',
                            '&:hover': { backgroundColor: '#BBDEFB' },
                        }}
                    >
                        Mã đặt phòng
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, px: 1, py: 0.7 }}>
                    <Button
                        sx={{
                            backgroundColor: '#E3F2FD',
                            color: '#1976d2',
                            borderRadius: 1,
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            padding: '4px 10px',
                            height: '28px',
                            '&:hover': { backgroundColor: '#BBDEFB' },
                        }}
                    >
                        Mã kênh bán
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: '#E3F2FD',
                            color: '#1976d2',
                            borderRadius: 1,
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            padding: '4px 10px',
                            height: '28px',
                            '&:hover': { backgroundColor: '#BBDEFB' },
                        }}
                    >
                        Tên phòng
                    </Button>
                </Box>
            </Menu>
        </>
    );
}