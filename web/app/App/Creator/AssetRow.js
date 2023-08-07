import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DownloadingIcon from '@mui/icons-material/Downloading';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import {compileFragments} from '@niftgen/compileFragments';
import {assetFragment} from '@niftgen/fragments.asset';
import {renderDate} from '@niftgen/renderDate';
import {useAuth} from '@niftgen/useAuth';
import {useFetch} from '@niftgen/useFetch';
import {useIpfs} from '@niftgen/useIpfs';
import {useHref, useNavigate} from '@nkbt/react-router';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import PropTypes from 'prop-types';
import {useCallback, useEffect, useMemo, useState} from 'react';

const gql = ([q]) => q;

function useUpdateAsset({nft}) {
  const {fetch} = useFetch();
  const {walletAddress: myAddress} = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    enabled: Boolean(myAddress && nft.id && nft.kind && nft.minter?.walletAddress === myAddress),
    mutationKey: ['assetType', {id: nft.id, kind: nft.kind}],
    mutationFn: async function updateAsset({kind}) {
      const query = compileFragments(
        gql`
          mutation updateAsset($id: Int!, $ownerAddress: String!, $kind: AssetKind) {
            updateAsset(id: $id, ownerAddress: $ownerAddress, kind: $kind) {
              ...asset
            }
          }
        `,
        assetFragment
      );
      const variables = {ownerAddress: myAddress, id: nft.id, kind};
      const body = await fetch(`/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({query, variables}),
      });

      const {data, errors} = await body.json();
      if (data?.updateAsset) {
        return data?.updateAsset;
      }
      throw new Error(errors?.[0]?.message || 'Unknown server error');
    },
    cacheTime: Infinity,
    onSuccess: asset => {
      if (asset) {
        queryClient.setQueriesData(['nft', nft.id], asset);
        queryClient.setQueriesData(['nfts'], oldAssets =>
          oldAssets ? oldAssets.map(oldAsset => (oldAsset.id === nft.id ? asset : oldAsset)) : oldAssets
        );
      }
    },
  });
}

export function AssetRow({nft, deletingInProgress, setDeletingInProgress}) {
  const {gateway} = useIpfs();
  const imageUrl = gateway(nft.cover);

  const query = useMemo(() => {
    switch (nft.kind) {
      case 'VIDEO':
      case 'FREE_VIDEO':
        return {page: 'video', video: nft.id};
      case 'AUDIO':
        return {page: 'audio', audio: nft.id};
      case 'NFT_IMAGE':
      case 'NFT_VIDEO':
      case 'NFT_AUDIO':
        return {page: 'nft', nft: nft.id};
    }
  }, [nft.id, nft.kind]);
  const href = useHref(query);
  const navigate = useNavigate();
  const onClick = useCallback(
    event => {
      event.preventDefault();
      navigate(query);
    },
    [navigate, query]
  );

  const {walletAddress: myAddress} = useAuth();
  const canBeDeleted = useMemo(() => {
    if (nft.minter?.walletAddress && nft.minter?.walletAddress !== myAddress) {
      return false;
    }
    switch (nft.kind) {
      case 'VIDEO':
      case 'FREE_VIDEO':
      case 'AUDIO':
        return true;
      case 'NFT_IMAGE':
      case 'NFT_VIDEO':
      case 'NFT_AUDIO':
        return (!nft.list.txn && !nft.auction.txn) || window.localStorage.DEBUG === 'true';
    }
  }, [nft.minter?.walletAddress, nft.kind, nft.list.txn, nft.auction.txn, myAddress]);

  const {mutate: updateAsset, isLoading} = useUpdateAsset({nft});
  const [isFree, setIsFree] = useState(nft.kind === 'FREE_VIDEO');
  useEffect(() => setIsFree(nft.kind === 'FREE_VIDEO'), [nft.kind]);
  const onToggleIsFree = useCallback(
    ({target: {checked}}) => {
      setIsFree(checked);
      updateAsset({kind: checked ? 'FREE_VIDEO' : 'VIDEO'}, {onError: () => setIsFree(!checked)});
    },
    [updateAsset]
  );

  return (
    <TableRow sx={{'& td': {border: 0, whiteSpace: 'nowrap'}}}>
      <TableCell scope="row" sx={{minWidth: 150}}>
        {imageUrl ? (
          <Card sx={{height: 70}}>
            <CardActionArea href={href} onClick={onClick}>
              <CardMedia component="img" height="70" image={imageUrl} />
            </CardActionArea>
          </Card>
        ) : (
          <Skeleton variant="rounded" width="100%" height="auto" sx={{aspectRatio: '16 / 9'}} />
        )}
      </TableCell>

      <TableCell scope="row" sx={{width: '100%'}}>
        <Typography>{nft.name}</Typography>
      </TableCell>

      <TableCell align="center">
        <Switch checked={isFree} onChange={onToggleIsFree} disabled={isLoading} />
      </TableCell>

      <TableCell align="right">{renderDate({timestamp: nft.updatedAt})}</TableCell>
      <TableCell>
        {canBeDeleted ? (
          <IconButton disabled={deletingInProgress > 0} onClick={() => setDeletingInProgress(nft.id)}>
            <DeleteForeverIcon />
          </IconButton>
        ) : null}
      </TableCell>
    </TableRow>
  );
}

AssetRow.propTypes = {
  nft: PropTypes.shape({
    id: PropTypes.number.isRequired,
    kind: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    updatedAt: PropTypes.instanceOf(Date),
    minter: PropTypes.shape({
      walletAddress: PropTypes.string,
    }),
    auction: PropTypes.shape({
      txn: PropTypes.string,
      isAuction: PropTypes.bool.isRequired,
    }),
    mint: PropTypes.shape({
      txn: PropTypes.string,
    }),
    list: PropTypes.shape({
      txn: PropTypes.string,
    }),
  }),
  deletingInProgress: PropTypes.number.isRequired,
  setDeletingInProgress: PropTypes.func.isRequired,
};

export function AssetSkeleton() {
  return (
    <TableRow sx={{'& td': {border: 0, whiteSpace: 'nowrap'}}}>
      <TableCell scope="row" sx={{minWidth: 150}}>
        <Skeleton variant="rounded" width="100%" height={70} sx={{aspectRatio: '16 / 9'}} />
      </TableCell>
      <TableCell>
        <DownloadingIcon />
      </TableCell>
      <TableCell>&nbsp;</TableCell>
      <TableCell>&nbsp;</TableCell>
      <TableCell>&nbsp;</TableCell>
    </TableRow>
  );
}
