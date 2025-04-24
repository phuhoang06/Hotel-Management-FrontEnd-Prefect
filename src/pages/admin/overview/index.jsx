import React from 'react';
import {Grid, Box, Container, Stack} from '@mui/material';
import RevenueDashboard from "./RevenueDashboard.jsx";
import RevenueExpenseCard from "./RevenueExpenseCard.jsx";
import ReceptionActivityCard from "./ReceptionActivityCard.jsx";
import BookingSummaryCard from "./BookingSummaryCard.jsx";
import RoomOccupancyCard from "./RoomOccupancyCard.jsx";
import Backlog from "./backlog.jsx";

export default function Dashboard() {
    return (
        <Container maxWidth="xl" sx={{py: 1}}>
            <Grid container spacing={2}>
                <Grid size={8}>
                    <Stack spacing={2}>
                        <Grid container spacing={2} columns={16}>
                            <Grid size={8}>
                                <RevenueDashboard/>
                            </Grid>
                            <Grid size={8}>
                                <RevenueExpenseCard/>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} columns={16}>
                            <Grid size={8}>
                                <ReceptionActivityCard/>
                            </Grid>
                            <Grid size={8}>
                                <BookingSummaryCard/>
                            </Grid>
                        </Grid>
                        <RoomOccupancyCard/>
                    </Stack>
                </Grid>
                <Grid size={4}>
                    <Backlog variant="card"/>
                </Grid>
            </Grid>
        </Container>
    );
}