import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {loadPages} from '@niftgen/wiki';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import {Home} from './Home';

export function Page({name}) {
  const [pages, setPages] = useState({});

  useEffect(() => {
    loadPages().then(setPages);
  }, []);

  return name in pages ? (
    <Container sx={{py: 2.5}}>
      <ReactMarkdown
        components={{
          a: ({node: _node, ...props}) => <Link target="_blank" {...props} />,
          b: ({node: _node, ...props}) => <Typography component="span" fontWeight="bold" mb={3} {...props} />,
          strong: ({node: _node, ...props}) => <Typography component="span" fontWeight="bold" mb={3} {...props} />,
          h3: ({node: _node, ...props}) => (
            <Typography variant="h4" component="h3" fontSize={32} fontWeight={700} mb={3} {...props} />
          ),
          h4: ({node: _node, ...props}) => <Typography variant="h5" component="h4" fontSize={24} mb={1} {...props} />,
          img: ({node: _node, ...props}) => <img style={{maxWidth: '100%'}} {...props} />,
          p: ({node: _node, ...props}) => <Typography component="p" mb={3} lineHeight={1.8} {...props} />,
          li: ({node: _node, ordered: _ordered, ...props}) => <Typography component="li" {...props} />,
        }}>
        {pages[name].default}
      </ReactMarkdown>
    </Container>
  ) : (
    <Home />
  );
}

Page.propTypes = {
  name: PropTypes.string,
};
