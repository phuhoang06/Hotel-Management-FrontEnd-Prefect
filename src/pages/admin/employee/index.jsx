import React, { useState, useEffect } from 'react';
import { Grid, Snackbar, Alert } from '@mui/material';
import { toast } from 'react-toastify';
import EmployeeService from "../../../service/admin/employee.service.js";
import SearchBar from './SearchBar.jsx';
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
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    // Pagination
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [actionAnchorEl, setActionAnchorEl] = useState(null);
    const [menuType, setMenuType] = useState(null); // Thêm state để lưu loại menu

    const columnOptions = [
        { label: 'Ảnh', key: 'image' },
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

    const fetchEmployees = async (pageNum = page, pageSize = size, searchKeyword = '') => {
        setLoading(true);
        try {
            const cachedData = sessionStorage.getItem('employeeData');
            const timestamp = sessionStorage.getItem('employeeDataTimestamp');
            const now = new Date().getTime();

            if (cachedData && timestamp && (now - parseInt(timestamp) < 5 * 60 * 1000)) {
                try {
                    const parsedData = JSON.parse(cachedData);
                    setEmployees(parsedData.content || []);
                    setFilteredEmployees(parsedData.content || []);
                    setTotalPages(parsedData.totalPages || 1);
                    setTotalElements(parsedData.totalElements || 0);
                    setLoading(false);
                    console.log('Using cached employee data');
                    return;
                } catch (error) {
                    console.error('Error parsing cached data:', error);
                }
            }

            const response = await EmployeeService.getAllEmployee(pageNum, pageSize);
            if (response.data) {
                const { content, totalPages, totalElements } = response.data;
                setEmployees(content || []);
                setFilteredEmployees(content || []);
                setTotalPages(totalPages || 1);
                setTotalElements(totalElements || 0);

                sessionStorage.setItem('employeeData', JSON.stringify(response.data));
                sessionStorage.setItem('employeeDataTimestamp', new Date().getTime().toString());
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            setSnackbarMessage('Không thể tải danh sách nhân viên');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);

            setEmployees([]);
            setFilteredEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees(page, size, searchTerm);
    }, [page, size]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchEmployees(0, size, searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

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
            setSelectedRows(filteredEmployees.map(emp => emp.id));
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
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employees:', error);
            setSnackbarMessage('Xóa nhân viên thất bại');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleEmployeeAdded = () => {
        setOpenAddDialog(false);
        fetchEmployees();
        setSnackbarMessage('Thêm nhân viên thành công!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const handleEmployeeUpdated = () => {
        setOpenEditDialog(false);
        fetchEmployees();
        setSnackbarMessage('Cập nhật nhân viên thành công!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const handleSnackbarClose = () => setOpenSnackbar(false);

    const handleActionMenuClick = (e, type) => {
        setActionAnchorEl(e.currentTarget);
        setMenuType(type); // Lưu loại menu ('columnMenu' hoặc 'actionMenu')
    };

    const handleActionMenuClose = () => {
        setActionAnchorEl(null);
        setMenuType(null); // Reset loại menu khi đóng
    };

    return (
        <Grid container spacing={0.5}>
            <Grid size={{ xs: 4, md: 2.4 }}>
                <FilterSidebar size={size} setSize={setSize} />
            </Grid>
            <Grid size={{ xs: 6, md: 9.5 }}>
                <ActionBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    loading={loading}
                    selectedRows={selectedRows}
                    handleActionMenuClick={handleActionMenuClick}
                    handleActionMenuClose={handleActionMenuClose}
                    actionAnchorEl={actionAnchorEl}
                    menuType={menuType} // Truyền menuType xuống ActionBar
                    handleDeleteSelected={handleDeleteSelected}
                    handleOpenAddDialog={handleOpenAddDialog}
                    columnOptions={columnOptions}
                    selectedColumns={selectedColumns}
                    handleColumnToggle={handleColumnToggle}
                />
                <DataTable
                    employees={filteredEmployees}
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
                    fetchAllEmployees={() => fetchEmployees(page, size)}
                    employee={selectedEmployee}
                    onAddSuccess={handleEmployeeAdded}
                />
                <EditEmployee
                    open={openEditDialog}
                    onClose={() => setOpenEditDialog(false)}
                    employeeData={selectedEmployee}
                    fetchAllEmployees={() => fetchEmployees(page, size)}
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