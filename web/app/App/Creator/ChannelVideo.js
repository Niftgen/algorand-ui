import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Pager, useDefaultParams} from '@niftgen/Nfts';
import {useAuth} from '@niftgen/useAuth';
import {useNfts} from '@niftgen/useNfts';
import {useState} from 'react';
import {AssetRow, AssetSkeleton} from './AssetRow';
import {Delete} from './Delete';
import {UploadButton} from './UploadButton';

export function ChannelVideo() {
  const [deletingInProgress, setDeletingInProgress] = useState(0);
  const {walletAddress} = useAuth();
  const {limit, offset} = useDefaultParams();
  const assetQuery = {
    limit,
    offset,
    ownedByWalletAddress: walletAddress,
    kind: ['VIDEO', 'FREE_VIDEO'],
  };
  const {data: nfts, isFetching} = useNfts(assetQuery);

  return (
    <Stack direction="column" spacing={1}>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="flex-end"
        pb={1}
        borderBottom="1px solid rgba(var(--mui-palette-primary-mainChannel) / 0.5)">
        <UploadButton to="add-video">Upload video</UploadButton>
      </Stack>

      <TableContainer>
        <Table sx={{minWidth: 600}}>
          <TableHead>
            <TableRow sx={{'& th': {border: 0, whiteSpace: 'nowrap'}}}>
              <TableCell>Preview</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="center">Free</TableCell>
              <TableCell align="right">Last updated</TableCell>
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching ? <AssetSkeleton /> : null}
            {nfts.map(nft => (
              <AssetRow key={nft.id} nft={nft} {...{deletingInProgress, setDeletingInProgress}} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pager assetQuery={assetQuery} />

      <Modal open={deletingInProgress > 0} onClose={() => setDeletingInProgress(0)}>
        <Box>
          <Delete
            id={deletingInProgress}
            onCancel={() => setDeletingInProgress(0)}
            onSuccess={() => setDeletingInProgress(0)}
          />
        </Box>
      </Modal>
    </Stack>
  );
}
