import React from 'react';
import { Box, Button, IconButton, Menu, MenuItem, FormControlLabel, Checkbox, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import PermissionGuard from "../../../components/PermissionGuard.jsx";
import SearchBar from './SearchBar.jsx';

function ActionBar({
                       searchTerm,
                       setSearchTerm,
                       loading,
                       selectedRows,
                       handleActionMenuClick,
                       handleActionMenuClose,
                       actionAnchorEl,
                       menuType,
                       handleDeleteSelected,
                       handleOpenAddDialog,
                       columnOptions,
                       selectedColumns,
                       handleColumnToggle
                   }) {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            mt: 1.5
        }}>
            <SearchBar onSearch={setSearchTerm} loading={loading} />

            {selectedRows.length > 0 && (
                <>
                    <PermissionGuard permissions="DELETE_EMPLOYEE">
                        <Button
                            variant="contained"
                            startIcon={<UploadFileIcon sx={{ fontSize: '16px' }} />}
                            size="small"
                            sx={{
                                backgroundColor: '#00b63e',
                                textTransform: 'none',
                                borderRadius: '8px',
                                padding: '6px 8px',
                                fontSize: '12px',
                                '& .MuiButton-startIcon': { marginRight: '4px' }
                            }}
                            onClick={(e) => handleActionMenuClick(e, 'actionMenu')}
                            disabled={loading}
                        >
                            Thao tác
                        </Button>
                    </PermissionGuard>
                    <Menu
                        anchorEl={actionAnchorEl}
                        open={Boolean(actionAnchorEl) && menuType === 'actionMenu'}
                        onClose={handleActionMenuClose}
                        disableAutoFocusItem={true}
                    >
                        <MenuItem onClick={handleDeleteSelected}>Xóa</MenuItem>
                    </Menu>
                </>
            )}

            <Box sx={{ display: 'flex', gap: 1 }}>
                <PermissionGuard permissions="CREATE_EMPLOYEE">
                    <Button
                        variant="contained"
                        startIcon={<AddIcon sx={{ fontSize: '16px' }} />}
                        size="small"
                        sx={{
                            backgroundColor: '#00b63e',
                            textTransform: 'none',
                            borderRadius: '8px',
                            padding: '6px 10px',
                            fontSize: '12px',
                            '& .MuiButton-startIcon': { marginRight: '4px' }
                        }}
                        onClick={handleOpenAddDialog}
                        disabled={loading}
                    >
                        Nhân viên
                    </Button>
                </PermissionGuard>
                <Button
                    variant="contained"
                    startIcon={<UploadFileIcon sx={{ fontSize: '16px' }} />}
                    size="small"
                    sx={{
                        backgroundColor: '#00b63e',
                        textTransform: 'none',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        '& .MuiButton-startIcon': { marginRight: '4px' }
                    }}
                    disabled={loading}
                >
                    Nhập file
                </Button>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon sx={{ fontSize: '16px' }} />}
                    size="small"
                    sx={{
                        backgroundColor: '#00b63e',
                        textTransform: 'none',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        '& .MuiButton-startIcon': { marginRight: '4px' }
                    }}
                    disabled={loading}
                >
                    Xuất file
                </Button>
                <IconButton
                    sx={{ padding: '2px' }}
                    onClick={(event) => handleActionMenuClick(event, 'columnMenu')}
                    disabled={loading}
                >
                    <AppRegistrationIcon sx={{ fontSize: '26px' }} />
                </IconButton>
                <Menu
                    anchorEl={actionAnchorEl}
                    open={Boolean(actionAnchorEl) && menuType === 'columnMenu'}
                    onClose={handleActionMenuClose}
                    PaperProps={{ style: { maxHeight: 400, width: 350 } }}
                    disableAutoFocusItem={true}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                        <Box>
                            {columnOptions.slice(0, 10).map((option) => (
                                <FormControlLabel
                                    key={option.label}
                                    control={
                                        <Checkbox
                                            checked={selectedColumns.includes(option.label)}
                                            onChange={() => handleColumnToggle(option.label)}
                                            size="small"
                                            sx={{ p: 0.8 }}
                                        />
                                    }
                                    label={<Typography variant="body2" sx={{ fontSize: '12px' }}>{option.label}</Typography>}
                                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '12px' }, ml: 1 }}
                                />
                            ))}
                        </Box>
                        <Box>
                            {columnOptions.slice(10).map((option) => (
                                <FormControlLabel
                                    key={option.label}
                                    control={
                                        <Checkbox
                                            checked={selectedColumns.includes(option.label)}
                                            onChange={() => handleColumnToggle(option.label)}
                                            size="small"
                                            sx={{ p: 0.8 }}
                                        />
                                    }
                                    label={<Typography variant="body2" sx={{ fontSize: '12px' }}>{option.label}</Typography>}
                                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '12px' }, ml: 1 }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Menu>
            </Box>
        </Box>
    );
}

export default ActionBar;