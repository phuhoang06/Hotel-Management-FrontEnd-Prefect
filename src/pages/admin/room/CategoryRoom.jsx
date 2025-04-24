import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';


export default function CategoryRoom() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid size={3}>
                    Thanh lọc
                </Grid>
                <Grid size={9}>
                    Tab chính
                </Grid>
            </Grid>
        </Box>
    );
}
