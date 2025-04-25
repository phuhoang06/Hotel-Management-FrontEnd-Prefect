import React, { useState, useEffect } from 'react';
import {
    TableRow, TableCell, Checkbox, IconButton, Collapse,
    Box, Typography, Grid, Button
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import PermissionGuard from "../../../components/PermissionGuard.jsx";
import { toast } from 'react-toastify';
import UserService from "../../../service/admin/user.service.js";

function EmployeeRow({ row, selectedRows, handleRowSelect, selectedColumns, handleOpenEditDialog, columnOptions }) {
    const [open, setOpen] = useState(false);
    const [locked, setLocked] = useState(row.locked || false);
    const placeholderImage = '';

    // Cập nhật trạng thái locked mỗi khi mở dòng
    useEffect(() => {
        const fetchLockStatus = async () => {
            try {
                const res = await UserService.getByIdLock(row.userId);
                setLocked(res.data.locked);
            } catch (err) {
                console.error("Lỗi khi lấy trạng thái locked:", err);
            }
        };

        if (open) {
            fetchLockStatus();
        }
    }, [open, row.userId]);

    const detailedInfo = columnOptions
        .filter((option) => option.label !== 'Ảnh')
        .map((option) => ({
            label: option.label,
            value: row[option.key] || '-',
        }));

    const column2 = detailedInfo.slice(0, 9);
    const column3 = detailedInfo.slice(9);

    const handleLockToggle = async () => {
        try {
            const newLockedStatus = !locked;
            await UserService.updateAccountLockStatus(row.userId, newLockedStatus);
            setLocked(newLockedStatus);
            toast.success(newLockedStatus ? 'Đã khóa tài khoản!' : 'Đã mở khóa tài khoản!');
        } catch (error) {
            toast.error('Cập nhật trạng thái thất bại!');
        }
    };

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell sx={{ minWidth: 50, padding: '8px 16px', textAlign: 'left' }}>
                    <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) => handleRowSelect(row.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        size="small"
                    />
                </TableCell>
                <TableCell sx={{ minWidth: 50, padding: '8px 16px', textAlign: 'left' }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                {selectedColumns.map((col) => (
                    <TableCell
                        key={col}
                        align="left"
                        sx={{
                            fontSize: 13,
                            minWidth: 120,
                            maxWidth: 200,
                            padding: '8px 16px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {col === 'Ảnh' ? (
                            <img
                                src={row.imgUrl ? (row.imgUrl.startsWith('http') ? row.imgUrl : `http://localhost:8080/${row.imgUrl}`) : placeholderImage}
                                alt="Employee"
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                        ) : (
                            row[columnOptions.find((option) => option.label === col)?.key] || '-'
                        )}
                    </TableCell>
                ))}
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={selectedColumns.length + 2}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="subtitle1" gutterBottom component="div"
                                        sx={{ fontWeight: 'bold', fontSize: 14, mb: 5 }}>
                                Thông tin chi tiết
                            </Typography>
                            <Grid container spacing={8}>
                                <Grid item xs={4}>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 'bold' }}>
                                            Ảnh:
                                        </Typography>
                                        <img
                                            src={row.imgUrl ? (row.imgUrl.startsWith('http') ? row.imgUrl : `http://localhost:8080/${row.imgUrl}`) : placeholderImage}
                                            alt="Employee"
                                            style={{
                                                width: '150px',
                                                height: '150px',
                                                objectFit: 'cover',
                                                marginTop: '8px'
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={4} sx={{ mr: 6 }}>
                                    {column2.map((info, index) => (
                                        <Box key={index} sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontSize: 13 }}>
                                                <strong>{info.label}:</strong> {info.value}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Grid>
                                <Grid item xs={4}>
                                    {column3.map((info, index) => (
                                        <Box key={index} sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontSize: 13 }}>
                                                <strong>{info.label}:</strong> {info.value}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Grid>
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3, mb: 7 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleLockToggle}
                                    startIcon={locked ? <LockIcon /> : <LockOpenIcon />}
                                >
                                    {locked ? 'Mở khóa' : 'Khóa tài khoản'}
                                </Button>

                                <Button variant="contained" size="small"
                                        sx={{
                                            backgroundColor: '#1976d2',
                                            textTransform: 'none',
                                            padding: '6px 12px',
                                            fontSize: '12px'
                                        }}>
                                    Lấy mã xác nhận
                                </Button>

                                <PermissionGuard permissions="UPDATE_EMPLOYEE">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            backgroundColor: '#00c853',
                                            textTransform: 'none',
                                            padding: '6px 12px',
                                            fontSize: '12px'
                                        }}
                                        onClick={() => handleOpenEditDialog(row)}
                                    >
                                        Cập nhật
                                    </Button>
                                </PermissionGuard>

                                <Button variant="contained" size="small" sx={{
                                    backgroundColor: '#d32f2f',
                                    textTransform: 'none',
                                    padding: '6px 12px',
                                    fontSize: '12px'
                                }}>
                                    Ngừng làm việc
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default EmployeeRow;
