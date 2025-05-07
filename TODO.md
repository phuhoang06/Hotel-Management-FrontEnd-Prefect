# Project TODOs

## UI/UX Improvements
- [x] Reduce vertical spacing in admin dashboard overview page
  - Investigated and adjusted component spacing
  - Fine-tuned padding and margin values
  - Ensured readability is maintained while reducing white space

- [x] Simplify layout structure
  - Removed all unnecessary wrapper components
  - Integrated styling directly into Grid container
  - Maintained full-width and white background
  - Preserved responsive design

- [x] Add consistent background colors for room status in all views
  - Implemented unified getRoomBackgroundColor function across all view modes
  - Used gentle, appropriate background colors for different room statuses
  - Maintained original UI structure and text colors
  - Improved visual distinction between different room states

## Development Tasks 
- [ ] Enhance "Khách lưu trú" functionality in InforApp component
  - [x] Add dialog to display all available guests
  - [x] Implement checkbox selection for multiple guests
  - [x] Add confirmation button to apply selected guests
  - [ ] Improve search and filtering capabilities for guest list
  - [ ] Add pagination for large guest lists

- [x] Implement Quick Room Booking functionality
  - [x] Create QuickBookingDialog component with UI
  - [x] Integrate with Room API to fetch available rooms
  - [x] Implement room selection logic
  - [x] Integrate with Customer API for customer information
  - [x] Implement booking creation using CheckinService
  - [x] Add validation for booking parameters
  - [x] Calculate prices automatically based on room type and duration
  - [x] Handle success and error states for booking process
  - [x] Pass selected room data from Grid/List/Schematic views to QuickBookingDialog
  - [x] Implement direct check-in using /api/checkins API for immediate room status change

- [x] Implement complete room status display
  - [x] Update status logic according to documentation
  - [x] Implement correct room status transitions
  - [x] Create consistent status visualization across all views with appropriate background colors

- [x] Implement complete room checkout functionality
  - [x] Create CheckoutService to handle API interactions
  - [x] Update BookingDialog to support checkout process
  - [x] Add room cleaning status option during checkout
  - [x] Handle success and error states for checkout process
  - [x] Implement conditional UI elements based on room status
  - [x] Support API structure for checkout request

## Bug Fixes
- [x] Fix "Khách lưu trú" click event in sidebar menu
  - Fixed GuestListDialog component export
  - Removed unnecessary sample App component from dialog file
  - Added proper dialog close handler in SideMenu component
  - Ensured consistent component communication
  
- [x] Fix dialog closing functionality
  - Added onCloseDialog function to handle closing dialog correctly
  - Implemented useCallback for event handlers to prevent unnecessary re-renders
  - Conditional rendering for dialog component
  - Fixed event handler for close button within dialog
  
- [x] Fix dialog interaction issue
  - Corrected dialog close behavior to only close when clicking outside or on X button
  - Prevented dialog from closing when interacting with content
  - Improved event handlers for different close scenarios
  - Maintained expected user interaction patterns 

- [ ] Implement enhanced room booking service with detailed booking information
  - [x] Create new roomBooking.service.js with API connection to /rooms/with-booking-details
  - [x] Update SchematicView, ListView, and GridView components to use new service
  - [x] Implement additional data display in room cards
  - [x] Update room status logic to handle enhanced data
  - [x] Add booking list dialog to display all upcoming bookings for a room
  - [ ] Test integration with all room booking components 