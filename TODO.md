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