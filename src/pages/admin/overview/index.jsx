import React from 'react';
import { Grid, Box, Container } from '@mui/material';
import RevenueDashboard from "./RevenueDashboard.jsx";
import RevenueExpenseCard from "./RevenueExpenseCard.jsx";
import ReceptionActivityCard from "./ReceptionActivityCard.jsx";
import BookingSummaryCard from "./BookingSummaryCard.jsx";
import RoomOccupancyCard from "./RoomOccupancyCard.jsx";
import Backlog from "./backlog.jsx";

export default function Dashboard() {
  return (
      <Container maxWidth="xl" sx={{ py: 1 }}>
        <Grid container rowSpacing={4} columnSpacing={4}>
          {/* Hàng 1: Doanh thu, Thu chi, và Backlog (dạng card) */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: '100%' }}>
              <RevenueDashboard />
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ height: '100%' }}>
              <RevenueExpenseCard />
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ height: '100%', maxHeight: '100px' }}> {/* Set a maxHeight to match other cards */}
              <Backlog variant="card" />
            </Box>
          </Grid>

          {/* Hàng 2: Hoạt động lễ tân và Đặt phòng */}
          <Grid item xs={12} md={6}>
            <ReceptionActivityCard />
          </Grid>
          <Grid item xs={12} md={6}>
            <BookingSummaryCard />
          </Grid>

          {/* Hàng 3: Công suất sử dụng phòng */}
          <Grid item xs={12} md={8}>
            <RoomOccupancyCard />
          </Grid>
        </Grid>
      </Container>
  );
}