import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {useAdd, useNavigate, useRemove, useValue} from '@nkbt/react-router';
import PropTypes from 'prop-types';
import {useCallback, useEffect} from 'react';
import {Kyc} from './Kyc';
import {Layout} from './Layout';

function TocItem({label, value, isActive, sx}) {
  const navigate = useNavigate();
  const onClick = useCallback(() => navigate({admin: value}), [navigate, value]);
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick} selected={isActive}>
        <ListItemText primary={label} sx={sx} />
      </ListItemButton>
    </ListItem>
  );
}

TocItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  sx: PropTypes.object,
};

function Toc() {
  const p = useValue('admin');
  return (
    <List>
      <TocItem value="kyc" label="KYC" isActive={p === 'kyc'} />
    </List>
  );
}

export function useDefaultParams() {
  const addParams = useAdd();
  const removeParams = useRemove();

  useEffect(() => {
    addParams({admin: 'kyc'});
    return () => {
      if (process.env.NODE_ENV !== 'development') {
        removeParams({admin: 'kyc'});
      }
    };
  }, [addParams, removeParams]);
}

export function Admin() {
  useDefaultParams();
  const p = useValue('admin') || 'kyc';
  switch (p) {
    case 'kyc':
      return <Layout Header="KYC" Toc={<Toc />} Content={<Kyc />} />;
    default:
      return <Layout Header="404 Not found" Toc={<Toc />} />;
  }
}
