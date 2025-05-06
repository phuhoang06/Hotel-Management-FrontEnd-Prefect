import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import RoomTabs from "./RoomTabs.jsx";
import {Typography} from "@mui/material";


export default function CategoryRoom() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            {/*<Grid container spacing={2}>*/}
            {/*    <Grid size={3}>*/}
            {/*        Thanh lọc*/}
            {/*    </Grid>*/}
            {/*    <Grid size={9}>*/}
            {/*        <Typography variant="h5" sx={{ mb: 2 }}>*/}
            {/*            Hạng phòng & Phòng*/}
            {/*        </Typography>*/}
            {/*        <RoomTabs />*/}
            {/*    </Grid>*/}
            {/*</Grid>*/}
            <RoomTabs />
        </Box>
    );
}
