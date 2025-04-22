import { AppBar, Avatar, Box, IconButton, Typography, Menu, MenuItem } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeIcon from "../../../icons/homeIcon.jsx";
import authService from "../../../service/auth.service.js";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function Appbar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [accountModalOpen, setAccountModalOpen] = useState(false);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        console.log("Đăng xuất clicked");
        handleMenuClose();
        
        // Call the authentication service logout function
        authService.logout();
        
        // Show success message
        toast.success("Đăng xuất thành công!");
        
        // Redirect to login page
        navigate("/login");
    };

    const handleAccount = () => {
        console.log("Tài khoản clicked");
        handleMenuClose();
        setAccountModalOpen(true);
    };

    const handleCloseAccountModal = () => {
        setAccountModalOpen(false);
    };

    return (
        <>
            <AppBar position="static" color="default" elevation={1} sx={{ height: 50 }}>
                <Box
                    sx={{
                        height: "100%",
                        backgroundColor: "white",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        px: 2,
                    }}
                >
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
                            <HomeIcon/>
                        </Box>
                        <Typography variant="h6" fontWeight="bold" color="#0B2B4B" ml={1}>
                            MH370
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={2}>
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
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 512 512"
                            >
                                <path
                                    fill="#EDCE83"
                                    d="M446.93 303.162c-4.767-6.76-6.503-15.149-4.712-23.225a66.3 66.3 0 0 0 1.57-14.376c0-26.88-16.042-50.111-39.339-61.207c-5.232-2.492-9.655-6.421-12.498-11.47c-21.55-38.27-48.807-67.372-84.6-81.145c16.419-31.108 40.537-59.02 60.568-79.165C379.907 20.516 371.416 0 354.412 0H168.935c-16.949 0-25.422 20.37-13.582 32.498c18.479 18.928 39.89 45.296 54.169 76.837c-42.403 13.594-62.967 49.997-94.425 119.688c-3.236 7.169-9.285 12.663-16.707 15.268c-34.198 12.003-58.637 43.782-58.637 81.104c0 18.49 6.001 35.619 16.213 49.658c3.264 4.488 4.98 9.886 5.174 15.432c2.386 68.375 57.921 121.592 197.165 121.592c131.117 0 180.512-44.445 189.025-107.16c.51-3.755 1.66-7.402 3.571-10.673c7.321-12.532 11.504-27.017 11.504-42.451c-.001-18.042-5.712-34.788-15.475-48.631"
                                />
                                <path
                                    fill="#AA8F4D"
                                    d="M257.954 133.694c-14.867 0-28.824-1.189-39.3-3.348c-6.111-1.259-24.706-5.092-24.706-18.932a9.685 9.685 0 0 1 9.685-9.685c4.304 0 7.952 2.808 9.213 6.691c4.58 2.565 20.732 5.904 45.107 5.904c24.377 0 40.529-3.339 45.108-5.904c1.261-3.883 4.909-6.691 9.213-6.691a9.685 9.685 0 0 1 9.685 9.685c0 13.84-18.595 17.672-24.705 18.932c-10.475 2.158-24.432 3.348-39.3 3.348m23.953 98.917c12.506 2.426 22.662 7.557 31.331 15.02c1.97 1.696 2.165 4.688.481 6.668l-11.265 13.245c-1.635 1.922-4.469 2.204-6.498.702c-9.36-6.93-19.046-10.232-30.202-10.232c-12.56 0-20.468 5.35-20.468 14.886c0 9.768 5.815 13.723 29.772 21.166c29.307 9.304 46.054 21.631 46.054 50.008c0 22.674-14.447 40.037-39.482 46.404c-2.092.532-3.548 2.433-3.548 4.592v28.212a4.76 4.76 0 0 1-4.759 4.759h-17.23a4.76 4.76 0 0 1-4.759-4.759v-26.313c0-2.386-1.772-4.414-4.14-4.709c-18.275-2.272-32.347-9.238-42.761-18.163c-2.022-1.733-2.168-4.817-.375-6.787l12.572-13.814c1.688-1.855 4.514-2.059 6.483-.505c10.12 7.986 21.629 12.482 35.199 12.482c15.118 0 24.19-6.977 24.19-18.608c0-11.164-5.584-16.282-27.912-23.259c-34.889-10.7-47.217-25.12-47.217-47.915c0-22.555 16.187-38.383 40.168-43.286a4.745 4.745 0 0 0 3.793-4.648v-25.46a4.76 4.76 0 0 1 4.759-4.759h17.23a4.76 4.76 0 0 1 4.759 4.759v25.658a4.74 4.74 0 0 0 3.825 4.656"
                                />
                            </svg>
                        </Box>

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
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22m7-7.414V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.185 4.074 5 6.783 5 10v4.586l-1.707 1.707A1 1 0 0 0 3 17v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-1a1 1 0 0 0-.293-.707z"
                                />
                            </svg>
                        </Box>

                        <IconButton>
                            <SettingsIcon />
                        </IconButton>

                        <div>
                            <Avatar
                                sx={{
                                    bgcolor: "#e3f2fd",
                                    width: 32,
                                    height: 32,
                                    marginRight: 1,
                                    cursor: "pointer",
                                }}
                                onClick={handleMenuOpen}
                            />
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
                                <MenuItem onClick={handleAccount} sx={{ py: 1.5 }}>
                                    <AccountCircleIcon
                                        fontSize="small"
                                        sx={{ mr: 1, color: "#555" }}
                                    />
                                    Tài khoản
                                </MenuItem>
                                <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                                    <ArrowForwardIcon
                                        fontSize="small"
                                        sx={{ mr: 1, color: "#555" }}
                                    />
                                    Đăng xuất
                                </MenuItem>
                            </Menu>
                        </div>
                    </Box>
                </Box>
            </AppBar>
        </>
    );
}

export default Appbar;