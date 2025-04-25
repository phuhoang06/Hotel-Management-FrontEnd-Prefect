import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Checkbox, CircularProgress, Button, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EmployeeRow from './EmployeeRow.jsx';

function DataTable({
                       employees,
                       selectedColumns,
                       selectedRows,
                       handleRowSelect,
                       handleSelectAllRows,
                       loading,
                       handleOpenEditDialog,
                       columnOptions,
                       refreshData,
                       page,
                       totalPages,
                       handlePageChange
                   }) {
    return (
        <Box sx={{
            mt: 3,
            ml: 2,
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            boxShadow: 1,
            backgroundColor: '#ffffff'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton
                    onClick={refreshData}
                    disabled={loading}
                    title="Làm mới dữ liệu"
                    size="small"
                >
                    <RefreshIcon />
                </IconButton>
            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead sx={{ backgroundColor: '#eaf2ff' }}>
                        <TableRow>
                            <TableCell sx={{ minWidth: 50, padding: '8px 16px', textAlign: 'left' }}>
                                <Checkbox
                                    indeterminate={selectedRows.length > 0 && selectedRows.length < employees.length}
                                    checked={employees.length > 0 && selectedRows.length === employees.length}
                                    onChange={handleSelectAllRows}
                                    disabled={loading}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell sx={{ minWidth: 50, padding: '8px 16px', textAlign: 'left' }}>Chi tiết</TableCell>
                            {selectedColumns.map((col) => (
                                <TableCell key={col} sx={{
                                    fontWeight: 'bold',
                                    fontSize: 13,
                                    minWidth: 120,
                                    maxWidth: 200,
                                    padding: '8px 16px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {col}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={selectedColumns.length + 2} align="center">
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        py: 3
                                    }}>
                                        <CircularProgress size={24} />
                                        <Typography variant="body2" sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && employees.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={selectedColumns.length + 2} align="center">
                                    <Typography variant="body1" sx={{ my: 3 }}>Không có dữ liệu nhân viên</Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={refreshData}
                                        startIcon={<RefreshIcon />}
                                        sx={{ mt: 1 }}
                                    >
                                        Làm mới dữ liệu
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && employees.map(employee => (
                            <EmployeeRow
                                key={employee.id}
                                row={employee}
                                selectedRows={selectedRows}
                                handleRowSelect={handleRowSelect}
                                selectedColumns={selectedColumns}
                                handleOpenEditDialog={handleOpenEditDialog}
                                columnOptions={columnOptions}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Button
                    variant="outlined"
                    disabled={page === 0 || loading}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous
                </Button>
                <Typography variant="body2">
                    Page {page + 1} of {totalPages}
                </Typography>
                <Button
                    variant="outlined"
                    disabled={page >= totalPages - 1 || loading}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
}

export default DataTable;