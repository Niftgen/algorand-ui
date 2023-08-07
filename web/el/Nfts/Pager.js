import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import {useNfts} from '@niftgen/useNfts';
import PropTypes from 'prop-types';
import {useDefaultParams} from './useDefaultParams';

export function Pager({assetQuery}) {
  const {limit, offset, onNext, onPrev} = useDefaultParams();
  const {data, isFetching} = useNfts(assetQuery);
  const hasPrev = offset > 0;
  const hasNext = !(data.length < limit);

  return hasPrev || hasNext ? (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
      <IconButton variant="outlined" onClick={onPrev} disabled={isFetching || !hasPrev}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton variant="outlined" onClick={onNext} disabled={isFetching || !hasNext}>
        <ArrowForwardIosIcon />
      </IconButton>
    </Stack>
  ) : null;
}

Pager.propTypes = {
  assetQuery: PropTypes.object.isRequired,
};
