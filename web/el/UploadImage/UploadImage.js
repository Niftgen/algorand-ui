import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useIpfs} from '@niftgen/useIpfs';
import PropTypes from 'prop-types';
import {useCallback, useState} from 'react';

export function UploadImage({required, ipfsPath, coverFile, onCoverFileChange}) {
  const [coverFilename, setCoverFilename] = useState('');
  const [coverFiletype, setCoverFiletype] = useState('');
  const [coverUrl, setCoverUrl] = useState();

  const processCoverFile = useCallback(
    file => {
      if (!file) {
        return;
      }
      onCoverFileChange(file);
      setCoverFiletype(file.type);
      setCoverFilename(file.name);
      const reader = new FileReader();
      reader.addEventListener('load', e => setCoverUrl(e.target.result), {once: true});
      reader.readAsDataURL(file);
    },
    [onCoverFileChange]
  );

  const [coverDragging, setCoverDragging] = useState(false);
  const onCoverDragEnter = useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
    setCoverDragging(true);
  }, []);
  const onCoverDragOver = useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
    setCoverDragging(true);
  }, []);
  const onCoverDragLeave = useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
    setCoverDragging(false);
  }, []);
  const onCoverDrop = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      setCoverDragging(false);
      const [file] = e?.dataTransfer?.files ?? [];
      processCoverFile(file);
    },
    [processCoverFile]
  );
  const onCoverChange = useCallback(
    event => {
      const [file] = event.target.files;
      processCoverFile(file);
    },
    [processCoverFile]
  );

  const {gateway} = useIpfs();
  return (
    <>
      <label htmlFor="image" style={{display: 'block', position: 'relative'}} onDragEnter={onCoverDragEnter}>
        <div
          style={{
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            position: 'absolute',
            zIndex: 9999,
            display: coverDragging ? 'block' : 'none',
          }}
          onDragEnter={onCoverDragEnter}
          onDragOver={onCoverDragOver}
          onDragLeave={onCoverDragLeave}
          onDrop={onCoverDrop}>
          {' '}
        </div>
        <FormLabel component="p" required={required} sx={{mb: 1}}>
          Upload image
        </FormLabel>
        <input
          accept="image/jpg,image/png,image/gif"
          id="image"
          type="file"
          onChange={onCoverChange}
          style={{opacity: 0, width: 1, height: 1, overflow: 'hidden', display: 'block'}}
        />
        <Stack direction={{sx: 'column', lg: 'row'}} gap={2}>
          <Button
            component="div"
            sx={{
              color: 'var(--font-color-form-label)',
              textAlign: 'center',
              border: '1px solid var(--input-border-color-primary)',
              fontStyle: 'italic',
              textTransform: 'none',
              height: '200px',
              minWidth: '50%',
              backgroundColor: coverDragging
                ? 'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))'
                : 'background.default',
            }}>
            <Stack>
              <Typography>Drop here</Typography>
            </Stack>
          </Button>
          {coverFile ? (
            <Card
              sx={{
                height: 200,
                width: '100%',
                borderRadius: 1,
                backgroundColor: 'var(--background-color-secondary)',
              }}>
              <CardMedia component="img" height="200" image={coverUrl} sx={{objectFit: 'contain'}} />
            </Card>
          ) : null}
          {!coverFile && ipfsPath ? (
            <Card
              sx={{
                height: 200,
                width: '100%',
                borderRadius: 1,
                backgroundColor: 'var(--background-color-secondary)',
              }}>
              <CardMedia component="img" height="200" image={gateway(ipfsPath)} sx={{objectFit: 'contain'}} />
            </Card>
          ) : null}
        </Stack>
      </label>
      <Box sx={{mt: 1}}>
        {coverFile ? (
          <Typography>
            {coverFilename}, {coverFiletype}
          </Typography>
        ) : (
          <Typography color="text.secondary" sx={{mt: 1}}>
            jpg, png and gif files only
          </Typography>
        )}
      </Box>
    </>
  );
}

UploadImage.propTypes = {
  required: PropTypes.bool,
  ipfsPath: PropTypes.string,
  coverFile: PropTypes.object,
  onCoverFileChange: PropTypes.func.isRequired,
};
UploadImage.defaultProps = {
  required: false,
};
