import { Box, Button, Popper, MenuList, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useRef } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function Nav() {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState("overview");
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);

    const handleMouseEnter = () => {
        setOpen(true);
    };

    const handleMouseLeave = () => {
        setOpen(false);
    };

    const handleButtonClick = (buttonKey) => {
        setActiveButton(buttonKey);
        setSelectedMenuItem(null);
    };

    const handleMenuItemClick = (path, itemKey) => {
        setOpen(false);
        setActiveButton("employee");
        setSelectedMenuItem(itemKey);
        navigate(path);
    };
    
    const handleReceptionistClick = () => {
        // Navigate to employee page
        navigate('/employee');
    };

    const textButtonSx = (isActive) => ({
        color: "white",
        fontWeight: "bold",
        textTransform: "none",
        borderRadius: 2,
        backgroundColor: isActive ? "rgba(0,0,0,0.26)" : "transparent",
        "&:hover": {
            backgroundColor: isActive ? "rgba(119,119,119,0.18)" : "rgba(255, 182, 193, 0.3)",
        },
    });

    return (
        <section style={{ backgroundColor: "#0070f4", padding: "5px 18px" }}>
            <nav
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Button
                        variant="text"
                        sx={textButtonSx(activeButton === "overview")}
                        component={Link}
                        to="/admin"
                        onClick={() => handleButtonClick("overview")}
                    >
                        Tổng quan
                    </Button>
                    <Button
                        variant="text"
                        sx={textButtonSx(activeButton === "rooms")}
                        component={Link}
                        to="/admin/rooms"
                        onClick={() => handleButtonClick("rooms")}
                    >
                        Phòng
                    </Button>
                    <Button
                        variant="text"
                        sx={textButtonSx(activeButton === "goods")}
                        component={Link}
                        to="/admin/goods"
                        onClick={() => handleButtonClick("goods")}
                    >
                        Hàng hóa
                    </Button>
                    <Button
                        variant="text"
                        sx={textButtonSx(activeButton === "transactions")}
                        component={Link}
                        to="/admin/transactions"
                        onClick={() => handleButtonClick("transactions")}
                    >
                        Giao dịch
                    </Button>
                    <Button
                        variant="text"
                        sx={textButtonSx(activeButton === "partners")}
                        component={Link}
                        to="/admin/partners"
                        onClick={() => handleButtonClick("partners")}
                    >
                        Đối tác
                    </Button>
                    <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <Button
                            variant="text"
                            sx={textButtonSx(activeButton === "employee")}
                            ref={anchorRef}
                            onClick={() => handleButtonClick("employee")}
                        >
                            Nhân viên
                        </Button>
                        <Popper
                            open={open}
                            anchorEl={anchorRef.current}
                            placement="bottom-start"
                            disablePortal
                            style={{ zIndex: 9999 }}
                        >
                            <Box
                                sx={{
                                    bgcolor: "white",
                                    borderRadius: 1,
                                    boxShadow: 3,
                                    minWidth: 180,
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <MenuList dense>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick("/admin/employee", "employeeList")}
                                        sx={{
                                            color: "#000000",
                                            backgroundColor: selectedMenuItem === "employeeList" ? "rgba(0,0,0,0.19)" : "transparent",
                                            "&:hover": {
                                                backgroundColor: selectedMenuItem === "employeeList" ? "rgba(0,0,0,0.19)" : "rgba(0,0,0,0.19)",
                                            },
                                        }}
                                    >
                                        Nhân viên
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick("/admin/employee/schedule", "schedule")}
                                        sx={{
                                            color: "#000000",
                                            backgroundColor: selectedMenuItem === "schedule" ? "rgba(0,0,0,0.19)" : "transparent",
                                            "&:hover": {
                                                backgroundColor: selectedMenuItem === "schedule" ? "rgba(0,0,0,0.19)" : "rgba(0,0,0,0.19)",
                                            },
                                        }}
                                    >
                                        Lịch làm việc
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick("/admin/employee/attendance", "attendance")}
                                        sx={{
                                            color: "#000000",
                                            backgroundColor: selectedMenuItem === "attendance" ? "rgba(0,0,0,0.19)" : "transparent",
                                            "&:hover": {
                                                backgroundColor: selectedMenuItem === "attendance" ? "rgba(0,0,0,0.19)" : "rgba(0,0,0,0.19)",
                                            },
                                        }}
                                    >
                                        Chấm công
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick("/admin/employee/payroll", "payroll")}
                                        sx={{
                                            color: "#000000",
                                            backgroundColor: selectedMenuItem === "payroll" ? "rgba(0,0,0,0.19)" : "transparent",
                                            "&:hover": {
                                                backgroundColor: selectedMenuItem === "payroll" ? "rgba(0,0,0,0.19)" : "rgba(0,0,0,0.19)",
                                            },
                                        }}
                                    >
                                        Bảng tính lương
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick("/admin/employee/settings", "employeeSettings")}
                                        sx={{
                                            color: "#000000",
                                            backgroundColor: selectedMenuItem === "employeeSettings" ? "rgba(0,0,0,0.19)" : "transparent",
                                            "&:hover": {
                                                backgroundColor: selectedMenuItem === "employeeSettings" ? "rgba(0,0,0,0.19)" : "rgba(0,0,0,0.19)",
                                            },
                                        }}
                                    >
                                        Thiết lập nhân viên
                                    </MenuItem>
                                </MenuList>
                            </Box>
                        </Popper>
                    </Box>
                    <Button
                        variant="text"
                        sx={textButtonSx(activeButton === "cashbook")}
                        component={Link}
                        to="/admin/cashbook"
                        onClick={() => handleButtonClick("cashbook")}
                    >
                        Sổ quỹ
                    </Button>
                    <Button
                        variant="text"
                        sx={textButtonSx(activeButton === "reports")}
                        component={Link}
                        to="/admin/reports"
                        onClick={() => handleButtonClick("reports")}
                    >
                        Báo cáo
                    </Button>
                </Box>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "white",
                        color: "#007bff",
                        fontWeight: "bold",
                        borderRadius: 2,
                        textTransform: "none",
                        "&:hover": {
                            backgroundColor: "#f0f0f0",
                        },
                    }}
                    startIcon={<KeyboardArrowDownIcon />}
                    onClick={handleReceptionistClick}
                >
                    Lễ tân
                </Button>
            </nav>
        </section>
    );
}

export default Nav;