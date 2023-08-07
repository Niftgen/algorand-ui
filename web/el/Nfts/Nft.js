import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {Price} from '@niftgen/Price';
import {renderDurationInMinutes} from '@niftgen/renderDate';
import {useIpfs} from '@niftgen/useIpfs';
import {UserLink} from '@niftgen/UserLink';
import {useHref, useNavigate} from '@nkbt/react-router';
import PropTypes from 'prop-types';
import {useCallback, useMemo} from 'react';

export function Nft({nft}) {
  const query = useMemo(() => {
    switch (nft.kind) {
      case 'VIDEO':
      case 'FREE_VIDEO':
        return {page: 'video', video: nft.id};
      case 'AUDIO':
        return {page: 'audio', audio: nft.id};
      case 'NFT_IMAGE':
      case 'NFT_VIDEO':
      case 'NFT_AUDIO':
        return {page: 'nft', nft: nft.id};
    }
  }, [nft.id, nft.kind]);
  const href = useHref(query);
  const navigate = useNavigate();
  const onClick = useCallback(
    event => {
      event.preventDefault();
      navigate(query);
    },
    [navigate, query]
  );

  const price = nft.price || nft.auction.amount || nft.winningBid.amount || null;

  const {gateway} = useIpfs();
  return (
    <>
      <Card sx={{borderRadius: 2}} raised>
        <CardActionArea href={href} onClick={onClick}>
          <CardMedia image={gateway(nft.cover)} sx={{height: 160, position: 'relative'}}>
            {nft.duration > 0 ? (
              <Typography
                sx={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: 'background.default',
                  py: 0.5,
                  px: 1,
                  borderRadius: '4px',
                }}>
                {renderDurationInMinutes(nft.duration)}
              </Typography>
            ) : null}
            {nft.views > 0 ? (
              <Typography
                sx={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  backgroundColor: 'background.default',
                  py: 0.5,
                  px: 1,
                  borderRadius: '4px',
                }}>
                {nft.views === 1 ? `${nft.views} view` : `${nft.views} views`}
              </Typography>
            ) : null}
          </CardMedia>
        </CardActionArea>
      </Card>

      <Avatar
        alt={nft.owner.userName}
        src={gateway(nft.owner.avatarPath)}
        sx={{
          ml: 1,
          mb: -1,
          width: 32,
          height: 32,
          transform: 'translateY(-50%)',
          background: 'var(--background-color-secondary)',
          boxShadow: 'inset 0px 0px 2px var(--border-color-profile-avatar)',
        }}
      />

      <Box>
        {price && nft.currency ? (
          <Box
            component="span"
            sx={{
              p: '0.1em 0.3em',
              borderRadius: 1,
              color: 'var(--font-color-nft-price)',
              backgroundColor: 'var(--background-color-nft-price)',
            }}>
            <Price currency={nft.currency} price={price} />
          </Box>
        ) : null}

        <Link href={href} onClick={onClick} underline="none">
          <Typography color="text.prominent">{nft.name}</Typography>
        </Link>

        <UserLink user={nft.owner} />
      </Box>
    </>
  );
}

Nft.propTypes = {
  nft: PropTypes.shape({
    id: PropTypes.number.isRequired,
    kind: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    price: PropTypes.number,
    duration: PropTypes.number,
    views: PropTypes.number,
    currency: PropTypes.string,
    auction: PropTypes.shape({
      amount: PropTypes.number,
    }),
    winningBid: PropTypes.shape({
      amount: PropTypes.number,
    }),
    owner: PropTypes.shape({
      id: PropTypes.number,
      userName: PropTypes.string,
      avatarPath: PropTypes.string,
      walletAddress: PropTypes.string,
    }),
  }),
};
