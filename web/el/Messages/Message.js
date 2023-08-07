import {useAccount} from '@niftgen/useAccount';
import PropTypes from 'prop-types';

import {MyMessage} from './MyMessage';
import {NotMyMessage} from './NotMyMessage';

export function Message({comment}) {
  const {account} = useAccount();
  return comment.owner.id === account.id ? <MyMessage comment={comment} /> : <NotMyMessage comment={comment} />;
}

Message.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number,
    owner: PropTypes.shape({
      id: PropTypes.number,
    }),
  }).isRequired,
};
