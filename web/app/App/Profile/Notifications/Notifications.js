import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import {Loader} from '@niftgen/Loader';
import {useNotifications} from '@niftgen/useNotifications';
import {useCallback, useMemo, useState} from 'react';
import {Notification} from './Notification';

export function Notifications() {
  const {notifications, loading} = useNotifications();
  const [typeFilter, setTypeFilter] = useState(['COMMENT', 'RATING', 'EXPIRED_SUBSCRIPTION']);
  const filteredNotifications = useMemo(() => {
    return notifications.filter(item => typeFilter.includes(item.notificationType));
  }, [notifications, typeFilter]);

  const handleUpdateTypeFilter = useCallback(
    event => {
      const type = event.target.name;
      const updatedTypeFilter = [...typeFilter];
      const index = updatedTypeFilter.indexOf(type);

      if (index === -1) {
        updatedTypeFilter.push(type);
      } else {
        updatedTypeFilter.splice(index, 1);
      }

      setTypeFilter(updatedTypeFilter);
    },
    [typeFilter, setTypeFilter]
  );

  return (
    <Box>
      <FormGroup sx={{display: 'flex', flexDirection: 'row', columnGap: 5}}>
        <FormControlLabel
          control={<Checkbox name="RATING" checked={typeFilter.includes('RATING')} onClick={handleUpdateTypeFilter} />}
          label="Ratings"
        />
        <FormControlLabel
          control={
            <Checkbox name="COMMENT" checked={typeFilter.includes('COMMENT')} onClick={handleUpdateTypeFilter} />
          }
          label="Comments"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="EXPIRED_SUBSCRIPTION"
              checked={typeFilter.includes('EXPIRED_SUBSCRIPTION')}
              onClick={handleUpdateTypeFilter}
            />
          }
          label="Subscriptions"
        />
      </FormGroup>
      <Box sx={{py: 4}}>
        {loading ? <Loader /> : null}
        {!loading && filteredNotifications.length > 0 ? (
          <List
            sx={{
              borderRadius: 1,
              boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.13), 0px 1px 1px rgba(0, 0, 0, 0.1);',
              py: 0,
            }}>
            {filteredNotifications.map(notification => (
              <Notification key={notification.id} notification={notification} />
            ))}
          </List>
        ) : null}
        {!loading && filteredNotifications.length === 0 ? (
          <Typography variant="h6" align="center">
            No notifications to display
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}
