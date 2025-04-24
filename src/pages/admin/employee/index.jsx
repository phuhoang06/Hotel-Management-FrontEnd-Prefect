import React, { useState, useEffect } from 'react';
import { Grid, Snackbar, Alert } from '@mui/material';
import { toast } from 'react-toastify';
import EmployeeService from "../../../service/admin/employee.service.js";
import DataTable from './DataTable.jsx';
import AddEmployee from './AddEmployee.jsx';
import EditEmployee from './EditEmployee.jsx';
import DeleteEmployee from './DeleteEmployee.jsx';
import FilterSidebar from './FilterSidebar.jsx';
import ActionBar from './ActionBar.jsx';

function Employee() {
    const [selectedColumns, setSelectedColumns] = useState([
        'Mã nhân viên', 'Tên nhân viên', 'Số điện thoại',
        'Số CMND/CCCD', 'Địa chỉ', 'Chức vụ', 'Ghi chú'
    ]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [actionAnchorEl, setActionAnchorEl] = useState(null);
    const [menuType, setMenuType] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const columnOptions = [
        { label: 'Ảnh', key: 'imgUrl' },
        { label: 'Mã nhân viên', key: 'user_id' },
        { label: 'Tên nhân viên', key: 'fullName' },
        { label: 'Mã chấm công', key: 'user_id' },
        { label: 'Ngày sinh', key: 'dob' },
        { label: 'Giới tính', key: 'gender' },
        { label: 'Số CMND/CCCD', key: 'idCard' },
        { label: 'Ngày bắt đầu làm việc', key: 'start_date' },
        { label: 'Chi nhánh trực thuộc', key: 'branch' },
        { label: 'Chi nhánh làm việc', key: 'work_branch' },
        { label: 'Tài khoản KiotViet', key: 'login_account' },
        { label: 'Số điện thoại', key: 'phone' },
        { label: 'Tất cả chi nhánh', key: 'branch' },
        { label: 'Email', key: 'email' },
        { label: 'Facebook', key: 'facebook' },
        { label: 'Địa chỉ', key: 'address' },
        { label: 'Thiết bị di động', key: 'device' },
        { label: 'Ghi chú', key: 'note' },
        { label: 'Chức vụ', key: 'position' },
        { label: 'Phòng ban', key: 'department' }
    ];

    useEffect(() => {
        const loadEmployees = async () => {
            setLoading(true);
            try {
                const response = await EmployeeService.getAllEmployee();
                console.log(response);
                if (response && response.data) {
                    setEmployees(response.data.content || []);
                    console.log('Dữ liệu nhân viên đã được tải:', response.data.content);
                    toast.success("Thành công lấy ra dữ liệu từ API");
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách nhân viên:', error);
                toast.error('Không thể tải danh sách nhân viên');
                setEmployees([]);
            } finally {
                setLoading(false);
            }
        };

        loadEmployees();
    }, [refreshTrigger]);

    const refreshEmployeeData = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleColumnToggle = (label) => {
        setSelectedColumns(prev =>
            prev.includes(label)
                ? prev.filter(col => col !== label)
                : [...prev, label]
        );
    };

    const handleRowSelect = (id, event) => {
        event.stopPropagation();
        setSelectedRows(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    const handleSelectAllRows = (event) => {
        if (event.target.checked) {
            setSelectedRows(employees.map(emp => emp.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleOpenAddDialog = () => {
        setSelectedEmployee(null);
        setOpenAddDialog(true);
    };

    const handleOpenEditDialog = (employee) => {
        setSelectedEmployee(employee);
        setOpenEditDialog(true);
    };

    const handleDeleteSelected = () => setOpenDeleteDialog(true);

    const handleDeleteEmployees = async () => {
        try {
            setLoading(true);
            for (const id of selectedRows) {
                await EmployeeService.deleteEmployee(id);
            }

            setSnackbarMessage(`Đã xóa ${selectedRows.length} nhân viên thành công`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setSelectedRows([]);
            setOpenDeleteDialog(false);
            setActionAnchorEl(null);
            refreshEmployeeData();
        } catch (error) {
            console.error('Lỗi khi xóa nhân viên:', error);
            setSnackbarMessage('Xóa nhân viên thất bại');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleEmployeeAdded = () => {
        setOpenAddDialog(false);
        refreshEmployeeData();
        setSnackbarMessage('Thêm nhân viên thành công!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const handleEmployeeUpdated = () => {
        setOpenEditDialog(false);
        refreshEmployeeData();
        setSnackbarMessage('Cập nhật nhân viên thành công!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const handleSnackbarClose = () => setOpenSnackbar(false);

    const handleActionMenuClick = (e, type) => {
        setActionAnchorEl(e.currentTarget);
        setMenuType(type);
    };

    const handleActionMenuClose = () => {
        setActionAnchorEl(null);
        setMenuType(null);
    };

    return (
        <Grid container spacing={0.5}>
            <Grid size={{ xs: 4, md: 2.4 }}>
                <FilterSidebar
                    refreshData={refreshEmployeeData}
                />
            </Grid>
            <Grid size={{ xs: 6, md: 9.5 }}>
                <ActionBar
                    loading={loading}
                    selectedRows={selectedRows}
                    handleActionMenuClick={handleActionMenuClick}
                    handleActionMenuClose={handleActionMenuClose}
                    actionAnchorEl={actionAnchorEl}
                    menuType={menuType}
                    handleDeleteSelected={handleDeleteSelected}
                    handleOpenAddDialog={handleOpenAddDialog}
                    columnOptions={columnOptions}
                    selectedColumns={selectedColumns}
                    handleColumnToggle={handleColumnToggle}
                    refreshData={refreshEmployeeData}
                />
                <DataTable
                    employees={employees}
                    selectedColumns={selectedColumns}
                    selectedRows={selectedRows}
                    handleRowSelect={handleRowSelect}
                    handleSelectAllRows={handleSelectAllRows}
                    loading={loading}
                    handleOpenEditDialog={handleOpenEditDialog}
                    columnOptions={columnOptions}
                />
                <AddEmployee
                    open={openAddDialog}
                    onClose={() => setOpenAddDialog(false)}
                    onAddSuccess={handleEmployeeAdded}
                />
                <EditEmployee
                    open={openEditDialog}
                    onClose={() => setOpenEditDialog(false)}
                    employeeData={selectedEmployee}
                    onEditSuccess={handleEmployeeUpdated}
                />
                <DeleteEmployee
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    selectedRows={selectedRows}
                    handleDeleteEmployees={handleDeleteEmployees}
                    loading={loading}
                />
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Grid>
        </Grid>
    );
}

export default Employee;