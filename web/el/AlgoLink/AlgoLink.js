import Link from '@mui/material/Link';
import {useConfig} from '@niftgen/useConfig';
import PropTypes from 'prop-types';

const MAPPING = {
  sandnet: {
    dappflow: {
      transaction: hash => `https://app.dappflow.org/explorer/transaction/${hash}`,
      account: hash => `https://app.dappflow.org/explorer/account/${hash}`,
      asset: hash => `https://app.dappflow.org/explorer/asset/${hash}`,
    },
  },
  testnet: {
    dappflow: {
      transaction: hash => `https://app.dappflow.org/explorer/transaction/${hash}`,
      account: hash => `https://app.dappflow.org/explorer/account/${hash}`,
      asset: hash => `https://app.dappflow.org/explorer/asset/${hash}`,
    },
    algoexplorer: {
      transaction: hash => `https://testnet.algoexplorer.io/tx/${hash}`,
      account: hash => `https://testnet.algoexplorer.io/address/${hash}`,
      asset: hash => `https://testnet.algoexplorer.io/asset/${hash}`,
    },
    goalseeker: {
      transaction: hash => `https://goalseeker.purestake.io/algorand/testnet/transaction/${hash}`,
      account: hash => `https://goalseeker.purestake.io/algorand/testnet/account/${hash}`,
      asset: hash => `https://goalseeker.purestake.io/algorand/testnet/asset/${hash}`,
    },
  },
  mainnet: {
    dappflow: {
      transaction: hash => `https://app.dappflow.org/explorer/transaction/${hash}`,
      account: hash => `https://app.dappflow.org/explorer/account/${hash}`,
      asset: hash => `https://app.dappflow.org/explorer/asset/${hash}`,
    },
    algoexplorer: {
      transaction: hash => `https://algoexplorer.io/tx/${hash}`,
      account: hash => `https://algoexplorer.io/address/${hash}`,
      asset: hash => `https://algoexplorer.io/asset/${hash}`,
    },
    goalseeker: {
      transaction: hash => `https://goalseeker.purestake.io/algorand/mainnet/transaction/${hash}`,
      account: hash => `https://goalseeker.purestake.io/algorand/mainnet/account/${hash}`,
      asset: hash => `https://goalseeker.purestake.io/algorand/mainnet/asset/${hash}`,
    },
  },
};

export function AlgoLink({type, hash, length}) {
  const {explorer, network} = useConfig();
  return hash ? (
    <Link href={MAPPING[network][explorer][type](hash)} underline="hover" target="_blank" rel="noreferrer" title={hash}>
      {['transaction', 'account'].includes(type) && length > 0 ? `${hash}`?.substring(0, length) : hash}
    </Link>
  ) : null;
}

AlgoLink.propTypes = {
  type: PropTypes.oneOf(['transaction', 'account', 'asset']).isRequired,
  hash: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  length: PropTypes.number,
};

AlgoLink.defaultProps = {
  length: 12,
};
