import React from 'react';
import { Button, Box, Typography, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlockIcon from '@mui/icons-material/Block';

/**
 * Trang hiển thị khi người dùng không có quyền truy cập
 * @returns {JSX.Element} Trang Forbidden
 */
const Forbidden = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center', borderRadius: 2 }}>
        <BlockIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Truy cập bị từ chối
    </Typography>
        <Box sx={{ height: 4, width: 60, bgcolor: 'error.main', mx: 'auto', mb: 3 }} />
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ với quản trị viên nếu bạn cho rằng đây là lỗi.
    </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleGoBack}
            sx={{ minWidth: 120 }}
          >
            Quay lại
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleGoHome}
            sx={{ minWidth: 120 }}
          >
            Về trang chủ
          </Button>
        </Box>
      </Paper>
  </Container>
);
};

export default Forbidden;
