import React, { useEffect, useState } from 'react';
import RoomBookingService from "../../../service/roomBooking.service.js";
import CheckinService from "../../../service/checkin.service.js";

/**
 * Component that automatically checks for late check-ins and cancels them
 * Only runs client-side on mount
 */
const LateCheckinHandler = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle checking for late check-ins when component mounts
  useEffect(() => {
    const checkForLateCheckins = async () => {
      if (isProcessing) return;
      
      try {
        setIsProcessing(true);
        
        // Fetch all rooms with booking details
        const response = await RoomBookingService.getAllRoomsWithBookingDetails();
        const rooms = response.content || [];
        
        // Get current time
        const now = new Date();
        
        // Find all rooms with UPCOMING bookings that have passed their check-in time by at least 1 hour
        const roomsWithLateCheckins = rooms.filter(room => {
          // Check if the room has any UPCOMING bookings
          const upcomingBooking = room.bookings?.find(booking => booking.roomStatusInBooking === 'UPCOMING');
          
          if (!upcomingBooking || !upcomingBooking.checkinTime) return false;
          
          // Parse check-in time from the booking
          const checkinTime = new Date(
            upcomingBooking.checkinTime[0],
            upcomingBooking.checkinTime[1] - 1,
            upcomingBooking.checkinTime[2],
            upcomingBooking.checkinTime[3] || 0,
            upcomingBooking.checkinTime[4] || 0
          );
          
          // Check if check-in time was at least 1 hour ago
          const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds
          const timeSinceCheckin = now - checkinTime;
          
          return timeSinceCheckin >= oneHourInMs;
        });
        
        // Process each late check-in
        for (const room of roomsWithLateCheckins) {
          const upcomingBooking = room.bookings?.find(booking => booking.roomStatusInBooking === 'UPCOMING');
          
          if (upcomingBooking) {
            // Prepare the data for the cancellation API
            const cancellationData = {
              bookingId: upcomingBooking.bookingId || upcomingBooking.id,
              roomIdsToCheckin: [room.id]
            };
            
            console.log(`Cancelling late check-in for room ${room.id}, booking ${upcomingBooking.id || upcomingBooking.bookingId}`);
            
            // Call the API to cancel the check-in
            await CheckinService.cancelCheckin(cancellationData);
            
            console.log(`Successfully cancelled late check-in for room ${room.id}`);
          }
        }
      } catch (error) {
        console.error('Error handling late check-ins:', error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    // Run the check for late check-ins
    checkForLateCheckins();
    
    // Set up a timer to check for late check-ins periodically (every 15 minutes)
    const intervalId = setInterval(checkForLateCheckins, 15 * 60 * 1000);
    
    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  // This component doesn't render anything visible
  return null;
};

export default LateCheckinHandler; 