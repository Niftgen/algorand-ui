import Typography from '@mui/material/Typography';

export function P(props) {
  return <Typography component="p" mb={3} {...props} />;
}

export function H3(props) {
  return <Typography variant="h4" component="h3" mb={3} {...props} />;
}

export function H4(props) {
  return <Typography variant="h5" component="h4" mb={3} {...props} />;
}

export function Img(props) {
  return (
    <P textAlign="center" mt={3} mb={3}>
      <img style={{maxWidth: '100%'}} {...props} />
    </P>
  );
}

export function A(props) {
  return <a target="_blank" {...props} />;
}

export function B(props) {
  return <Typography component="span" fontWeight="bold" {...props} />;
}
