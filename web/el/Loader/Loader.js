import CircularProgress from '@mui/material/CircularProgress';

export function Loader() {
  return (
    <>
      <CircularProgress
        disableShrink
        sx={{position: 'fixed', left: '50%', top: '50%', marginLeft: '-20px', marginTop: '-20px'}}
      />
      <div style={{minHeight: '100vh'}} />
    </>
  );
}
