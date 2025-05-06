import React, {useEffect, useRef, useState} from 'react';

import moment from 'moment';
import {
    Alert,
    Box,
    Button,
    ButtonBase,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';

import {
    AccessTime,
    Add,
    CalendarMonth,
    ChevronLeft,
    ChevronRight,
    Close,
    CreditCard,
    Delete,
    DirectionsWalk,
    Hotel,
    Info,
    People,
    Room
} from '@mui/icons-material';

// Import BookingDialog directly from InforApp file
import {BookingDialog} from './InforApp';

// Import date and time pickers
import {LocalizationProvider} from '@mui/x-date-pickers';

import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';

import {vi as viLocale} from 'date-fns/locale';


// Import services for API integration
import checkinService from '../../../service/checkin.service';

import roomService from '../../../service/room.service';


const convertTimeVi = (time) => {
    // Chuyển đổi thời gian được chọn thành đối tượng moment
    let timeAsMoment = moment(time);
    
    // Định dạng theo yêu cầu: "YYYY-MM-DDTHH:mm:ss"
    return timeAsMoment.format("YYYY-MM-DDTHH:mm:ss");
}


const QuickBookingDialog = ({ open, onClose, initialRoomData = null , handleUpdateLoading}) => {

// Original state variables

    const [roomType, setRoomType] = useState(initialRoomData?.roomCategory?.name || "Phòng 01 giường đôi cho 2 người");

    const [roomNumber, setRoomNumber] = useState(initialRoomData?.roomNumber || "P.203");

    const [bookingType, setBookingType] = useState("Giờ");



// Date and time picker states - khởi tạo trước để dùng cho format

    const currentDate = new Date();

    const oneHourLater = new Date(currentDate.getTime() + 60 * 60 * 1000);



// Format ngày giờ khởi tạo

    const formatInitialDateTime = (date) => {

        const day = date.getDate();

        const month = date.getMonth() + 1;

        const hours = date.getHours().toString().padStart(2, '0');

        const minutes = date.getMinutes().toString().padStart(2, '0');



        return `${day} Thg ${month.toString().padStart(2, '0')}, ${hours}:${minutes}`;

    };



// Date and time picker states

    const [checkInDate, setCheckInDate] = useState(currentDate);

    const [checkInTimeValue, setCheckInTimeValue] = useState(currentDate);

    const [checkOutDate, setCheckOutDate] = useState(oneHourLater);

    const [checkOutTimeValue, setCheckOutTimeValue] = useState(oneHourLater);



// Adjusted check-in/out times

    const [checkInTime, setCheckInTime] = useState(formatInitialDateTime(currentDate));

    const [checkOutTime, setCheckOutTime] = useState(formatInitialDateTime(oneHourLater));



    const [duration, setDuration] = useState("1 giờ");

    const [price, setPrice] = useState(initialRoomData?.roomCategory?.hourlyPrice || 180000);

    const [saleChannel, setSaleChannel] = useState("");

    const [priceList, setPriceList] = useState("");

    const [note, setNote] = useState("");



// API integration state variables

    const [loading, setLoading] = useState(false);

    const [roomsLoading, setRoomsLoading] = useState(false);

    const [roomCategories, setRoomCategories] = useState([]);

    const [availableRooms, setAvailableRooms] = useState([]);

    const [selectedRoomCategory, setSelectedRoomCategory] = useState(null);

    const [selectedRoom, setSelectedRoom] = useState(initialRoomData || null);

    const [adultCount, setAdultCount] = useState(initialRoomData?.roomCategory?.standardAdultCapacity || 2);

    const [childCount, setChildCount] = useState(initialRoomData?.roomCategory?.standardChildCapacity || 0);

    const [customerId, setCustomerId] = useState(null);

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [paidAmount, setPaidAmount] = useState(0);

    const [calculatedPrice, setCalculatedPrice] = useState(price);

    const [calculationLoading, setCalculationLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [successMessage, setSuccessMessage] = useState("");

    const [showAlert, setShowAlert] = useState(false);



    const [inforDialogOpen, setInforDialogOpen] = useState(false); // State for BookingDialog



// Date picker visibility

    const [showCheckInDatePicker, setShowCheckInDatePicker] = useState(false);

    const [showCheckInTimePicker, setShowCheckInTimePicker] = useState(false);

    const [showCheckOutDatePicker, setShowCheckOutDatePicker] = useState(false);

    const [showCheckOutTimePicker, setShowCheckOutTimePicker] = useState(false);



// Refs for click outside detection

    const checkInDatePickerRef = useRef(null);

    const checkInTimePickerRef = useRef(null);

    const checkOutDatePickerRef = useRef(null);

    const checkOutTimePickerRef = useRef(null);



// Fetch room categories and available rooms on component mount

    useEffect(() => {

        if (open && !initialRoomData) {

// Chỉ tải danh sách phòng nếu không có dữ liệu phòng ban đầu

            fetchRoomCategories();

        }

    }, [open, initialRoomData]);



// Effect to load initial room data when provided

    useEffect(() => {

        if (open && initialRoomData) {

            console.log('Initial room data received:', initialRoomData);

            console.log('Room ID:', initialRoomData.id);



// Set room type from initial data

            if (initialRoomData.roomCategory && initialRoomData.roomCategory.name) {

                setRoomType(initialRoomData.roomCategory.name);

                setSelectedRoomCategory(initialRoomData.roomCategory);

            }



// Set room number always as P.{ID} format

            if (initialRoomData.id) {

                const formattedRoomNumber = `P.${initialRoomData.id}`;

                setRoomNumber(formattedRoomNumber);

// Also set this as roomNumber property on the initialRoomData for dropdown consistency

                initialRoomData.roomNumber = formattedRoomNumber;

            }



// Set selected room

            setSelectedRoom(initialRoomData);



// Set adult and child count based on room category

            if (initialRoomData.roomCategory) {

                setAdultCount(initialRoomData.roomCategory.standardAdultCapacity || 2);

                setChildCount(initialRoomData.roomCategory.standardChildCapacity || 0);

            }



// Set price based on room category and booking type

            if (initialRoomData.roomCategory) {

                const basePrice = bookingType === 'Giờ'

                    ? initialRoomData.roomCategory.hourlyPrice

                    : bookingType === 'Ngày'

                        ? initialRoomData.roomCategory.dailyPrice

                        : initialRoomData.roomCategory.overnightPrice;



                setPrice(basePrice || 0);

                setCalculatedPrice(basePrice || 0);



// Tạo danh sách phòng chỉ với phòng hiện tại để hiển thị trong dropdown

                setAvailableRooms([initialRoomData]);

            }

        }

    }, [open, initialRoomData, bookingType]);



// Fetch room categories

    const fetchRoomCategories = async () => {

        try {

            setLoading(true);

            const response = await roomService.getRoomCategories({

                status: 'ACTIVE',

                size: 50

            });



            if (response && response.content) {

                setRoomCategories(response.content);



// If initial room data is provided, set the selected room category

                if (initialRoomData && initialRoomData.roomCategory) {

                    const matchingCategory = response.content.find(

                        cat => cat.id === initialRoomData.roomCategory.id

                    );

                    if (matchingCategory) {

                        setSelectedRoomCategory(matchingCategory);

                    }

                }

            }

        } catch (error) {

            console.error('Error fetching room categories:', error);

            setErrorMessage('Không thể tải danh sách loại phòng');

            setShowAlert(true);

        } finally {

            setLoading(false);

        }

    };



// Fetch available rooms based on current parameters

    const fetchAvailableRooms = async () => {

        const rentTypeMapping = {

            'Giờ': 'HOURLY',

            'Ngày': 'DAILY',

            'Đêm': 'OVERNIGHT'

        };



        try {

            setRoomsLoading(true);



// Prepare check-in time

            const checkinDateTime = new Date(checkInDate);

            checkinDateTime.setHours(

                checkInTimeValue.getHours(),

                checkInTimeValue.getMinutes()

            );



// Extract duration from duration state

            const durationMatch = duration.match(/\d+/);

            const durationValue = durationMatch ? parseInt(durationMatch[0], 10) : 1;



// Prepare parameters for API call

            const params = {

                checkinTime: checkinDateTime.toISOString(),

                rentType: rentTypeMapping[bookingType] || 'HOURLY',

                duration: durationValue

            };



// Add categoryId if a category is selected

            if (selectedRoomCategory && selectedRoomCategory.id) {

                params.categoryId = selectedRoomCategory.id;

            }



            const response = await roomService.getAvailableRooms(params);



            if (response && response.content) {

                setAvailableRooms(response.content);



// If we have available rooms and no room is selected yet, select the first one

                if (response.content.length > 0 && !selectedRoom) {

                    setSelectedRoom(response.content[0]);

                    setRoomNumber(response.content[0].roomNumber || 'P.203');

                }

            } else {

                setAvailableRooms([]);

            }

        } catch (error) {

            console.error('Error fetching available rooms:', error);

            setErrorMessage('Không thể tải danh sách phòng khả dụng');

            setShowAlert(true);

        } finally {

            setRoomsLoading(false);

        }

    };



// Simplified price calculation without API call

    const recalculatePrice = () => {

        if (!selectedRoomCategory) return;



// Extract duration from duration state

        const durationMatch = duration.match(/\d+/);

        const durationValue = durationMatch ? parseInt(durationMatch[0], 10) : 1;



// Get base price based on booking type

        let basePrice = 0;

        if (bookingType === 'Giờ') {

            basePrice = selectedRoomCategory.hourlyPrice || 0;

        } else if (bookingType === 'Ngày') {

            basePrice = selectedRoomCategory.dailyPrice || 0;

        } else if (bookingType === 'Đêm') {

            basePrice = selectedRoomCategory.overnightPrice || 0;

        }



// Simple calculation: base price × duration

        const calculatedAmount = basePrice * durationValue;

        setCalculatedPrice(calculatedAmount);

        setPrice(calculatedAmount);

    };



// Effect to recalculate price when relevant parameters change

    useEffect(() => {

        if (selectedRoomCategory && bookingType && duration) {

            recalculatePrice();

        }

    }, [selectedRoomCategory, bookingType, duration, adultCount, childCount]);



// Handle click outside

    useEffect(() => {

        function handleClickOutside(event) {

// Check if click is outside the date/time pickers

            if (showCheckInDatePicker && checkInDatePickerRef.current && !checkInDatePickerRef.current.contains(event.target)) {

                setShowCheckInDatePicker(false);

            }

            if (showCheckInTimePicker && checkInTimePickerRef.current && !checkInTimePickerRef.current.contains(event.target)) {

                setShowCheckInTimePicker(false);

            }

            if (showCheckOutDatePicker && checkOutDatePickerRef.current && !checkOutDatePickerRef.current.contains(event.target)) {

                setShowCheckOutDatePicker(false);

            }

            if (showCheckOutTimePicker && checkOutTimePickerRef.current && !checkOutTimePickerRef.current.contains(event.target)) {

                setShowCheckOutTimePicker(false);

            }

        }



// Add when the component mounts

        document.addEventListener("mousedown", handleClickOutside);

// Return function to be called when unmounted

        return () => {

            document.removeEventListener("mousedown", handleClickOutside);

        };

    }, [showCheckInDatePicker, showCheckInTimePicker, showCheckOutDatePicker, showCheckOutTimePicker]);



    const handleClose = () => {

// Reset form state

        setRoomType(initialRoomData?.roomCategory?.name || "Phòng 01 giường đôi cho 2 người");

        setRoomNumber(initialRoomData?.roomNumber || "P.203");

        setBookingType("Giờ");

        setCheckInDate(currentDate);

        setCheckInTimeValue(currentDate);

        setCheckOutDate(oneHourLater);

        setCheckOutTimeValue(oneHourLater);

        setCheckInTime(formatInitialDateTime(currentDate));

        setCheckOutTime(formatInitialDateTime(oneHourLater));

        setDuration("1 giờ");

        setPrice(initialRoomData?.roomCategory?.hourlyPrice || 180000);

        setSaleChannel("");

        setPriceList("");

        setNote("");

        setCustomerId(null);

        setSelectedCustomer(null);

        setPaidAmount(0);

        setCalculatedPrice(initialRoomData?.roomCategory?.hourlyPrice || 180000);

        setErrorMessage("");

        setSuccessMessage("");

        setShowAlert(false);



        if (onClose) onClose();

    };



// Function to handle opening the BookingDialog

    const handleOpenInforDialog = () => {

        setInforDialogOpen(true);

        console.log("Opening InforDialog to select representative customer");

    };



// Function to handle closing the BookingDialog (data update is handled by callback)

    const handleCloseInforDialog = () => {

        setInforDialogOpen(false);

// No need to receive data here anymore

    };



// Callback function to update customer info from BookingDialog

    const handleCustomerInfoUpdate = (customer, adults, children) => {

        console.log("Received from BookingDialog:", { customer, adults, children });

        if (customer && customer.id) {

            setSelectedCustomer(customer);

            setCustomerId(customer.id);

        } else {

// Handle case where no customer is selected/returned

            setSelectedCustomer(null);

            setCustomerId(null);

            console.warn("No valid customer selected from BookingDialog");

        }

// Update adult/child counts regardless of customer selection

        setAdultCount(adults ?? (initialRoomData?.roomCategory?.standardAdultCapacity || 1)); // Provide default

        setChildCount(children ?? (initialRoomData?.roomCategory?.standardChildCapacity || 0)); // Provide default

    };



// Functions to handle date and time changes

    const handleCheckInDateChange = (newDate) => {

        if (!newDate) return;

        setCheckInDate(newDate);

        updateCheckInTime(newDate, checkInTimeValue);

        updateDuration(newDate, checkInTimeValue, checkOutDate, checkOutTimeValue);

    };



    const handleCheckInTimeChange = (newTime) => {

        if (!newTime) return;

        setCheckInTimeValue(newTime);

        updateCheckInTime(checkInDate, newTime);

        updateDuration(checkInDate, newTime, checkOutDate, checkOutTimeValue);

    };



    const handleCheckOutDateChange = (newDate) => {

        if (!newDate) return;

        setCheckOutDate(newDate);

        updateCheckOutTime(newDate, checkOutTimeValue);

        updateDuration(checkInDate, checkInTimeValue, newDate, checkOutTimeValue);

    };



    const handleCheckOutTimeChange = (newTime) => {

        if (!newTime) return;

        setCheckOutTimeValue(newTime);

        updateCheckOutTime(checkOutDate, newTime);

        updateDuration(checkInDate, checkInTimeValue, checkOutDate, newTime);

    };



// Calculate and update the duration between check-in and check-out

    const updateDuration = (inDate, inTime, outDate, outTime) => {

        if (!inDate || !outDate || !inTime || !outTime) return;



        const startTime = new Date(inDate);

        startTime.setHours(inTime.getHours(), inTime.getMinutes());



        const endTime = new Date(outDate);

        endTime.setHours(outTime.getHours(), outTime.getMinutes());



        const diffMs = endTime - startTime;

        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));



        if (diffHours < 0) {

            setDuration("Thời gian không hợp lệ");

            return;

        }



        if (diffHours <= 24) {

            setDuration(`${diffHours} giờ`);

        } else {

            const days = Math.floor(diffHours / 24);

            const remainingHours = diffHours % 24;

            setDuration(`${days} ngày${remainingHours > 0 ? ` ${remainingHours} giờ` : ''}`);

        }

    };



// Update the displayed check-in time

    const updateCheckInTime = (date, time) => {

        const dateTimeObj = new Date(date);

        const timeObj = new Date(time);



        dateTimeObj.setHours(timeObj.getHours());

        dateTimeObj.setMinutes(timeObj.getMinutes());



// Format using Vietnamese locale

        const day = dateTimeObj.getDate();

        const month = dateTimeObj.getMonth() + 1;

        const hours = dateTimeObj.getHours().toString().padStart(2, '0');

        const minutes = dateTimeObj.getMinutes().toString().padStart(2, '0');



        setCheckInTime(`${day} Thg ${month.toString().padStart(2, '0')}, ${hours}:${minutes}`);

    };



// Update the displayed check-out time

    const updateCheckOutTime = (date, time) => {

        const dateTimeObj = new Date(date);

        const timeObj = new Date(time);



        dateTimeObj.setHours(timeObj.getHours());

        dateTimeObj.setMinutes(timeObj.getMinutes());



// Format using Vietnamese locale

        const day = dateTimeObj.getDate();

        const month = dateTimeObj.getMonth() + 1;

        const hours = dateTimeObj.getHours().toString().padStart(2, '0');

        const minutes = dateTimeObj.getMinutes().toString().padStart(2, '0');



        setCheckOutTime(`${day} Thg ${month.toString().padStart(2, '0')}, ${hours}:${minutes}`);

    };



// Custom Calendar Component

    const SimpleCalendar = ({ selectedDate, onDateChange, onClose }) => {

        const currentDate = new Date();

        const [viewDate, setViewDate] = useState(selectedDate || currentDate);



        const handlePreviousMonth = () => {

            const newDate = new Date(viewDate);

            newDate.setMonth(newDate.getMonth() - 1);

            setViewDate(newDate);

        };



        const handleNextMonth = () => {

            const newDate = new Date(viewDate);

            newDate.setMonth(newDate.getMonth() + 1);

            setViewDate(newDate);

        };



        const handleDateClick = (day) => {

            const newDate = new Date(viewDate);

            newDate.setDate(day);

            onDateChange(newDate);

        };



        const handleTodayClick = () => {

            onDateChange(new Date());

            onClose();

        };



// Get the current month and year

        const monthNames = [

            'Một', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu',

            'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Mười Hai'

        ];

        const month = viewDate.getMonth();

        const year = viewDate.getFullYear();



// Get the number of days in the current month

        const daysInMonth = new Date(year, month + 1, 0).getDate();



// Get the day of the week of the first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

        const firstDayOfMonth = new Date(year, month, 1).getDay();



// Get the day of the week adjusted for starting the week on Monday (0 = Monday, 1 = Tuesday, ..., 6 = Sunday)

        const firstDayAdjusted = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;



// Get the number of days in the previous month

        const daysInPrevMonth = new Date(year, month, 0).getDate();



// Create calendar grid

        const calendarDays = [];



// Add days from previous month

        for (let i = 0; i < firstDayAdjusted; i++) {

            calendarDays.push({

                day: daysInPrevMonth - firstDayAdjusted + i + 1,

                isCurrentMonth: false,

                isPrevMonth: true

            });

        }



// Add days from current month

        for (let i = 1; i <= daysInMonth; i++) {

            calendarDays.push({

                day: i,

                isCurrentMonth: true,

                isToday: i === currentDate.getDate() &&

                    month === currentDate.getMonth() &&

                    year === currentDate.getFullYear(),

                isSelected: i === selectedDate.getDate() &&

                    month === selectedDate.getMonth() &&

                    year === selectedDate.getFullYear()

            });

        }



// Add days from next month

        const totalDays = 42; // 6 rows of 7 days

        const remainingDays = totalDays - calendarDays.length;

        for (let i = 1; i <= remainingDays; i++) {

            calendarDays.push({

                day: i,

                isCurrentMonth: false,

                isNextMonth: true

            });

        }



// Group calendar days into rows

        const calendarRows = [];

        for (let i = 0; i < calendarDays.length; i += 7) {

            calendarRows.push(calendarDays.slice(i, i + 7));

        }



        return (

            <Box sx={{

                width: 320,

                p: 1,

                bgcolor: 'background.paper',

                boxShadow: 3,

                borderRadius: 1,

                overflow: 'hidden'

            }}>

                {/* Calendar header */}

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, px: 1 }}>

                    <IconButton size="small" onClick={handlePreviousMonth}>

                        <ChevronLeft />

                    </IconButton>

                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>

                        Tháng {monthNames[month]} {year}

                    </Typography>

                    <IconButton size="small" onClick={handleNextMonth}>

                        <ChevronRight />

                    </IconButton>

                </Box>



                {/* Calendar weekday headers */}

                <Grid container spacing={0.5} sx={{ mb: 1 }}>

                    {['H', 'B', 'T', 'N', 'S', 'B', 'C'].map((day, index) => (

                        <Grid item xs={12/7} key={index}>

                            <Typography

                                align="center"

                                variant="caption"

                                sx={{ color: 'text.secondary', fontWeight: 'medium' }}

                            >

                                {day}

                            </Typography>

                        </Grid>

                    ))}

                </Grid>



                {/* Calendar days */}

                {calendarRows.map((row, rowIndex) => (

                    <Grid container spacing={0.5} key={rowIndex} sx={{ mb: 0.5 }}>

                        {row.map((dayInfo, colIndex) => (

                            <Grid item xs={12/7} key={colIndex}>

                                <ButtonBase

                                    sx={{

                                        width: 36,

                                        height: 36,

                                        borderRadius: '50%',

                                        margin: '0 auto',

                                        display: 'flex',

                                        justifyContent: 'center',

                                        alignItems: 'center',

                                        transition: 'all 0.2s',

                                        bgcolor: dayInfo.isSelected ? 'success.main' : 'transparent',

                                        color: (() => {

                                            if (dayInfo.isSelected) return 'white';

                                            if (!dayInfo.isCurrentMonth) return 'text.disabled';

                                            if (dayInfo.isToday) return 'success.main';

                                            return 'text.primary';

                                        })(),

                                        fontWeight: dayInfo.isToday || dayInfo.isSelected ? 'bold' : 'normal',

                                        '&:hover': {

                                            bgcolor: dayInfo.isSelected ? 'success.main' : 'action.hover'

                                        }

                                    }}

                                    onClick={() => dayInfo.isCurrentMonth && handleDateClick(dayInfo.day)}

                                    disabled={!dayInfo.isCurrentMonth}

                                >

                                    <Typography variant="body2">

                                        {dayInfo.day}

                                    </Typography>

                                </ButtonBase>

                            </Grid>

                        ))}

                    </Grid>

                ))}



                {/* Today button */}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>

                    <Button

                        variant="text"

                        size="small"

                        onClick={handleTodayClick}

                        sx={{ color: 'success.main', textTransform: 'none' }}

                    >

                        Về giờ hiện tại

                    </Button>

                </Box>

            </Box>

        );

    };



