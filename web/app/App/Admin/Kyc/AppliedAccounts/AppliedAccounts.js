import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {getOptinApp, useAlgoAccount, useAlgod} from '@niftgen/useAlgod';
import {useConfig} from '@niftgen/useConfig';
import {useIpfs} from '@niftgen/useIpfs';
import {useProfile} from '@niftgen/useProfile';
import {UserLink} from '@niftgen/UserLink';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import formatRelative from 'date-fns/formatRelative';
import PropTypes from 'prop-types';

async function fetchAppliedAccounts({ALGOD_INDEXER, ADMIN_ID, next}) {
  const url = new URL(`${ALGOD_INDEXER}/v2/accounts`);
  url.searchParams.append('application-id', ADMIN_ID);
  if (next) {
    url.searchParams.append('next', next);
  }

  const response = await window.fetch(url, {
    method: 'GET',
    headers: {Accept: 'application/json'},
  });
  return await response.json();
}

export function ApplicantRow({applicant, setAddress}) {
  const {ADMIN_ID} = useConfig();
  const algod = useAlgod();
  const round = useQuery({
    queryKey: ['round', applicant.optinRound],
    queryFn: () => algod.block(applicant.optinRound).do(),
    enabled: applicant.optinRound > 0,
  });
  const optinAt = round.data ? new Date(round.data.block.ts * 1000) : undefined;

  const profile = useProfile({walletAddress: applicant.address});
  const {gateway} = useIpfs();

  const {data: account} = useAlgoAccount(applicant.address);
  const adminModuleState = getOptinApp({account, appId: ADMIN_ID});

  return (
    <TableRow sx={{'& td': {border: 0, whiteSpace: 'nowrap'}}}>
      <TableCell scope="row" sx={{width: 50}}>
        {profile.data ? (
          <Avatar
            alt={profile.data.userName}
            variant="rounded"
            src={gateway(profile.data.avatarPath)}
            sx={{borderRadius: 1}}
          />
        ) : (
          '~'
        )}
      </TableCell>

      <TableCell>{profile.data ? <UserLink user={profile.data} /> : '~'}</TableCell>
      <TableCell>
        <code style={{cursor: 'pointer'}} onClick={() => setAddress(applicant.address)}>
          {applicant.address}
        </code>
      </TableCell>

      <TableCell align="right" sx={{width: 150}}>
        {round.isLoading ? '~' : optinAt ? formatRelative(optinAt, new Date()) : '-'}
      </TableCell>
      <TableCell align="center" sx={{width: 50}}>
        {adminModuleState.STATUS === 1 ? <CheckCircleOutlineIcon color="success" /> : null}
        {adminModuleState.STATUS === 0 ? <BlockIcon color="error" /> : null}
      </TableCell>
    </TableRow>
  );
}

ApplicantRow.propTypes = {
  setAddress: PropTypes.func.isRequired,
  applicant: PropTypes.shape({
    address: PropTypes.string.isRequired,
    optinRound: PropTypes.number.isRequired,
  }).isRequired,
};

export function ApplicantSkeleton() {
  return (
    <TableRow sx={{'& td': {border: 0, whiteSpace: 'nowrap'}}}>
      <TableCell>
        <Skeleton variant="rectangular" width={50} height={50} />
      </TableCell>
      <TableCell>
        <Skeleton variant="rectangular" width="100%" height="1em" />
      </TableCell>
      <TableCell>
        <Skeleton variant="rectangular" width="100%" height="1em" />
      </TableCell>
      <TableCell align="right" sx={{width: 150}} />
      <TableCell align="center" sx={{width: 50}} />
    </TableRow>
  );
}

export function AppliedAccounts({setAddress}) {
  const {ALGOD_INDEXER, ADMIN_ID} = useConfig();
  const queryClient = useQueryClient();
  const applicants = useQuery({
    queryKey: ['applicants'],
    queryFn: async () => {
      const all = [];
      let next = undefined;
      do {
        const data = await fetchAppliedAccounts({ALGOD_INDEXER, ADMIN_ID, next});
        const applications = data.accounts.map(account => {
          const adminModuleState = getOptinApp({account, appId: ADMIN_ID});
          return {
            address: account.address,
            currentRound: account.round,
            ...adminModuleState,
          };
        });

        if (data.accounts.length > 0) {
          next = data['next-token'];
        } else {
          next = undefined;
        }
        data.accounts.forEach(account => queryClient.setQueryData(['algo', account.address], account));
        all.push(...applications);
      } while (next);
      return all;
    },
    enabled: Boolean(ALGOD_INDEXER && ADMIN_ID),
  });
  return (
    <TableContainer>
      <Table sx={{minWidth: 600}}>
        <TableHead>
          <TableRow sx={{'& th': {border: 0, whiteSpace: 'nowrap'}}}>
            <TableCell></TableCell>
            <TableCell>Creator</TableCell>
            <TableCell>Address</TableCell>
            <TableCell align="right" sx={{width: 150}}>
              Applied at
            </TableCell>
            <TableCell align="center" sx={{width: 50}}>
              Approved
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applicants.isFetching ? <ApplicantSkeleton /> : null}
          {applicants.data?.map(applicant => (
            <ApplicantRow key={applicant.address} applicant={applicant} setAddress={setAddress} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

AppliedAccounts.propTypes = {
  setAddress: PropTypes.func.isRequired,
};
