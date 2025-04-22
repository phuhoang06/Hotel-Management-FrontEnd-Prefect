import { Box } from "@mui/material";
import Appbar from "../appbar/Appbar.jsx";
import Nav from "../nav/Nav.jsx";
import Content from "../content/Content.jsx";
import Footer from "../footer/Footer.jsx";

export function LayoutAdmin() {
    return (
        <Box
    
        >
            <Appbar />
            <Nav />
            <Content />
            <Footer />
        </Box>
    );
}