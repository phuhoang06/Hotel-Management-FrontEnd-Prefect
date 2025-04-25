import React, { useState } from 'react';
import { Box, InputBase, CircularProgress, IconButton } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';

function SearchBar({ onSearch, loading }) {
    const [inputValue, setInputValue] = useState("");

    // Xử lý khi người dùng nhấn Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch(inputValue);
        }
    };

    // Xử lý khi người dùng thay đổi nội dung input
    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    // Xử lý khi người dùng nhấn nút tìm kiếm
    const handleSearchClick = () => {
        onSearch(inputValue);
    };

    // Xử lý khi người dùng nhấn nút xóa
    const handleClearClick = () => {
        setInputValue("");
        onSearch("");
    };

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
            <IconButton
                sx={{ p: 0.5 }}
                onClick={handleSearchClick}
                disabled={loading}
            >
                <SearchIcon sx={{ fontSize: 18, color: 'gray' }} />
            </IconButton>

            <InputBase
                placeholder="Tìm theo chức vụ (vd: Receptionist)"
                sx={{ fontSize: 14, flex: 1, ml: 1 }}
                inputProps={{ 'aria-label': 'search employee' }}
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
            />

            {inputValue && (
                <IconButton
                    sx={{ p: 0.5 }}
                    onClick={handleClearClick}
                    disabled={loading}
                >
                    <ClearIcon sx={{ fontSize: 16, color: 'gray' }} />
                </IconButton>
            )}

            {loading && (
                <CircularProgress size={18} sx={{ ml: 1 }} />
            )}
        </Box>
    );
}

export default SearchBar;