// Simple Time Picker Component

    const SimpleTimePicker = ({ selectedTime, onTimeChange, onClose }) => {

// Tạo danh sách các thời gian theo khoảng 30 phút

        const timeSlots = [];

        for (let hour = 0; hour < 24; hour++) {

            timeSlots.push({

                hour,

                minute: 0,

                label: `${hour.toString().padStart(2, '0')}:00`

            });

            timeSlots.push({

                hour,

                minute: 30,

                label: `${hour.toString().padStart(2, '0')}:30`

            });

        }



        const handleTimeSelect = (hour, minute) => {

            const newDate = selectedTime ? new Date(selectedTime) : new Date();

            newDate.setHours(hour);

            newDate.setMinutes(minute);

            onTimeChange(newDate);

            onClose();

        };



        return (

            <Box

                sx={{

                    width: 100,

                    maxHeight: 250,

                    overflowY: 'auto',

                    bgcolor: 'background.paper',

                    boxShadow: 3,

                    borderRadius: 1,

                    '&::-webkit-scrollbar': {

                        width: '8px',

                    },

                    '&::-webkit-scrollbar-track': {

                        background: '#f1f1f1',

                        borderRadius: '4px',

                    },

                    '&::-webkit-scrollbar-thumb': {

                        background: '#ccc',

                        borderRadius: '4px',

                    },

                    '&::-webkit-scrollbar-thumb:hover': {

                        background: '#aaa',

                    }

                }}

            >

                {timeSlots.map((slot, index) => (

                    <ButtonBase

                        key={index}

                        onClick={() => handleTimeSelect(slot.hour, slot.minute)}

                        sx={{

                            width: '100%',

                            py: 1,

                            textAlign: 'center',

                            borderBottom: index < timeSlots.length - 1 ? '1px solid #f0f0f0' : 'none',

                            '&:hover': {

                                bgcolor: 'action.hover'

                            }

                        }}

                    >

                        <Typography variant="body2">{slot.label}</Typography>

                    </ButtonBase>

                ))}

            </Box>

        );

    };



