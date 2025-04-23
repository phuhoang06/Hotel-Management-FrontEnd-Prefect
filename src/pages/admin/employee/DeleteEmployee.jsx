import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@mui/material';
import PermissionGuard from "../../../components/PermissionGuard.jsx";

function DeleteEmployee({ open, onClose, selectedRows, handleDeleteEmployees, loading }) {
    return (
        <PermissionGuard permissions="DELETE_EMPLOYEE">
            <Dialog open={open} onClose={onClose} disableRestoreFocus={true}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>Bạn có chắc chắn muốn xóa {selectedRows.length} nhân viên?</DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={loading}>Hủy</Button>
                    <Button
                        onClick={handleDeleteEmployees}
                        color="error"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Xóa'}
                    </Button>
                </DialogActions>
            </Dialog>
        </PermissionGuard>
    );
}

export default DeleteEmployee;