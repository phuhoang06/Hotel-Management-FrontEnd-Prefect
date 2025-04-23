import React from 'react';
import { Box, InputBase, CircularProgress } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";


function SearchBar({ searchTerm, setSearchTerm, loading }) {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            width: 420,
            height: 26,
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            px: 1.5,
            py: 0.5,
            mt: 1,
            ml: 2,
            backgroundColor: '#ffffff',
            boxShadow: 1
        }}>
            <SearchIcon sx={{ fontSize: 20, color: 'gray', mr: 1 }} />
            <InputBase
                placeholder="Tìm theo mã chấm công, tên nhân viên"
                sx={{ fontSize: 14, flex: 1 }}
                inputProps={{ 'aria-label': 'search employee' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
            />
            {loading && searchTerm && (
                <CircularProgress size={20} sx={{ mr: 1 }} />
            )}
        </Box>
    );
}

export default SearchBar;