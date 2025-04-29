import React, { useState, useCallback } from "react";
import { Box, MenuItem, Divider, Chip, Typography } from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import HotelIcon from "@mui/icons-material/Hotel";
import ShareIcon from "@mui/icons-material/Share";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ListAltIcon from "@mui/icons-material/ListAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FeedbackIcon from "@mui/icons-material/Feedback";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LogoutIcon from "@mui/icons-material/Logout";
import authService from "../../../service/auth.service.js";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { GuestListDialog } from "../../../pages/employee/roomBooking/GuestListDialog.jsx";

export default function SideMenu({ menuRef }) {
    const navigate = useNavigate();
    const [guestDialogOpen, setGuestDialogOpen] = useState(false);
    
    const handleLogout = () => {
        // Call the authentication service logout function
        authService.logout();
        
        // Show success message
        toast.success("Đăng xuất thành công!");
        
        // Redirect to login page
        navigate("/login");
    };
    
    const handleAdminClick = () => {
        // Navigate to admin page
        navigate('/admin');
    };

    const handleGuestListClick = useCallback(() => {
        setGuestDialogOpen(true);
    }, []);

    const handleGuestDialogClose = useCallback(() => {
        setGuestDialogOpen(false);
    }, []);
    
    return (
        <>
            <Box
                ref={menuRef}
                sx={{
                    position: "absolute",
                    top: 60,
                    right: 20,
                    width: 250,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    boxShadow: 3,
                    zIndex: 1300,
                    py: 1,
                    maxHeight: 400,
                    overflowY: "auto",
                }}
            >
                <MenuItem onClick={handleAdminClick}>
                    <ManageAccountsIcon fontSize="small" sx={{ mr: 1 }} /> Quản lý
                </MenuItem>
                <Divider sx={{ my: 1, mx: "10px", backgroundColor: "#ccc" }} />
                <MenuItem>
                    <HotelIcon fontSize="small" sx={{ mr: 1 }} /> Buồng phòng
                </MenuItem>
                <MenuItem onClick={handleGuestListClick}>
                    <PeopleIcon fontSize="small" sx={{ mr: 1 }} /> Khách lưu trú
                </MenuItem>
                <MenuItem>
                    <AssignmentIcon fontSize="small" sx={{ mr: 1 }} /> Lập phiếu thu
                </MenuItem>
                <Divider sx={{ my: 1, mx: "10px", backgroundColor: "#ccc" }} />
                <MenuItem>
                    <ListAltIcon fontSize="small" sx={{ mr: 1 }} /> Báo cáo lễ tân
                </MenuItem>
                <MenuItem>
                    <ListAltIcon fontSize="small" sx={{ mr: 1 }} /> Báo cáo cuối ngày
                </MenuItem>
                <MenuItem>
                    <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> Tùy chọn hiển thị
                </MenuItem>
                <Divider sx={{ my: 1, mx: "10px", backgroundColor: "#ccc" }} />

                <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Đăng xuất
                </MenuItem>
            </Box>
            {guestDialogOpen && (
                <GuestListDialog 
                    open={guestDialogOpen} 
                    handleClose={handleGuestDialogClose} 
                />
            )}
        </>
    );
}