import React from 'react';
import PermissionGuard from "../../../components/PermissionGuard.jsx";
import EditEmployeeDialog from "./EditEmployeeDialog.jsx";

function EditEmployee({ open, onClose, employeeData, fetchAllEmployees, onEditSuccess }) {
    return (
        <PermissionGuard permissions="UPDATE_EMPLOYEE">
            <EditEmployeeDialog
                open={open}
                onClose={onClose}
                employeeData={employeeData}
                fetchAllEmployees={fetchAllEmployees}
                onEditSuccess={onEditSuccess}
            />
        </PermissionGuard>
    );
}

export default EditEmployee;