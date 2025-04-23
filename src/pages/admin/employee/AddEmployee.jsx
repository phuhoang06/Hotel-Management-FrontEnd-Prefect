import React from 'react';
import PermissionGuard from "../../../components/PermissionGuard.jsx";
import AddEmployeeDialog from "./AddEmployeeDialog.jsx";

function AddEmployee({ open, onClose, fetchAllEmployees, employee, onAddSuccess }) {
    return (
        <PermissionGuard permissions="CREATE_EMPLOYEE">
            <AddEmployeeDialog
                open={open}
                onClose={onClose}
                fetchAllEmployees={fetchAllEmployees}
                employee={employee}
                onAddSuccess={onAddSuccess}
            />
        </PermissionGuard>
    );
}

export default AddEmployee;