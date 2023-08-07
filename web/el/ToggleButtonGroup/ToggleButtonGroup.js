import {styled} from '@mui/material/styles';
import MuiToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export const ToggleButtonGroup = styled(({justifyContent: _justifyContent, ...props}) => (
  <MuiToggleButtonGroup {...props} />
))(({justifyContent = 'center'}) => ({
  '&': {
    flexWrap: 'wrap',
    justifyContent,
  },
  '& .MuiToggleButton-root ': {
    padding: '0.5rem 1rem',
    color: 'var(--font-color-primary)',
    borderColor: 'var(--input-border-color-primary)',
    whiteSpace: 'nowrap',
    width: 'auto',
    '&.Mui-selected': {
      borderColor: 'var(--background-color-button)',
      backgroundColor: 'var(--background-color-button)',
      color: 'var(--font-color-button)',
    },
    '&.Mui-disabled': {
      opacity: 0.3,
    },
  },
}));
