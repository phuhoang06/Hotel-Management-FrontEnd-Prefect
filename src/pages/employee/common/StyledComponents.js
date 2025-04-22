import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: 10, // Giảm borderRadius từ 20 xuống 10
    backgroundColor: '#ffffff', // Đặt màu nền trắng (đã được override trong SearchBar)
    border: '1px solid #e0e0e0', // Thêm viền nhẹ
    '&:hover': {
        backgroundColor: '#f5f5f5', // Màu nền khi hover
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 1.5), // Điều chỉnh padding để biểu tượng căn giữa
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: '#3c3c3c', // Màu chữ xám đậm
    width: '100%', // Đảm bảo ô nhập liệu chiếm toàn bộ chiều rộng
    '& .MuiInputBase-input': {
        padding: theme.spacing(0.9, 1.2, 0.9, 0),
        paddingLeft: `calc(1em + ${theme.spacing(3)})`, // Khoảng cách bên trái để chứa biểu tượng tìm kiếm
        paddingRight: `calc(1em + ${theme.spacing(3)})`, // Khoảng cách bên phải để chứa biểu tượng lọc
        transition: theme.transitions.create('width'),
        width: '100%', // Ô nhập liệu chiếm toàn bộ chiều rộng
        fontSize: '0.8rem', // Kích thước chữ nhỏ
        border: 'none', // Xóa viền bên trong
        '&::placeholder': {
            fontSize: '0.8rem', // Kích thước chữ placeholder
            color: '#666', // Màu placeholder
        },
    },
}));