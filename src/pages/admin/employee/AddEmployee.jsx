import React from 'react';
import PermissionGuard from "../../../components/PermissionGuard.jsx";
import AddEmployeeDialog from "./AddEmployeeDialog.jsx";

function AddEmployee({ open, onClose, employee, onAddSuccess }) {
    return (
        <PermissionGuard permissions="CREATE_EMPLOYEE">
            <AddEmployeeDialog
                open={open}
                onClose={onClose}
                employeeData={employee}
                onAddSuccess={onAddSuccess}
                isEditMode={false}
            />
        </PermissionGuard>
    );
}

export default AddEmployee;