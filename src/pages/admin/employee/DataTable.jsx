import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Checkbox, CircularProgress } from '@mui/material';
import EmployeeRow from './EmployeeRow.jsx';

function DataTable({ employees, selectedColumns, selectedRows, handleRowSelect, handleSelectAllRows, loading, handleOpenEditDialog, columnOptions }) {
    return (
        <Box sx={{
            mt: 3,
            ml: 2,
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            boxShadow: 1,
            backgroundColor: '#ffffff'
        }}>
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
        </Box>
    );
}

export default DataTable;