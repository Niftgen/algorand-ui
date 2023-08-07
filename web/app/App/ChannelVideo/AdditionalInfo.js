import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@niftgen/ToggleButtonGroup';
import {useLookups} from '@niftgen/useLookups';
import {useNft} from '@niftgen/useNfts';
import {UserLink} from '@niftgen/UserLink';
import {useHref, useNavigate, useValue} from '@nkbt/react-router';
import PropTypes from 'prop-types';
import {useCallback} from 'react';

function CategoryButton({categoryId}) {
  const {lookups} = useLookups();

  const category = lookups.interests.find(({id}) => id === categoryId);

  const navigate = useNavigate();
  const href = useHref({page: 'videos', category: category?.id});
  const onClick = useCallback(
    event => {
      event.preventDefault();
      navigate({page: 'videos', category: category?.id});
    },
    [navigate, category?.id]
  );

  if (!category) {
    return null;
  }

  return (
    <ToggleButton value={category?.id} href={href} onClick={onClick} size="small">
      {category?.description}
    </ToggleButton>
  );
}

CategoryButton.propTypes = {
  categoryId: PropTypes.number.isRequired,
};

export function AdditionalInfo() {
  const {data: nft} = useNft({id: useValue('video')});

  return (
    <>
      <Typography variant="h2" component="h1">
        {nft.name}
      </Typography>

      <Box pb={1}>
        <UserLink user={nft.owner} />
      </Box>
      <Box>
        <ToggleButtonGroup sx={{gap: 1}}>
          {nft.categories.map(category => (
            <CategoryButton key={category.id} categoryId={category.id} />
          ))}
        </ToggleButtonGroup>
      </Box>

      {nft.description ? (
        <Typography mt={4} whiteSpace="pre-wrap">
          {nft.description}
        </Typography>
      ) : null}
    </>
  );
}
