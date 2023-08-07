import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {UploadImage} from '@niftgen/UploadImage';
import PropTypes from 'prop-types';
import {useCallback, useState} from 'react';
import {Collapse} from 'react-collapse';

export function UploadVideo({videoFile, setVideoFile, progress, setCoverBlob, setDuration}) {
  const [videoUrl, setVideoUrl] = useState('');

  const onVideoFileChange = useCallback(
    event => {
      event.preventDefault();
      const [file] = event?.target?.files ?? [];
      if (!file) {
        return;
      }
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    },
    [setVideoFile]
  );

  const [dragging, setDragging] = useState(false);
  const onDragEnter = useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
    setDragging(true);
  }, []);
  const onDragOver = useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
    setDragging(true);
  }, []);
  const onDragLeave = useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
    setDragging(false);
  }, []);
  const handleVideoDrop = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      const [file] = e?.dataTransfer?.files ?? [];
      if (!file) {
        return;
      }
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    },
    [setVideoFile]
  );

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(200);

  const onLoadedMetadata = useCallback(
    e => {
      const $video = e.target;
      $video.currentTime = 0;
      setDuration(Math.floor($video.duration * 1000));

      if (setCoverBlob) {
        const $canvas = document.querySelector('#canvas');
        Object.assign($canvas, {
          width: $video.videoWidth,
          height: $video.videoHeight,
        });
        setWidth($video.videoWidth);
        setHeight($video.videoHeight);
      }
    },
    [setCoverBlob, setDuration]
  );

  const onTimeUpdate = useCallback(
    e => {
      if (setCoverBlob) {
        const $video = e.target;
        const $canvas = document.querySelector('#canvas');
        $canvas.getContext('2d').drawImage($video, 0, 0, $video.videoWidth, $video.videoHeight);
        $canvas.toBlob(setCoverBlob, 'image/jpeg', 0.95);
      }
    },
    [setCoverBlob]
  );

  const [customCover, setCustomCover] = useState(false);

  return (
    <Stack direction="column" spacing={2}>
      <label htmlFor="video" style={{display: 'block', position: 'relative'}} onDragEnter={onDragEnter}>
        <div
          style={{
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            position: 'absolute',
            zIndex: 9999,
            display: dragging ? 'block' : 'none',
          }}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={handleVideoDrop}>
          {' '}
        </div>
        <FormLabel component="legend" required sx={{mb: 1}}>
          Upload video
        </FormLabel>
        <input
          accept="video/mp4,video/x-m4v,video/*"
          id="video"
          type="file"
          onChange={onVideoFileChange}
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
              backgroundColor: dragging ? 'var(--background-color-input-hover)' : 'var(--background-color-input)',
            }}>
            <Stack>
              <Typography sx={{color: 'var(--font-color-form-label)'}}>Drop here</Typography>
            </Stack>
          </Button>
          {videoUrl ? (
            <video
              id="video"
              controls
              src={videoUrl}
              preload="metadata"
              width="100%"
              height="200"
              onLoadedMetadata={onLoadedMetadata}
              onTimeUpdate={setCoverBlob ? onTimeUpdate : null}
            />
          ) : null}
        </Stack>
        <Box sx={{mt: 1}}>
          {videoFile ? (
            <Typography color="text.secondary">
              {videoFile.name}, {videoFile.type}
            </Typography>
          ) : (
            <Typography color="text.secondary">mp4 and mov files only</Typography>
          )}
          {progress.percentage ? (
            <Typography color="text.secondary">
              Upload progress: {progress.percentage}% ({progress.loaded} of {progress.total})
            </Typography>
          ) : null}
        </Box>
      </label>

      {setCoverBlob && videoFile ? (
        <Box>
          <Collapse isOpened={!customCover}>
            <Box component="label" htmlFor="cover">
              <FormLabel component="legend" sx={{mt: 1}}>
                Video cover image - change video position for cover image
              </FormLabel>
              <Box sx={{position: 'relative'}}>
                <Button
                  variant="outlined"
                  sx={{position: 'absolute', top: '1em', left: '1em'}}
                  onClick={() => setCustomCover(true)}>
                  Upload custom cover
                </Button>
                <canvas id="canvas" style={{maxWidth: '100%', width, height}} />
              </Box>
            </Box>
          </Collapse>
          <Collapse isOpened={customCover}>
            <Box component="label" htmlFor="cover">
              <Box sx={{position: 'relative'}}>
                <UploadImage coverFile={{}} onCoverFileChange={setCoverBlob} />
                <Button
                  variant="outlined"
                  sx={{position: 'absolute', top: '3em', left: '1em'}}
                  onClick={() => setCustomCover(false)}>
                  Back to automatic cover
                </Button>
              </Box>
            </Box>
          </Collapse>
        </Box>
      ) : null}
    </Stack>
  );
}

UploadVideo.propTypes = {
  videoFile: PropTypes.object,
  setVideoFile: PropTypes.func.isRequired,
  setDuration: PropTypes.func.isRequired,
  setCoverBlob: PropTypes.func,
  progress: PropTypes.shape({
    percentage: PropTypes.number.isRequired,
    loaded: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
};
