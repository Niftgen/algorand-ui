import {ALGO} from '@niftgen/currency';

export const AUCTION = 'auction';
export const FIXED_PRICE = 'fixed';

export const placeholderData = {
  id: 0,
  kind: 'NFT_IMAGE',
  deleted: false,
  assetId: null,
  name: '',
  description: '',
  cover: '',
  duration: -1,
  filePath: '',
  ipfsPath: '',
  createdAt: null,
  updatedAt: null,
  price: null,
  currency: ALGO,
  rating: 0,
  views: 0,
  owner: {},
  minter: {},
  categories: [],
  ratingTotals: {
    ratingCount: 0,
    averageRating: 0,
  },
  totalComments: 0,
  myRating: 0,
  metadata: {},

  mint: {
    txn: '',
    createdAt: null,
  },
  app: {
    appId: 0,
    appAddress: '',
    txn: '',
    royaltyFee: 0,
    createdAt: null,
  },
  optin: {
    txn: '',
    createdAt: null,
  },
  list: {
    txn: '',
    createdAt: null,
  },
  delist: {
    txn: '',
    createdAt: null,
  },
  buy: {
    txn: '',
    createdAt: null,
  },
  auction: {
    startTime: null,
    endTime: null,
    amount: null,
    txn: '',

    isAuction: false,
    hasNotStartedYet: true,
    hasFinished: false,
    isActive: false,
  },
  winningBid: {
    txn: '',
    amount: null,
    owner: {
      walletAddress: '',
    },
    createdAt: null,
  },

  listingType: '',
};
