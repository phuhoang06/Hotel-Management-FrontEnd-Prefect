# TODO List

- [ ] Cải thiện responsive design cho trang overview để đảm bảo giao diện đồng bộ trên nhiều thiết bị.
- [ ] Kiểm tra và điều chỉnh các thành phần khác trong ứng dụng để đảm bảo tính responsive. 
- [x] Sửa logic lấy và hiển thị số lượng phòng trong trạng thái "Tất cả" ở chế độ xem lưới. 
- [x] Sửa logic lấy và hiển thị số lượng phòng trong trạng thái "Tất cả" ở chế độ xem danh sách.
- [x] Thêm chức năng click vào box hiển thị thông tin khách/phòng (People, Hotel, Room) để mở dialog khách lưu trú trong QuickBookingDialog.
- [x] Cập nhật giao diện InforApp với thiết kế mới, nâng cao trải nghiệm người dùng và khả năng responsive. 
- [x] Thêm sự kiện onClick cho nút "Thêm khách" trong InforApp.jsx để mở dialog GuestRegistrationForm.
- [x] Thêm sự kiện onClick cho MenuItem "Khách lưu trú" trong SideMenu để mở GuestListDialog.
- [x] Thêm sự kiện click cho biểu tượng lịch và đồng hồ trong QuickBookingDialog để mở DatePicker và TimePicker.
- [x] Hiển thị danh sách khách hàng mới nhất trong InforApp.jsx sử dụng API getRecentCustomers
- [x] Cải thiện CustomerSelectionDialog để hiển thị toàn bộ khách và chỉ cho phép chọn một khách làm khách đại diện

# GuestRegistrationForm Improvements
- [x] Chia form thành 2 cột để tối ưu không gian và cải thiện UX
- [x] Thêm các trường mới: Quốc tịch, Loại giấy tờ
- [x] Cải thiện vị trí và giao diện nút quét giấy tờ
- [x] Thêm validation và placeholder cho các trường nhập liệu
- [x] Cải thiện giao diện nút Lưu và thêm nút Hủy
- [x] Thêm trạng thái loading khi lưu dữ liệu 
- [x] Cập nhật giao diện form theo thiết kế mới (UI hiện đại và nhất quán) 
- [x] Thêm thông báo (notification) khi thao tác thành công/thất bại
- [x] Kết nối API để lưu thông tin khách lưu trú
- [x] Thêm sự kiện click cho biểu tượng lịch để mở DatePicker
- [x] Đánh dấu các phương thức guest service không được hỗ trợ trong tài liệu API
- [x] Chỉ sử dụng các API endpoints có trong tài liệu (/customers, /rooms, /checkins/walkin)
- [x] Sửa lỗi 400 Bad Request: Xử lý đúng dữ liệu gửi đi, loại bỏ trường null, trim dữ liệu, và hiển thị thông báo lỗi chi tiết
- [x] Sửa lỗi 400 Bad Request: Thay thế null bằng undefined để đảm bảo các trường không cần thiết được loại bỏ hoàn toàn khỏi request

# QuickBookingDialog Improvements
- [x] Thêm date picker và time picker khi click vào biểu tượng lịch và đồng hồ
- [x] Cải thiện UX khi chọn ngày và giờ
- [x] Tùy chỉnh giao diện bảng lịch và chọn giờ giống mẫu thiết kế
- [x] Tùy chỉnh time picker hiển thị danh sách giờ theo khoảng 30 phút
- [x] Thêm tính năng đóng date picker và time picker khi click ra ngoài
- [x] Đồng bộ hiển thị thời gian giữa trường nhập liệu với giá trị thực đã chọn
- [x] Hiển thị thông tin khách đại diện từ BookingDialog trong QuickBookingDialog
- [x] Thêm chức năng tự động cập nhật thời gian nhận phòng bằng thời gian hiện tại khi ấn "HIỆN TẠI"
- [x] Tự động cập nhật thời gian trả phòng thêm 1 giờ khi nhấn vào "HIỆN TẠI"
- [ ] Thêm validation cho thời gian check-in và check-out 
- [ ] Thêm tính năng tính toán thời gian checkout tự động dựa trên loại thuê

# GuestListDialog Improvements
- [x] Kết nối API để hiển thị danh sách khách lưu trú
- [x] Thêm tính năng tìm kiếm khách lưu trú theo tên, phòng, và thời gian
- [x] Thêm tính năng xóa thông tin khách lưu trú
- [x] Thêm thông báo (notification) khi thao tác thành công/thất bại
- [x] Thêm trạng thái loading khi tải dữ liệu
- [x] Thêm xử lý lỗi khi không thể tải dữ liệu
- [ ] Hoàn thiện chức năng quét CCCD để tự động điền thông tin
- [x] Thêm API và chức năng hiển thị danh sách khách hàng mới thêm

# API Integration
- [x] Tạo service để kết nối với backend API cho chức năng check-in
- [x] Tạo service để kết nối với backend API cho quản lý khách lưu trú
- [x] Tạo service để kết nối với backend API cho quản lý phòng
- [x] Cập nhật GuestRegistrationForm để sử dụng API
- [x] Cập nhật GuestListDialog để sử dụng API
- [ ] Cập nhật QuickBookingDialog để sử dụng API để:
  - [ ] Tìm kiếm khách hàng thông qua TextField ở phần trên
  - [ ] Hiển thị danh sách khách hàng tìm thấy và cho phép chọn
  - [ ] Cho phép tạo khách hàng mới nếu không tìm thấy
  - [ ] Lấy danh sách phòng trống dựa trên thời gian đã chọn
  - [ ] Tính toán giá phòng dựa trên loại thuê (giờ/ngày/qua đêm) và thời lượng
  - [ ] Tính toán thời gian checkout tự động dựa trên loại thuê và thời lượng
  - [ ] Kiểm tra hợp lệ số lượng khách cho phòng (adults/children)
  - [ ] Thực hiện checkin và cập nhật trạng thái phòng
  - [ ] Hiển thị thông báo thành công/thất bại

# Cải tiến future
- [ ] Thêm tính năng điều chỉnh giá phòng tùy chỉnh
- [ ] Thêm tính năng áp dụng khuyến mãi
- [ ] Thêm tính năng thanh toán
- [ ] Thêm tùy chọn xuất hóa đơn 