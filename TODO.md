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

- [ ] Implement complete room status display
  - [x] Update status logic according to documentation
  - [x] Implement correct room status transitions
  - [ ] Create consistent status visualization across all views

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