import PropTypes from 'prop-types';
import {CommentNotification} from './CommentNotification';
import {ExpiredSubscriptionNotification} from './ExpiredSubscriptionNotification';
import {RatingNotification} from './RatingNotification';

export function Notification({notification}) {
  switch (notification.notificationType) {
    case 'COMMENT':
      return <CommentNotification notification={notification} />;
    case 'RATING':
      return <RatingNotification notification={notification} />;
    case 'EXPIRED_SUBSCRIPTION':
      return <ExpiredSubscriptionNotification notification={notification} />;
    default:
      return null;
  }
}

Notification.propTypes = {
  notification: PropTypes.object.isRequired,
};
