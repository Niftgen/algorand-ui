import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {renderDate} from '@niftgen/renderDate';
import {useIpfs} from '@niftgen/useIpfs';
import {UserLink} from '@niftgen/UserLink';
import PropTypes from 'prop-types';

export function NotMyMessage({comment}) {
  const {gateway} = useIpfs();
  return (
    <ListItem alignItems="flex-start">
      <ListItemIcon>
        <Avatar variant="rounded" alt={comment.owner.userName} src={gateway(comment.owner.avatarPath)} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Stack direction="row" justifyContent="space-between">
            <Typography fontSize={12}>
              <UserLink user={comment.owner} />
            </Typography>
            <Typography fontSize={12}>{renderDate({timestamp: comment.createdAt})}</Typography>
          </Stack>
        }
        secondary={
          <Typography
            p={1}
            sx={{
              backgroundColor: 'var(--background-color-message-not-mine)',
              borderRadius: 1,
            }}>
            {comment.content}
          </Typography>
        }
      />
    </ListItem>
  );
}

NotMyMessage.propTypes = {
  comment: PropTypes.shape({
    owner: PropTypes.shape({
      id: PropTypes.number,
      userName: PropTypes.string,
      avatarPath: PropTypes.string,
    }),
    content: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
};
