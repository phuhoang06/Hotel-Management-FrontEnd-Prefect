import { AppBar, Box, IconButton, Typography, Menu, MenuItem, Button } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ReceiptIcon from "@mui/icons-material/Receipt";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import HomeIcon from "../../../icons/homeIcon.jsx";
import authService from "../../../service/auth.service.js";
import { toast } from 'react-toastify';

export default function AppBarHeader({ onToggleMenu }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeButton, setActiveButton] = useState("bookings");
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const handleLogout = () => {
        handleMenuClose();
        
        // Call the authentication service logout function
        authService.logout();
        
        // Show success message
        toast.success("Đăng xuất thành công!");
        
        // Redirect to login page
        navigate("/login");
    };

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "#279656", borderRadius: "8px", height: 50 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box display="flex" alignItems="center">
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 40,
                                height: 40,
                                cursor: "pointer",
                                borderRadius: 20,
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                                },
                            }}
                        >
                        <HomeIcon />
                        </Box>
                        <Typography variant="h6" fontWeight="bold" color="#0B2B4B" ml={1}>
                            MH370
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 2, fontSize: 13 }}>
                        <Button
                            component={Link}
                            to="/employee/bookings"
                            onClick={() => handleButtonClick("bookings")}
                            sx={{
                                color: "white",
                                backgroundColor: activeButton === "bookings" ? "#be91ff" : "#2aa24f",
                                borderRadius: 50,
                                height: 34,
                                width: 150,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textTransform: "none",
                                "&:hover": {
                                    backgroundColor: "#be91ff",
                                },
                            }}
                        >
                            <CalendarTodayIcon sx={{ color: "white", height: 18 }} />
                            <Typography variant="body2" sx={{ fontSize: 13, color: "white", fontWeight: 600, ml: 1 }}>
                                lịch đặt phòng
                            </Typography>
                        </Button>

                        <Button
                            component={Link}
                            to="/employee/invoices"
                            onClick={() => handleButtonClick("invoices")}
                            sx={{
                                color: "white",
                                backgroundColor: activeButton === "invoices" ? "#be91ff" : "#2aa24f",
                                borderRadius: 50,
                                height: 34,
                                width: 150,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textTransform: "none",
                                "&:hover": {
                                    backgroundColor: "#be91ff",
                                },
                            }}
                        >
                            <ReceiptIcon sx={{ color: "white", height: 18 }} />
                            <Typography variant="body2" sx={{ fontSize: 13, color: "white", fontWeight: 600, ml: 1 }}>
                                hóa đơn bán lẻ
                            </Typography>
                        </Button>

                        <Button
                            component={Link}
                            to="/employee/pending"
                            onClick={() => handleButtonClick("pending")}
                            sx={{
                                color: "white",
                                backgroundColor: activeButton === "pending" ? "#be91ff" : "#2aa24f",
                                borderRadius: 50,
                                height: 34,
                                width: 150,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textTransform: "none",
                                "&:hover": {
                                    backgroundColor: "#be91ff",
                                },
                            }}
                        >
                            <CalendarTodayIcon sx={{ color: "white", height: 18 }} />
                            <Typography variant="body2" sx={{ fontSize: 13, color: "white", fontWeight: 600, ml: 1 }}>
                                chờ xác nhận
                            </Typography>
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton size="large" color="inherit">
                        <Badge badgeContent={2} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationOnIcon fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                            Chi nhánh trung tâm
                        </Typography>
                    </Box>

                    <Typography sx={{ fontWeight: "bold" }}>0869931792</Typography>

                    <IconButton sx={{ p: 0 }} onClick={handleMenuOpen}>
                        <AccountCircle fontSize="large" />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        sx={{
                            "& .MuiPaper-root": {
                                minWidth: "200px",
                                boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
                            },
                        }}
                    >
                        <MenuItem sx={{ py: 1.5 }}>
                            <AccountCircle fontSize="small" sx={{ mr: 1, color: "#555" }} /> Tài khoản
                        </MenuItem>
                        <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                            <ArrowForwardIcon fontSize="small" sx={{ mr: 1, color: "#555" }} /> Đăng xuất
                        </MenuItem>
                    </Menu>

                    <IconButton color="inherit" onClick={onToggleMenu}>
                        <MenuIcon />
                    </IconButton>
                </Box>
            </Box>
        </AppBar>
    );
}