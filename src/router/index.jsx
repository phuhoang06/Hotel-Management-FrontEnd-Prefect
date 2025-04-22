import {Routes, Route, Navigate, Outlet} from "react-router-dom";
import Forbidden from '../pages/Forbidden.jsx';
import { Typography } from "@mui/material";
import { LayoutAdmin } from "../layouts/admin/home/index.jsx";
import { LayoutEmployee } from "../layouts/employee/home/index.jsx";
import Overview from "../pages/admin/overview/index.jsx";
import Room from "../pages/admin/room/index.jsx";
import Employee from "../pages/admin/employee/index.jsx";
import RoomBookingView from "../pages/employee/roomBooking/RoomBookingView.jsx";
import LoginPage from "../pages/auth/login/index.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

const OverviewContent = () => (
    <section style={{ padding: "20px" }}>
        <Overview/>
    </section>
);

const RoomsContent = () => (
    <section style={{ padding: "20px" }}>
        <Room/>
    </section>
);

const GoodsContent = () => (
    <section style={{ padding: "20px" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            Danh sách hàng hóa
        </Typography>
        <Typography>Đây là nội dung danh sách hàng hóa.</Typography>
    </section>
);

const TransactionsContent = () => (
    <section style={{ padding: "20px" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            Danh sách giao dịch
        </Typography>
        <Typography>Đây là nội dung danh sách giao dịch.</Typography>
    </section>
);

const PartnersContent = () => (
    <section style={{ padding: "20px" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            Danh sách đối tác
        </Typography>
        <Typography>Đây là nội dung danh sách đối tác.</Typography>
    </section>
);

const EmployeeContent = () => (
        <Employee/>
);

const EmployeeScheduleContent = () => (
    <section style={{ padding: "20px" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            Lịch làm việc
        </Typography>
        <Typography>Đây là nội dung lịch làm việc.</Typography>
    </section>
);

const EmployeeAttendanceContent = () => (
    <section style={{ padding: "20px" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            Chấm công
        </Typography>
        <Typography>Đây là nội dung chấm công.</Typography>
    </section>
);

const EmployeePayrollContent = () => (
    <section style={{ padding: "20px" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            Bảng tính lương
        </Typography>
        <Typography>Đây là nội dung bảng tính lương.</Typography>
    </section>
);

const EmployeeSettingsContent = () => (
    <section style={{ padding: "20px" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            Thiết lập nhân viên
        </Typography>
        <Typography>Đây là nội dung thiết lập nhân viên.</Typography>
    </section>
);

const CashbookContent = () => (
    <section style={{ padding: "20px" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            Sổ quỹ
        </Typography>
        <Typography>Đây là nội dung sổ quỹ.</Typography>
    </section>
);

const ReportsContent = () => (
    <section style={{ padding: "20px" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            Báo cáo
        </Typography>
        <Typography>Đây là nội dung báo cáo.</Typography>
    </section>
);

// xử lý giao diện employee
const Bookings = () => (
   <RoomBookingView/>
);

const Invoices = () => (
    <Typography variant="h5" gutterBottom>
        Trang Hóa đơn bán lẻ
    </Typography>
);

const Pending = () => (
    <Typography variant="h5" gutterBottom>
        Chờ xác nhận
    </Typography>
);

// Layout wrappers
const AdminLayout = () => (
    <LayoutAdmin>
        <Outlet />
    </LayoutAdmin>
);

const EmployeeLayout = () => (
    <LayoutEmployee>
        <Outlet />
    </LayoutEmployee>
);

function Routers() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forbidden" element={<Forbidden />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
                <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route index element={<OverviewContent />} />
                <Route path="rooms" element={<RoomsContent />} />
                <Route path="goods" element={<GoodsContent />} />
                <Route path="transactions" element={<TransactionsContent />} />
                <Route path="partners" element={<PartnersContent />} />
                
                {/* Sử dụng route protection trực tiếp, không lồng */}
                <Route path="employee" element={
                    <ProtectedRoute requiredPermissions="VIEW_EMPLOYEE">
                        <EmployeeContent />
                    </ProtectedRoute>
                } />
                
                <Route path="room" element={
                    <ProtectedRoute requiredPermissions="VIEW_ROOM">
                        <RoomsContent />
                    </ProtectedRoute>
                } />
                
                <Route path="employee/schedule" element={<EmployeeScheduleContent />} />
                <Route path="employee/attendance" element={<EmployeeAttendanceContent />} />
                <Route path="employee/payroll" element={<EmployeePayrollContent />} />
                <Route path="employee/settings" element={<EmployeeSettingsContent />} />
                <Route path="cashbook" element={<CashbookContent />} />
                <Route path="reports" element={<ReportsContent />} />
            </Route>

            {/* Employee Routes */}
            <Route path="/employee" element={
                <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_RECEPTIONIST', 'ROLE_VIEWER']}>
                    <EmployeeLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Bookings />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="pending" element={<Pending />} />
            </Route>

            {/* Handle 404 - Page Not Found */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default Routers;