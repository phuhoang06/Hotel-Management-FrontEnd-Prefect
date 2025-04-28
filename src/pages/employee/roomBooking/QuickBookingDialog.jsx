import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    InputAdornment,
    IconButton,
    Typography,
    Box,
    Divider, // Import Divider
    FormControl,
    InputLabel,
    OutlinedInput,
    Paper
} from '@mui/material';
import {
    Search,
    CalendarMonth,
    AccessTime,
    DirectionsWalk,
    Add,
    Close,
    CreditCard,
    Delete,
    Info,
    People, // Keep People icon
    Hotel,  // Keep Hotel icon
    Room    // Keep Room icon
} from '@mui/icons-material';
// Import BookingDialog directly from InforApp file
import InforApp, { BookingDialog } from './InforApp'; 

const QuickBookingDialog = ({ open, onClose }) => {
    const [roomType, setRoomType] = useState("Phòng 01 giường đôi cho 2 người");
    const [roomNumber, setRoomNumber] = useState("P.203");
    const [bookingType, setBookingType] = useState("Giờ");
    // Adjusted check-in/out times to match the image more closely
    const [checkInTime, setCheckInTime] = useState("28 Thg 04, 09:58");
    const [checkOutTime, setCheckOutTime] = useState("28 Thg 04, 10:58");
    const [duration, setDuration] = useState("1 giờ");
    const [price, setPrice] = useState(180000);
    const [saleChannel, setSaleChannel] = useState("");
    const [priceList, setPriceList] = useState("");
    const [note, setNote] = useState("");
    const [inforDialogOpen, setInforDialogOpen] = useState(false); // State for BookingDialog

    const handleClose = () => {
        if (onClose) onClose();
    };

    // Function to handle opening the BookingDialog dialog
    const handleOpenInforDialog = () => {
        setInforDialogOpen(true);
    };

    // Function to handle closing the BookingDialog dialog
    const handleCloseInforDialog = () => {
        setInforDialogOpen(false);
    };

    return (
        // Changed maxWidth to "xl" for a wider dialog
        <Dialog open={Boolean(open)} onClose={handleClose} maxWidth="xl" fullWidth>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>Đặt/Nhận phòng nhanh</Typography>
                <IconButton onClick={handleClose} size="small"><Close /></IconButton>
            </Box>

            <DialogContent sx={{ p: 4 }}>
                {/* Search + Controls + Summary - Adjusted Summary style */}
                <Box display="flex" alignItems="center" mb={4} flexWrap="wrap"> {/* Added flexWrap for smaller screens */}
                    <TextField
                        // Reduced flexGrow to allow other items space, or set a fixed width if preferred
                        sx={{ flexGrow: 1, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, backgroundColor: '#f5f5f5', borderRadius: '8px', '.MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' } }} // Added border color transparent and responsive margin bottom
                        placeholder="Nhập mã, Tên, SĐT khách hàng"
                        variant="outlined"
                        size="small" // Changed size to small for a slightly smaller input
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ fontSize: 20, color: '#555' }} /> {/* Adjusted icon size */}
                                </InputAdornment>
                            )
                        }}
                    />
                    {/* Compact Summary Section - Styled to match the new image */}
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1.5} // Space between icon-number groups
                        ml={{ xs: 0, sm: 3 }} // Margin left, responsive
                        mt={{ xs: 2, sm: 0 }} // Margin top, responsive
                        px={1.5} // Horizontal padding inside the box
                        py={0.5} // Vertical padding inside the box
                        border="1px solid #ccc" // Border color
                        borderRadius="20px" // Rounded corners (pill shape)
                        sx={{ 
                            flexShrink: 0,
                            cursor: 'pointer', // Add pointer cursor to indicate it's clickable
                            '&:hover': { 
                                backgroundColor: '#f5f5f5',  // Light background on hover
                                borderColor: '#999'  // Darker border on hover
                            }
                        }} // Prevent shrinking and add hover effect
                        onClick={handleOpenInforDialog} // Add onClick handler to open BookingDialog
                    >
                        {/* Số người */}
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <People sx={{ color: 'gray', fontSize: 20 }} /> {/* Icon */}
                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>2</Typography> {/* Number */}
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} /> {/* Vertical separator */}

                        {/* Số khách */}
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Hotel sx={{ color: 'gray', fontSize: 20 }} /> {/* Icon */}
                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>1</Typography> {/* Number */}
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} /> {/* Vertical separator */}

                        {/* Số phòng */}
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Room sx={{ color: 'gray', fontSize: 20 }} /> {/* Icon */}
                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>1</Typography> {/* Number */}
                        </Box>
                    </Box>
                    {/* End Compact Summary Section */}

                    {/* Original Controls (Walk icon, Sale Channel, Price List) - Adjusted layout */}
                    <Box display="flex" alignItems="center" gap={2} ml={3}> {/* Adjusted ml and gap */}
                        <IconButton size="small" sx={{ p: 0.5 }}><DirectionsWalk sx={{ fontSize: 20 }} /></IconButton> {/* Adjusted padding and icon size */}
                        <FormControl size="small" sx={{ minWidth: 120 }}> {/* Adjusted minWidth */}
                            <InputLabel id="sale-channel-label" sx={{ fontSize: '0.85rem' }}>Mã kênh bán</InputLabel> {/* Adjusted font size */}
                            <Select
                                labelId="sale-channel-label"
                                value={saleChannel}
                                label="Mã kênh bán"
                                onChange={e => setSaleChannel(e.target.value)}
                                sx={{ height: '38px', fontSize: '0.85rem' }} // Adjusted height and font size
                            >
                                <MenuItem value="">Mã kênh bán</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 140 }}> {/* Adjusted minWidth */}
                            <InputLabel id="price-list-label" sx={{ fontSize: '0.85rem' }}>Bảng giá chung</InputLabel> {/* Adjusted font size */}
                            <Select
                                labelId="price-list-label"
                                value={priceList}
                                label="Bảng giá chung"
                                onChange={e => setPriceList(e.target.value)}
                                sx={{ height: '38px', fontSize: '0.85rem' }} // Adjusted height and font size
                            >
                                <MenuItem value="">Bảng giá chung</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    {/* End Original Controls */}
                </Box>

                {/* Room Information Section - Adjusted for alignment and spacing */}
                {/* Removed overflowX: 'auto' */}
                <Paper elevation={0} sx={{ p: 2, mb: 4, backgroundColor: '#f7fcf7', border: '1px solid #e8f5e9', borderRadius: '8px' }}> {/* Adjusted elevation, padding, background, border, and added border radius */}
                    {/* Header Row - Using flex properties for column distribution */}
                    {/* Added gap for horizontal spacing between columns */}
                    <Box sx={{ display: 'flex', mb: 2, backgroundColor: '#e8f5e9', p: '10px', borderRadius: '8px', alignItems: 'center', gap: 2 }}>
                        {/* Column Headers - Using flex properties */}
                        {/* flex: flex-grow flex-shrink flex-basis */}
                        <Box sx={{ flex: '2 0 0', flexShrink: 0 }}> {/* Hạng phòng - flex-grow 2, can't shrink, basis 0 */}
                            <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#2e7d32' }}>Hạng phòng</Typography>
                        </Box>
                        <Box sx={{ flex: '1 0 0', flexShrink: 0 }}> {/* Phòng - flex-grow 1, can't shrink, basis 0 */}
                            <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#2e7d32', display: 'flex', alignItems: 'center' }}>
                                Phòng
                                <Box component="span" sx={{ bgcolor: 'green', color: 'white', borderRadius: '50%', px: 0.7, py: 0.1, ml: 0.5, fontSize: '0.65rem', height: '18px', width: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'normal' }}>1</Box>
                            </Typography>
                        </Box>
                        <Box sx={{ flex: '1 0 0', flexShrink: 0 }}> {/* Hình thức - flex-grow 1, can't shrink, basis 0 */}
                            <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#2e7d32' }}>Hình thức</Typography>
                        </Box>
                        <Box sx={{ flex: '2 0 0', flexShrink: 0, display: 'flex', alignItems: 'center' }}> {/* Nhận - flex-grow 2, can't shrink, basis 0 */}
                            <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#2e7d32', mr: 1 }}>Nhận</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}> {/* Badges */}
                                <Box sx={{ bgcolor: '#1976d2', color: 'white', borderRadius: '16px', px: 1, py: 0.3, fontSize: '0.7rem', height: '20px', display: 'flex', alignItems: 'center', fontWeight: 'medium' }}>HIỆN TẠI</Box>
                                <Box sx={{ border: '1px solid #2e7d32', color: '#2e7d32', borderRadius: '16px', px: 1, py: 0.3, fontSize: '0.7rem', height: '20px', display: 'flex', alignItems: 'center', fontWeight: 'medium' }}>QUY ĐỊNH</Box>
                            </Box>
                        </Box>
                        <Box sx={{ flex: '1.5 0 0', flexShrink: 0 }}> {/* Trả phòng - flex-grow 1.5, can't shrink, basis 0 */}
                            <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#2e7d32' }}>Trả phòng</Typography>
                        </Box>
                        <Box sx={{ flex: '1 0 0', flexShrink: 0, textAlign: 'center' }}> {/* Dự kiến - flex-grow 1, can't shrink, basis 0, center text */}
                            <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#2e7d32' }}>Dự kiến</Typography>
                        </Box>
                        <Box sx={{ flex: '1.5 0 0', flexShrink: 0, display: 'flex', alignItems: 'center' }}> {/* Thành tiền */}
                            <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#2e7d32', mr: 0.5 }}>Thành tiền</Typography>
                            <Info sx={{ ml: 0.5, fontSize: '14px', color: '#aaa' }} />
                        </Box>
                        {/* Placeholder for Delete icon column - Fixed width */}
                        <Box sx={{ flex: '0 0 40px', flexShrink: 0 }}></Box>
                    </Box>

                    {/* Data row - Using flex properties corresponding to header, added gap */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}> {/* Added gap for horizontal spacing between columns */}
                        {/* Hạng phòng */}
                        {/* Use flex basis corresponding to header, added right padding */}
                        <Box sx={{ flex: '2 0 0', flexShrink: 0, pr: 1 }}>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontSize: '0.85rem', color: 'rgba(0,0,0,0.85)' }}>
                                {roomType.replace(' cho ', '\ncho ')}
                            </Typography>
                        </Box>
                        {/* Phòng - Use flex properties for flexibility */}
                        <Box sx={{ flex: '1 1 0', flexShrink: 0 }}> {/* flex-grow 1, can shrink, basis 0 */}
                            <FormControl fullWidth size="small">
                                <Select value={roomNumber} onChange={e => setRoomNumber(e.target.value)} sx={{ height: '38px', borderRadius: '8px', fontSize: '0.85rem' }}>
                                    <MenuItem value="P.203">P.203</MenuItem>
                                    <MenuItem value="P.204">P.204</MenuItem>
                                    <MenuItem value="P.205">P.205</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        {/* Hình thức - Use flex properties for flexibility */}
                        <Box sx={{ flex: '1 1 0', flexShrink: 0 }}> {/* flex-grow 1, can shrink, basis 0 */}
                            <FormControl fullWidth size="small">
                                <Select value={bookingType} onChange={e => setBookingType(e.target.value)} sx={{ height: '38px', borderRadius: '8px', fontSize: '0.85rem' }}>
                                    <MenuItem value="Giờ">Giờ</MenuItem>
                                    <MenuItem value="Ngày">Ngày</MenuItem>
                                    <MenuItem value="Đêm">Đêm</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        {/* Nhận - Use flex properties for flexibility */}
                        <Box sx={{ flex: '2 1 0', flexShrink: 0 }}> {/* flex-grow 2, can shrink, basis 0 */}
                            <OutlinedInput
                                fullWidth
                                size="small"
                                value={checkInTime}
                                onChange={e => setCheckInTime(e.target.value)}
                                sx={{ height: '38px', borderRadius: '8px', fontSize: '0.85rem' }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton size="small" sx={{ p: '4px' }}><CalendarMonth fontSize="small" sx={{ fontSize: 18 }} /></IconButton>
                                        <IconButton size="small" sx={{ p: '4px' }}><AccessTime fontSize="small" sx={{ fontSize: 18 }} /></IconButton>
                                    </InputAdornment>
                                }
                            />
                        </Box>
                        {/* Trả phòng - Use flex properties for flexibility */}
                        <Box sx={{ flex: '1.5 1 0', flexShrink: 0 }}> {/* flex-grow 1.5, can shrink, basis 0 */}
                            <OutlinedInput
                                fullWidth
                                size="small"
                                value={checkOutTime}
                                onChange={e => setCheckOutTime(e.target.value)}
                                sx={{ height: '38px', borderRadius: '8px', fontSize: '0.85rem' }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton size="small" sx={{ p: '4px' }}><CalendarMonth fontSize="small" sx={{ fontSize: 18 }} /></IconButton>
                                        <IconButton size="small" sx={{ p: '4px' }}><AccessTime fontSize="small" sx={{ fontSize: 18 }} /></IconButton>
                                    </InputAdornment>
                                }
                            />
                        </Box>
                        {/* Dự kiến - Use flex basis corresponding to header, center text */}
                        <Box sx={{ flex: '1 0 0', flexShrink: 0, textAlign: 'center' }}> {/* flex-grow 1, cannot shrink, basis 0, center text */}
                            <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.85)' }}>{duration}</Typography>
                        </Box>
                        {/* Thành tiền + Delete Icon - Use flex basis corresponding to header, display flex, alignItems */}
                        <Box sx={{ flex: '1.5 0 0', flexShrink: 0, display: 'flex', alignItems: 'center' }}> {/* flex-grow 1.5, cannot shrink, basis 0 */}
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>{price.toLocaleString()} VNĐ</Typography>
                            {/* Increased ml to 2 for more space, removed default padding */}
                            <IconButton size="small" color="error" sx={{ ml: 2, p: 0 }}><Delete fontSize="small" sx={{ fontSize: 18 }} /></IconButton>
                        </Box>
                        {/* Placeholder for Delete icon column alignment - Fixed width */}
                        <Box sx={{ flex: '0 0 40px', flexShrink: 0 }}></Box>
                    </Box>
                </Paper>

                {/* Action buttons - Moved outside Paper and aligned left */}
                <Box display="flex" justifyContent="flex-start" gap={2} mb={4} ml={2}> {/* Adjusted justifyContent and ml to match the image */}
                    <Button variant="outlined" color="success" startIcon={<Add />} sx={{ textTransform: 'none', borderRadius: '16px', minWidth: '140px', fontSize: '0.85rem' }}>Chọn thêm phòng</Button> {/* Adjusted minWidth and font size */}
                    <Button variant="outlined" color="primary" startIcon={<Add />} sx={{ textTransform: 'none', borderRadius: '16px', minWidth: '140px', fontSize: '0.85rem' }}>Sản phẩm, dịch vụ</Button> {/* Adjusted minWidth and font size */}
                </Box>


                {/* Note section */}
                <Box mb={4}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontSize: '0.9rem', fontWeight: 'medium' }}>Ghi chú</Typography> {/* Adjusted font size and weight */}
                    <TextField fullWidth placeholder="Nhập ghi chú..." value={note} onChange={e => setNote(e.target.value)} size="small" sx={{ fontSize: '0.85rem' }} /> {/* Adjusted font size */}
                </Box>

                {/* Payment summary */}
                <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>Khách cần trả</Typography> {/* Adjusted font size */}
                        <Typography color="green" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>{price.toLocaleString()} VNĐ</Typography> {/* Added currency */}
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                        <Box display="flex" alignItems="center">
                            <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>Khách thanh toán</Typography> {/* Adjusted font size */}
                            <CreditCard fontSize="small" sx={{ ml: 1, color: 'green' }} /> {/* Adjusted icon size */}
                        </Box>
                        <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>0 VNĐ</Typography> {/* Adjusted font size and added currency */}
                    </Box>
                </Paper>
            </DialogContent>

            {/* Footer Actions */}
            <DialogActions sx={{ px: 4, pb: 4, justifyContent: 'flex-end', gap: 2 }}> {/* Adjusted gap */}
                <Button variant="outlined" sx={{ textTransform: 'none', minWidth: '120px', borderRadius: '16px', fontSize: '0.9rem' }}>Thêm tùy chọn</Button> {/* Adjusted minWidth and font size */}
                <Button variant="contained" color="success" sx={{ textTransform: 'none', minWidth: '120px', borderRadius: '16px', fontSize: '0.9rem' }}>Nhận phòng</Button> {/* Adjusted minWidth and font size */}
                <Button variant="contained" sx={{ bgcolor: 'orange', '&:hover': { bgcolor: '#e65100' }, textTransform: 'none', minWidth: '120px', borderRadius: '16px', fontSize: '0.9rem' }}>Đặt trước</Button> {/* Adjusted minWidth and font size */}
            </DialogActions>
            
            {/* BookingDialog Dialog */}
            {inforDialogOpen && <BookingDialog open={inforDialogOpen} handleClose={handleCloseInforDialog} />}
        </Dialog>
    );
};

export default QuickBookingDialog;