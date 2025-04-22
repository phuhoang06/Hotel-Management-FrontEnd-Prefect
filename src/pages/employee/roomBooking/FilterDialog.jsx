import React from 'react';
import {
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    List,
    ListItemButton,
    ListItemText,
    Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FilterTransition } from '../common/Transitions';

export default function FilterDialog({ open, onClose }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={FilterTransition}
            sx={{
                '& .MuiDialog-paper': {
                    width: '40.00%',
                    maxWidth: 'none',
                    height: '100%',
                    margin: 0,
                    position: 'fixed',
                    right: 0,
                    borderRadius: 0,
                    boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
                },
            }}
        >
            <AppBar sx={{ position: 'relative', backgroundColor: '#1976d2' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Bộ lọc
                    </Typography>
                    <Button autoFocus color="inherit" onClick={onClose}>
                        Lưu
                    </Button>
                </Toolbar>
            </AppBar>
            <List>
                <ListItemButton>
                    <ListItemText primary="Trạng thái phòng" secondary="Trống" />
                </ListItemButton>
                <Divider />
                <ListItemButton>
                    <ListItemText primary="Loại phòng" secondary="VIP" />
                </ListItemButton>
                <Divider />
                <ListItemButton>
                    <ListItemText primary="Giá phòng" secondary="Dưới 1 triệu" />
                </ListItemButton>
                <Divider />
                <ListItemButton>
                    <ListItemText primary="Tầng" secondary="Tầng 5" />
                </ListItemButton>
            </List>
        </Dialog>
    );
}