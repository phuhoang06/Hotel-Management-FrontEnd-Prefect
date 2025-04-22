import {Box, Link, Typography} from "@mui/material";
import React from "react";

function Footer() {

    return (
        <Box
            sx={{
                padding: "16px",
                backgroundColor: "#f5f5f5",
                borderTop: "1px solid #ddd",
                textAlign: "center",
                color: "#666",
            }}
        >
            <Typography variant="body2">
                © 2025 Công ty TNHH MH370. All rights reserved.
            </Typography>
            <Box display="flex" justifyContent="center" gap={2} mt={1}>
                <Link href="#" underline="hover" color="primary">
                    Chính sách bảo mật
                </Link>
                <Link href="#" underline="hover" color="primary">
                    Điều khoản sử dụng
                </Link>
                <Link href="#" underline="hover" color="primary">
                    Liên hệ
                </Link>
            </Box>
        </Box>
    )

}

export default Footer;