import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import {useLookups} from '@niftgen/useLookups';
import PropTypes from 'prop-types';
import {useDefaultParams} from './useDefaultParams';
import {useFilters} from './useFilters';

export function Filters({children}) {
  useDefaultParams();
  const {lookups} = useLookups();
  const {category, onCategoryChange, sort, onSortChange, kind, onKindChange} = useFilters();

  return (
    <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between">
      <Box>
        <FormControl sx={{minWidth: 120}}>
          <InputLabel id="category">Category</InputLabel>
          <Select multiple label="Category" labelId="category" value={category} onChange={onCategoryChange}>
            {lookups.interests.map(({id, description}) => (
              <MenuItem key={id} value={id}>
                {description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{marginLeft: 2, minWidth: 120}}>
          <InputLabel id="category">Type</InputLabel>
          <Select label="Type" labelId="kind" value={kind} onChange={onKindChange}>
            <MenuItem value="free">Free videos</MenuItem>
            <MenuItem value="subs">Subscription videos</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box>{children}</Box>
      <FormControl sx={{minWidth: 120}}>
        <InputLabel id="sort">Order by</InputLabel>
        <Select label="Order by" labelId="sort" value={sort} onChange={onSortChange}>
          <MenuItem value="createdAt">Latest added</MenuItem>
          <MenuItem value="rating">Highest rated</MenuItem>
          <MenuItem value="views">Most viewed</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}

Filters.propTypes = {
  children: PropTypes.node,
};
