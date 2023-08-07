import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import LinearProgress from '@mui/material/LinearProgress';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import {addAsset} from '@niftgen/addAsset';
import ToggleButtonGroup from '@niftgen/ToggleButtonGroup';
import {UploadVideo} from '@niftgen/UploadVideo';
import {useAuth} from '@niftgen/useAuth';
import {useFetch} from '@niftgen/useFetch';
import {useLookups} from '@niftgen/useLookups';
import {useStorjPut} from '@niftgen/useStorj';
import {useUpload} from '@niftgen/useUpload';
import {useNavigate} from '@nkbt/react-router';
import {useQueryClient} from '@tanstack/react-query';
import {useCallback, useEffect, useRef, useState} from 'react';

export function UploadChannelVideo() {
  const navigate = useNavigate();
  const {fetch} = useFetch();
  const {walletAddress: ownerAddress} = useAuth();
  const {lookups} = useLookups();
  const [isUpdating, setIsUpdating] = useState(false);

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [description, setDescription] = useState('');
  const onDescriptionChange = useCallback(({target: {value}}) => setDescription(value), []);

  const [categories, setCategories] = useState([]);
  const onCategoriesChange = useCallback((event, value) => setCategories(value), []);

  const [name, setName] = useState('');
  const onNameChange = useCallback(({target: {value}}) => setName(value), []);

  const [videoFile, setVideoFile] = useState();
  const [coverBlob, setCoverBlob] = useState(null);
  const [duration, setDuration] = useState(-1);

  const [isFree, setIsFree] = useState(false);
  const onToggleIsFree = useCallback(({target: {checked}}) => setIsFree(checked), []);

  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({loaded: 0, total: 0, percentage: 0});

  const {upload: ipfsUpload} = useUpload();
  const queryClient = useQueryClient();
  const {upload: storjUpload} = useStorjPut({onProgress: setProgress});
  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      setError(null);

      const isValid = event.target.reportValidity();
      if (!isValid) {
        return;
      }

      setIsUpdating(true);

      async function run() {
        const [ipfsPath, {filePath}] = await Promise.all([ipfsUpload(coverBlob), storjUpload(videoFile)]);
        const storedNft = await addAsset({
          fetch,
          ownerAddress,
          kind: isFree ? 'FREE_VIDEO' : 'VIDEO',
          cover: ipfsPath,
          ipfsPath,
          filePath,
          name,
          description,
          categories,
          duration,
        });

        if (isMounted.current) {
          setIsUpdating(false);
          if (storedNft) {
            await queryClient.invalidateQueries(['nfts']);
            navigate({page: 'creator', creator: 'video'});
          }
        }
      }

      run().catch(e => {
        console.error(e);
        if (isMounted.current) {
          setError(e);
          setIsUpdating(false);
        }
      });
    },
    [
      ipfsUpload,
      coverBlob,
      storjUpload,
      videoFile,
      fetch,
      ownerAddress,
      isFree,
      name,
      description,
      categories,
      duration,
      queryClient,
      navigate,
    ]
  );

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <TextField
            disabled
            fullWidth
            id="ownerAddress"
            label="Owner Address"
            type="text"
            name="ownerAddress"
            value={ownerAddress || ''}
            InputProps={{sx: {fontSize: '0.7em'}}}
          />
        </Grid>
        <Grid xs={12}>
          <UploadVideo {...{videoFile, setVideoFile, progress, setCoverBlob, setDuration}} />
        </Grid>

        <Grid xs={12}>
          <FormGroup>
            <FormControlLabel control={<Switch checked={isFree} onChange={onToggleIsFree} />} label="Free to watch" />
            <Typography color="text.secondary">
              Free to watch content is not required to be exclusive to Niftgen
            </Typography>
          </FormGroup>
        </Grid>

        <Grid xs={12}>
          <TextField
            disabled={isUpdating}
            required
            name="name"
            label="Video Title"
            type="text"
            id="name"
            value={name}
            onChange={onNameChange}
            sx={{minWidth: '50%'}}
          />
        </Grid>

        <Grid xs={12}>
          <label htmlFor="description">
            <FormLabel component="legend" sx={{mb: 1}}>
              Description
            </FormLabel>
            <TextField
              multiline
              disabled={isUpdating}
              id="description"
              name="description"
              minRows={5}
              value={description}
              onChange={onDescriptionChange}
              style={{minWidth: '50%'}}
            />
          </label>
        </Grid>
        <Grid xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{mb: 1}}>
              Category
            </FormLabel>
            <ToggleButtonGroup disabled={isUpdating} value={categories} onChange={onCategoriesChange}>
              {lookups.interests.map(({id, description: category}) => (
                <ToggleButton key={id} value={id}>
                  {category}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </FormControl>
        </Grid>

        {error ? (
          <Grid xs={12}>
            <Tooltip arrow placement="top" title={error.message}>
              <Alert variant="outlined" severity="error">
                {error.message}
              </Alert>
            </Tooltip>
          </Grid>
        ) : null}

        <Grid xs={12}>
          <Divider sx={{mb: 2}} />
          {isUpdating ? <LinearProgress variant="determinate" value={progress.percentage} sx={{mb: 2}} /> : null}
          <LoadingButton size="large" type="submit" variant="contained" loading={isUpdating} disabled={isUpdating}>
            Upload video
          </LoadingButton>
        </Grid>
      </Grid>
    </Box>
  );
}
