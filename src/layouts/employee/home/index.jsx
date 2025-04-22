import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppBarHeader from "../appBar/index.jsx";
import SideMenu from "../sideMenu/SideMenu.jsx";

export function LayoutEmployee() {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const handleToggleMenu = () => {
        setShowMenu((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMenu && menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <AppBarHeader onToggleMenu={handleToggleMenu} />
            {showMenu && <SideMenu menuRef={menuRef} />}
            <Box
                sx={{
                    flexGrow: 1,
                    backgroundColor: "#f0f1f3",
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}