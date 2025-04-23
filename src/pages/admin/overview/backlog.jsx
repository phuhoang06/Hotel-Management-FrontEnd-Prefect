import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, List, ListItem, ListItemAvatar,
  ListItemText, Avatar, Divider, CircularProgress
} from '@mui/material';
import LogService from '../../../service/admin/log.service.js';
import ReceiptIcon from '@mui/icons-material/Receipt';

function Backlog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await LogService.getAllLogs();
      let data = response.data;
      const parseDateTime = log => {
        const [day, month, year] = log.date.split('-');
        return new Date(`${year}-${month}-${day}T${log.time}`);
      };
      data.sort((a, b) => parseDateTime(b) - parseDateTime(a));
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Avatar color mapping based on username
  const getUserColor = user => {
    const colors = ['#00BCD4','#03A9F4','#2196F3','#1976D2','#009688','#4CAF50','#FF9800','#FF5722'];
    let code = 0;
    for (let i = 0; i < user.length; i++) code += user.charCodeAt(i);
    return colors[code % colors.length];
  };

  return (
    <Box p={0}>
  <Card sx={{ width: '100%', height: 700, display: 'flex', flexDirection: 'column', overflow: 'hidden' ,  borderRadius: 3, boxShadow: 3 }}>
    <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        CÁC HOẠT ĐỘNG GẦN ĐÂY
      </Typography>
    </Box>
    {loading ? (
      <Box sx={{ p: 2, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    ) : (
      <List sx={{ p: 0, flex: 1, overflow: 'auto' }}>
        {logs.map((log, index) => (
          <React.Fragment key={log.id}>
                <ListItem sx={{ px: 2, py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getUserColor(log.username) }}>
                      <ReceiptIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography component="span" variant="body1" color="text.primary">
                          <Box component="span" sx={{ color: 'primary.main', fontWeight: 500 }}>
                            {log.fullName || log.username}
                          </Box>{' '}
                          vừa {log.action}
                        </Typography>
                        {log.description && (
                          <Typography component="span" variant="body2">
                            {`: ${log.description}`}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {`${log.date} ${log.time}`}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < logs.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Card>
    </Box>
  );
}

export default Backlog;