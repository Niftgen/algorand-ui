import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';

import {Loader} from './Loader';

export function Delayed({isReady, delay = 2000, children}) {
  const [isLoading, setIsLoading] = useState(!isReady);
  useEffect(() => {
    if (isReady) {
      setIsLoading(false);
    }
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [isReady, delay]);

  return (
    <>
      {isLoading && <Loader />}
      <Box sx={{opacity: isLoading ? 0 : 1, transition: 'opacity 300ms'}}>{children}</Box>
    </>
  );
}

Delayed.propTypes = {
  isReady: PropTypes.bool.isRequired,
  delay: PropTypes.number,
  children: PropTypes.node.isRequired,
};