// Handle room booking using walk-in endpoint
    const handleRoomBooking = async (isCheckIn = false) => {
// Validate required data
        if (!selectedRoom || !selectedRoom.id) {
            setErrorMessage('Vui lòng chọn phòng');
            setShowAlert(true);
            return;
        }

        if (!customerId) {
            setErrorMessage('Vui lòng chọn khách hàng hoặc thêm khách mới');
            setShowAlert(true);
            return;
        }

        const rentTypeMapping = {
            'Giờ': 'HOURLY',
            'Ngày': 'DAILY',
            'Đêm': 'OVERNIGHT'
        };

        try {
            setLoading(true);
            setErrorMessage('');
            setSuccessMessage('');

// Prepare check-in time
            const checkinDateTime = new Date(checkInDate);
            checkinDateTime.setHours(
                checkInTimeValue.getHours(),
                checkInTimeValue.getMinutes()
            );

// Cho phép đặt phòng tại thời điểm hiện tại hoặc tương lai
            const now = new Date();
            
            // Chỉ từ chối nếu thời gian nhận phòng là quá khứ rõ ràng (cách hiện tại ít nhất 1 phút)
            const pastThreshold = new Date(now.getTime() - 60000); // Trừ 1 phút từ thời gian hiện tại
            
            if (checkinDateTime < pastThreshold) {
                setErrorMessage('Thời gian nhận phòng không được trong quá khứ.');
                setShowAlert(true);
                setLoading(false);
                return;
            }

// Extract duration from duration state
            const durationMatch = duration.match(/\d+/);
            const durationValue = durationMatch ? parseInt(durationMatch[0], 10) : 1;

// Create booking request payload (WalkInRequestDTO)
            const walkInRequest = {
                customerId: customerId,
                note: note,
                paidAmount: paidAmount,
                rooms: [
                    {
                        roomId: selectedRoom.id,
                        checkinTime: convertTimeVi(checkinDateTime),
                        adultCount: adultCount,
                        childCount: childCount,
                        rentType: rentTypeMapping[bookingType] || 'HOURLY',
                        duration: durationValue
                    }
                ]
            };


            console.log("Sending Walk-in Request:", walkInRequest);

            let response;
            let bookingId;

// Call API to create walk-in booking
            if (!isCheckIn) {
                // Normal booking mode
                response = await checkinService.createWalkInBooking(walkInRequest);
                console.log("Walk-in Response:", response);
                
                if (response && response.booking && response.booking.bookingId) {
                    bookingId = response.booking.bookingId;
                    setSuccessMessage('Đặt phòng thành công!');
                    setShowAlert(true);
                } else {
                    throw new Error(response?.status || 'Không nhận được phản hồi đặt phòng hợp lệ từ máy chủ');
                }
            } else {
                // Check-in mode: First create booking then immediately check in
                response = await checkinService.createWalkInBooking(walkInRequest);
            console.log("Walk-in Response:", response);

            if (response && response.booking && response.booking.bookingId) {
                    bookingId = response.booking.bookingId;
                    
                    // Perform immediate check-in using the new API
                    const checkinData = {
                        bookingId: bookingId,
                        roomIdsToCheckin: [selectedRoom.id]
                    };
                    
                    console.log("Sending Check-in Request:", checkinData);
                    const checkinResponse = await checkinService.performCheckin(checkinData);
                    console.log("Check-in Response:", checkinResponse);

                    setSuccessMessage('Nhận phòng thành công!');
                setShowAlert(true);
                } else {
                    throw new Error(response?.status || 'Không nhận được phản hồi đặt phòng hợp lệ từ máy chủ');
                }
            }

// Close dialog after delay, passing booking data
                setTimeout(() => {
                    if (onClose) onClose(response.booking); // Pass the full booking object
                }, 1500);

            // Update the SchematicView
            handleUpdateLoading();
        } catch (error) {
            console.error('Error creating booking or checking in:', error);
// Extract meaningful error message from Axios error or default
            const apiErrorMessage = error.response?.data?.status || error.response?.data?.message || error.message;
            setErrorMessage(apiErrorMessage || 'Đã xảy ra lỗi khi tạo đặt phòng/nhận phòng');
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };



// Function to set check-in time to current system time

    const handleSetCurrentTime = () => {
        const now = new Date();
        
        // Thêm 1 phút vào thời gian hiện tại để đảm bảo server chấp nhận
        const nowPlusOneMinute = new Date(now.getTime() + 60000);

        // Set check-in DATE and TIME to current time + 1 minute
        setCheckInDate(nowPlusOneMinute);
        setCheckInTimeValue(nowPlusOneMinute);
        updateCheckInTime(nowPlusOneMinute, nowPlusOneMinute);

        // Set check-out time to (current time + 1 minute) + 1 hour = current time + 61 minutes
        const oneHourLater = new Date(nowPlusOneMinute.getTime() + 60 * 60 * 1000);
        setCheckOutDate(oneHourLater);
        setCheckOutTimeValue(oneHourLater);
        updateCheckOutTime(oneHourLater, oneHourLater);

        // Update duration calculation
        updateDuration(nowPlusOneMinute, nowPlusOneMinute, oneHourLater, oneHourLater);

        console.log("Set check-in time to current system time + 1 minute:", nowPlusOneMinute);
        console.log("Set check-out time to one hour later:", oneHourLater);
    };



    return (

// Changed maxWidth to "xl" for a wider dialog

        <Dialog open={Boolean(open)} onClose={handleClose} maxWidth="xl" fullWidth>

            {/* Header */}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2, borderBottom: '1px solid #e0e0e0' }}>

                <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>

                    Đặt/Nhận phòng nhanh - P.{selectedRoom?.id || ''}

                    {selectedRoom?.roomCategory?.name && ` (${selectedRoom.roomCategory.name})`}

                </Typography>

                <IconButton onClick={handleClose} size="small"><Close /></IconButton>

            </Box>



            <DialogContent sx={{ p: 4 }}>

                {/* Customer Info Display Area */}

                <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>

                    <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1 }}>

                        Thông tin khách đại diện:

                    </Typography>

                    {selectedCustomer ? (

                        <Grid container spacing={1}>

                            <Grid item xs={12}>

                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#00695c' }}>

                                    {selectedCustomer.fullName || 'Không có tên'}

                                </Typography>

                            </Grid>

                            <Grid item xs={12} sm={6}>

                                <Typography variant="caption" display="block" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>

                                    <strong>SĐT:</strong> {selectedCustomer.phone || '-'}

                                </Typography>

                                <Typography variant="caption" display="block" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>

                                    <strong>Email:</strong> {selectedCustomer.email || '-'}

                                </Typography>

                            </Grid>

                            <Grid item xs={12} sm={6}>

                                <Typography variant="caption" display="block" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>

                                    <strong>CCCD/Hộ chiếu:</strong> {selectedCustomer.idCard || '-'}

                                </Typography>

                                <Typography variant="caption" display="block" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>

                                    <strong>Quốc tịch:</strong> {selectedCustomer.nationality || 'Việt Nam'}

                                </Typography>

                            </Grid>

                        </Grid>

                    ) : (

                        <Box sx={{ textAlign: 'center', py: 1 }}>

                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>

                                Chưa chọn khách hàng

                            </Typography>

                            <Button

                                variant="text"

                                onClick={handleOpenInforDialog}

                                sx={{

                                    color: '#00695c',

                                    textTransform: 'none',

                                    mt: 1,

                                    fontSize: '0.85rem'

                                }}

                            >

                                Nhấn vào đây để chọn khách đại diện

                            </Button>

                        </Box>

                    )}

                </Box>



                {/* Controls + Summary */}

                <Box display="flex" alignItems="center" mb={4} flexWrap="wrap">

                    {/* Compact Summary Section - Now opens BookingDialog */}

                    <Box

                        display="flex"

                        alignItems="center"

                        gap={1.5}

                        ml={{ xs: 0, sm: 3 }}

                        mt={{ xs: 2, sm: 0 }}

                        px={1.5}

                        py={0.5}

                        border="1px solid #ccc"

                        borderRadius="20px"

                        sx={{

                            flexShrink: 0,

                            cursor: 'pointer',

                            '&:hover': {

                                backgroundColor: '#f5f5f5',

                                borderColor: '#999'

                            }

                        }}

                        onClick={handleOpenInforDialog}

                    >

                        {/* Số người */}

                        <Box display="flex" alignItems="center" gap={0.5}>

                            <People sx={{ color: 'gray', fontSize: 20 }} />

                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{adultCount}</Typography>

                        </Box>

                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                        {/* Số trẻ em (Use Hotel icon as per previous code, though confusing) */}

                        <Box display="flex" alignItems="center" gap={0.5}>

                            <Hotel sx={{ color: 'gray', fontSize: 20 }} />

                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{childCount}</Typography>

                        </Box>

                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                        {/* Số phòng (Hardcoded 1 for now) */}

                        <Box display="flex" alignItems="center" gap={0.5}>

                            <Room sx={{ color: 'gray', fontSize: 20 }} />

                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>1</Typography>

                        </Box>

                    </Box>

                    {/* End Compact Summary Section */}



                    {/* Original Controls (Walk icon, Sale Channel, Price List) */}

                    <Box display="flex" alignItems="center" gap={2} ml={3}>

                        <IconButton size="small" sx={{ p: 0.5 }}><DirectionsWalk sx={{ fontSize: 20 }} /></IconButton>

                        <FormControl size="small" sx={{ minWidth: 120 }}>

                            <InputLabel id="sale-channel-label" sx={{ fontSize: '0.85rem' }}>Mã kênh bán</InputLabel>

                            <Select

                                labelId="sale-channel-label"

                                value={saleChannel}

                                label="Mã kênh bán"

                                onChange={e => setSaleChannel(e.target.value)}

                                sx={{ height: '38px', fontSize: '0.85rem' }}

                            >

                                <MenuItem value="">Mã kênh bán</MenuItem>

                            </Select>

                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 140 }}>

                            <InputLabel id="price-list-label" sx={{ fontSize: '0.85rem' }}>Bảng giá chung</InputLabel>

                            <Select

                                labelId="price-list-label"

                                value={priceList}

                                label="Bảng giá chung"

                                onChange={e => setPriceList(e.target.value)}

                                sx={{ height: '38px', fontSize: '0.85rem' }}

                            >

                                <MenuItem value="">Bảng giá chung</MenuItem>

                            </Select>

                        </FormControl>

                    </Box>

                </Box>



                {/* Wrap entire content with LocalizationProvider */}

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>

                    {/* Room Information Section - Adjusted for alignment and spacing */}

                    <Paper elevation={0} sx={{ p: 2, mb: 4, backgroundColor: '#f7fcf7', border: '1px solid #e8f5e9', borderRadius: '8px' }}>

                        {/* Header Row - Using flex properties for column distribution */}

                        <Box sx={{ display: 'flex', mb: 2, backgroundColor: '#e8f5e9', p: '10px', borderRadius: '8px', alignItems: 'center', gap: 2 }}>

                            {/* Column Headers - Using flex properties */}

                            <Box sx={{ flex: '2 0 0', flexShrink: 0 }}>

                                <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#2e7d32' }}>Hạng phòng</Typography>

                            </Box>

                            <Box sx={{ flex: '1 0 0', flexShrink: 0 }}>

                                <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#2e7d32', display: 'flex', alignItems: 'center' }}>

                                    Phòng

                                    <Box component="span" sx={{ bgcolor: 'green', color: 'white', borderRadius: '50%', px: 0.7, py: 0.1, ml: 0.5, fontSize: '0.65rem', height: '18px', width: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'normal' }}>1</Box>

                                </Typography>

                            </Box>

                            <Box sx={{ flex: '1 0 0', flexShrink: 0 }}>

                                <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#2e7d32' }}>Hình thức</Typography>

                            </Box>

                            <Box sx={{ flex: '2 0 0', flexShrink: 0, display: 'flex', alignItems: 'center' }}>

                                <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#2e7d32', mr: 1 }}>Nhận</Typography>

                                <Box sx={{ display: 'flex', gap: 1 }}>

                                    <Box

                                        sx={{

                                            bgcolor: '#1976d2',

                                            color: 'white',

                                            borderRadius: '16px',

                                            px: 1,

                                            py: 0.3,

                                            fontSize: '0.7rem',

                                            height: '20px',

                                            display: 'flex',

                                            alignItems: 'center',

                                            fontWeight: 'medium',

                                            cursor: 'pointer',

                                            '&:hover': {

                                                bgcolor: '#0d5eaf',

                                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'

                                            }

                                        }}

                                        onClick={handleSetCurrentTime}

                                    >

                                        HIỆN TẠI

                                    </Box>

                                    <Box

                                        sx={{

                                            border: '1px solid #2e7d32',

                                            color: '#2e7d32',

                                            borderRadius: '16px',

                                            px: 1,

                                            py: 0.3,

                                            fontSize: '0.7rem',

                                            height: '20px',

                                            display: 'flex',

                                            alignItems: 'center',

                                            fontWeight: 'medium',

                                            cursor: 'pointer',

                                            '&:hover': {

                                                bgcolor: 'rgba(46, 125, 50, 0.04)',

                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'

                                            }

                                        }}

                                    >

                                        QUY ĐỊNH

                                    </Box>

                                </Box>

                            </Box>

                            <Box sx={{ flex: '1.5 0 0', flexShrink: 0 }}>

                                <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#2e7d32' }}>Trả phòng</Typography>

                            </Box>

                            <Box sx={{ flex: '1 0 0', flexShrink: 0, textAlign: 'center' }}>

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

                                <FormControl fullWidth size="small">

                                    <Select

                                        value={roomType}

                                        onChange={(e) => {

                                            setRoomType(e.target.value);

                                            const selectedCategory = roomCategories.find(cat => cat.name === e.target.value);

                                            if (selectedCategory) {

                                                setSelectedRoomCategory(selectedCategory);

                                                fetchAvailableRooms();

                                            }

                                        }}

                                        sx={{ height: '38px', borderRadius: '8px', fontSize: '0.85rem' }}

                                        disabled={loading || roomsLoading}

                                    >

                                        {roomCategories.map((category) => (

                                            <MenuItem key={category.id} value={category.name}>

                                                {category.name}

                                            </MenuItem>

                                        ))}

                                        {roomCategories.length === 0 && (

                                            <MenuItem value={roomType}>{roomType}</MenuItem>

                                        )}

                                    </Select>

                                </FormControl>

                            </Box>

                            {/* Phòng - Use flex properties for flexibility */}

                            <Box sx={{ flex: '1 1 0', flexShrink: 0 }}> {/* flex-grow 1, can shrink, basis 0 */}

                                <FormControl fullWidth size="small">

                                    <Select

                                        value={roomNumber}

                                        onChange={(e) => {

                                            setRoomNumber(e.target.value);

                                            const roomId = e.target.value.replace('P.', '');

                                            const selected = availableRooms.find(room => room.id.toString() === roomId);

                                            if (selected) {

                                                setSelectedRoom(selected);

                                                console.log("Selected room ID:", selected.id);

                                            }

                                        }}

                                        sx={{ height: '38px', borderRadius: '8px', fontSize: '0.85rem' }}

                                        disabled={loading || roomsLoading}

                                        displayEmpty

                                        renderValue={(selected) => {

                                            return selected || (selectedRoom ? `P.${selectedRoom.id}` : 'Chọn phòng');

                                        }}

                                    >

                                        {availableRooms.map((room) => (

                                            <MenuItem key={room.id} value={`P.${room.id}`}>

                                                P.{room.id}

                                            </MenuItem>

                                        ))}

                                        {availableRooms.length === 0 && (

                                            <MenuItem value={roomNumber}>{roomNumber}</MenuItem>

                                        )}

                                    </Select>

                                </FormControl>

                                {roomsLoading && (

                                    <CircularProgress

                                        size={16}

                                        sx={{

                                            position: 'absolute',

                                            right: '30px',

                                            top: '50%',

                                            marginTop: '-8px'

                                        }}

                                    />

                                )}

                            </Box>

                            {/* Hình thức - Use flex properties for flexibility */}

                            <Box sx={{ flex: '1 1 0', flexShrink: 0 }}> {/* flex-grow 1, can shrink, basis 0 */}

                                <FormControl fullWidth size="small">

                                    <Select

                                        value={bookingType}

                                        onChange={(e) => {

                                            setBookingType(e.target.value);

// Update duration based on booking type

                                            if (e.target.value === 'Giờ') {

                                                setDuration('1 giờ');

                                            } else if (e.target.value === 'Ngày') {

                                                setDuration('1 ngày');

                                            } else if (e.target.value === 'Đêm') {

                                                setDuration('1 đêm');

                                            }



// Recalculate price immediately for better UX

                                            if (selectedRoomCategory) {

                                                let basePrice = 0;

                                                if (e.target.value === 'Giờ') {

                                                    basePrice = selectedRoomCategory.hourlyPrice || 0;

                                                } else if (e.target.value === 'Ngày') {

                                                    basePrice = selectedRoomCategory.dailyPrice || 0;

                                                } else if (e.target.value === 'Đêm') {

                                                    basePrice = selectedRoomCategory.overnightPrice || 0;

                                                }

                                                setPrice(basePrice);

                                                setCalculatedPrice(basePrice);

                                            }

                                        }}

                                        sx={{ height: '38px', borderRadius: '8px', fontSize: '0.85rem' }}

                                        disabled={loading}

                                    >

                                        <MenuItem value="Giờ">Giờ</MenuItem>

                                        <MenuItem value="Ngày">Ngày</MenuItem>

                                        <MenuItem value="Đêm">Đêm</MenuItem>

                                    </Select>

                                </FormControl>

                            </Box>

                            {/* Nhận - Use flex properties for flexibility */}

                            <Box sx={{ flex: '2 1 0', flexShrink: 0, position: 'relative' }}> {/* flex-grow 2, can shrink, basis 0 */}

                                <OutlinedInput

                                    fullWidth

                                    size="small"

                                    value={checkInTime}

                                    onChange={e => setCheckInTime(e.target.value)}

                                    sx={{ height: '38px', borderRadius: '8px', fontSize: '0.85rem' }}

                                    endAdornment={

                                        <InputAdornment position="end">

                                            <IconButton

                                                size="small"

                                                sx={{ p: '4px' }}

                                                onClick={() => setShowCheckInDatePicker(true)}

                                            >

                                                <CalendarMonth fontSize="small" sx={{ fontSize: 18 }} />

                                            </IconButton>

                                            <IconButton

                                                size="small"

                                                sx={{ p: '4px' }}

                                                onClick={() => setShowCheckInTimePicker(true)}

                                            >

                                                <AccessTime fontSize="small" sx={{ fontSize: 18 }} />

                                            </IconButton>

                                        </InputAdornment>

                                    }

                                />



                                {/* Date Picker Popper */}

                                {showCheckInDatePicker && (

                                    <Box

                                        ref={checkInDatePickerRef}

                                        sx={{

                                            position: 'absolute',

                                            zIndex: 1300,

                                            bgcolor: 'background.paper',

                                            boxShadow: 3,

                                            borderRadius: 1,

                                            mt: 1

                                        }}

                                    >

                                        <SimpleCalendar

                                            selectedDate={checkInDate}

                                            onDateChange={(newDate) => {

                                                handleCheckInDateChange(newDate);

                                                setShowCheckInDatePicker(false);

                                            }}

                                            onClose={() => setShowCheckInDatePicker(false)}

                                        />

                                    </Box>

                                )}



                                {/* Time Picker Popper */}

                                {showCheckInTimePicker && (

                                    <Box

                                        ref={checkInTimePickerRef}

                                        sx={{

                                            position: 'absolute',

                                            zIndex: 1300,

                                            bgcolor: 'background.paper',

                                            boxShadow: 3,

                                            borderRadius: 1,

                                            mt: 1

                                        }}

                                    >

                                        <SimpleTimePicker

                                            selectedTime={checkInTimeValue}

                                            onTimeChange={(newTime) => {

                                                handleCheckInTimeChange(newTime);

                                                setShowCheckInTimePicker(false);

                                            }}

                                            onClose={() => setShowCheckInTimePicker(false)}

                                        />

                                    </Box>

                                )}

                            </Box>

                            {/* Trả phòng - Use flex properties for flexibility */}

                            <Box sx={{ flex: '1.5 1 0', flexShrink: 0, position: 'relative' }}> {/* flex-grow 1.5, can shrink, basis 0 */}

                                <OutlinedInput

                                    fullWidth

                                    size="small"

                                    value={checkOutTime}

                                    onChange={e => setCheckOutTime(e.target.value)}

                                    sx={{ height: '38px', borderRadius: '8px', fontSize: '0.85rem' }}

                                    endAdornment={

                                        <InputAdornment position="end">

                                            <IconButton

                                                size="small"

                                                sx={{ p: '4px' }}

                                                onClick={() => setShowCheckOutDatePicker(true)}

                                            >

                                                <CalendarMonth fontSize="small" sx={{ fontSize: 18 }} />

                                            </IconButton>

                                            <IconButton

                                                size="small"

                                                sx={{ p: '4px' }}

                                                onClick={() => setShowCheckOutTimePicker(true)}

                                            >

                                                <AccessTime fontSize="small" sx={{ fontSize: 18 }} />

                                            </IconButton>

                                        </InputAdornment>

                                    }

                                />



                                {/* Date Picker Popper */}

                                {showCheckOutDatePicker && (

                                    <Box

                                        ref={checkOutDatePickerRef}

                                        sx={{

                                            position: 'absolute',

                                            zIndex: 1300,

                                            bgcolor: 'background.paper',

                                            boxShadow: 3,

                                            borderRadius: 1,

                                            mt: 1

                                        }}

                                    >

                                        <SimpleCalendar

                                            selectedDate={checkOutDate}

                                            onDateChange={(newDate) => {

                                                handleCheckOutDateChange(newDate);

                                                setShowCheckOutDatePicker(false);

                                            }}

                                            onClose={() => setShowCheckOutDatePicker(false)}

                                        />

                                    </Box>

                                )}



                                {/* Time Picker Popper */}

                                {showCheckOutTimePicker && (

                                    <Box

                                        ref={checkOutTimePickerRef}

                                        sx={{

                                            position: 'absolute',

                                            zIndex: 1300,

                                            bgcolor: 'background.paper',

                                            boxShadow: 3,

                                            borderRadius: 1,

                                            mt: 1

                                        }}

                                    >

                                        <SimpleTimePicker

                                            selectedTime={checkOutTimeValue}

                                            onTimeChange={(newTime) => {

                                                handleCheckOutTimeChange(newTime);

                                                setShowCheckOutTimePicker(false);

                                            }}

                                            onClose={() => setShowCheckOutTimePicker(false)}

                                        />

                                    </Box>

                                )}

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

                </LocalizationProvider>



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

                        <Typography color="green" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>

                            {price.toLocaleString()} VNĐ

                        </Typography> {/* Added currency */}

                    </Box>

                    <Divider />

                    <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>

                        <Box display="flex" alignItems="center">

                            <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>Khách thanh toán</Typography> {/* Adjusted font size */}

                            <CreditCard fontSize="small" sx={{ ml: 1, color: 'green' }} /> {/* Adjusted icon size */}

                        </Box>

                        <TextField

                            value={paidAmount}

                            onChange={(e) => {

// Only allow numbers

                                const value = e.target.value.replace(/[^0-9]/g, '');

                                setPaidAmount(parseInt(value || 0, 10));

                            }}

                            size="small"

                            sx={{

                                width: '150px',

                                '& input': { textAlign: 'right', fontSize: '0.9rem' }

                            }}

                            InputProps={{

                                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,

                            }}

                        />

                    </Box>

                </Paper>

            </DialogContent>



            {/* Footer Actions */}

            <DialogActions sx={{ px: 4, pb: 4, justifyContent: 'flex-end', gap: 2 }}> {/* Adjusted gap */}

                <Button

                    variant="outlined"

                    sx={{ textTransform: 'none', minWidth: '120px', borderRadius: '16px', fontSize: '0.9rem' }}

                    onClick={handleClose}

                    disabled={loading}

                >

                    Hủy

                </Button>

                <Button

                    variant="contained"

                    color="success"

                    sx={{ textTransform: 'none', minWidth: '120px', borderRadius: '16px', fontSize: '0.9rem' }}

                    onClick={() => handleRoomBooking(true)}

                    disabled={loading}

                >

                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Nhận phòng'}


                </Button>

                <Button

                    variant="contained"

                    sx={{

                        bgcolor: 'orange',

                        '&:hover': { bgcolor: '#e65100' },

                        textTransform: 'none',

                        minWidth: '120px',

                        borderRadius: '16px',

                        fontSize: '0.9rem'

                    }}

                    onClick={() => handleRoomBooking(false)}

                    disabled={loading}

                >

                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Đặt trước'}

                </Button>

            </DialogActions>



            {/* BookingDialog Dialog */}

            {inforDialogOpen && <BookingDialog

                open={inforDialogOpen}

                handleClose={handleCloseInforDialog}

                onUpdateCustomerInfo={handleCustomerInfoUpdate}

            />}



            {/* Alert notifications */}

            <Snackbar

                open={showAlert && errorMessage}

                autoHideDuration={6000}

                onClose={() => {

                    setShowAlert(false);

                    setErrorMessage('');

                }}

                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}

            >

                <Alert

                    onClose={() => {

                        setShowAlert(false);

                        setErrorMessage('');

                    }}

                    severity="error"

                    sx={{ width: '100%' }}

                >

                    {errorMessage}

                </Alert>

            </Snackbar>



            <Snackbar

                open={showAlert && successMessage}

                autoHideDuration={3000}

                onClose={() => {

                    setShowAlert(false);

                    setSuccessMessage('');

                }}

                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}

            >

                <Alert

                    onClose={() => {

                        setShowAlert(false);

                        setSuccessMessage('');

                    }}

                    severity="success"

                    sx={{ width: '100%' }}

                >

                    {successMessage}

                </Alert>

            </Snackbar>

        </Dialog>

    );

};



export default QuickBookingDialog;