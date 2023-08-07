import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isDate from 'date-fns/isDate';
import isValid from 'date-fns/isValid';
import isWithinInterval from 'date-fns/isWithinInterval';
import parseISO from 'date-fns/parseISO';
import {AUCTION, FIXED_PRICE, placeholderData as DEFAULT_ASSET} from './placeholderData';

function normaliseListingType(nft) {
  if (nft?.saleType?.id === 1) {
    return AUCTION;
  }

  if (nft?.saleType?.id === 2) {
    return FIXED_PRICE;
  }

  return '';
}

function normaliseDate(value, defaultValue) {
  if (isDate(value)) {
    return value;
  }
  if (value) {
    const maybeValue = parseISO(value);
    if (isValid(maybeValue)) {
      return maybeValue;
    }
  }

  return defaultValue;
}

function normaliseAuction(nft) {
  const startTime = normaliseDate(nft?.auction?.startTime, DEFAULT_ASSET.auction.startTime);
  const endTime = normaliseDate(nft?.auction?.endTime, DEFAULT_ASSET.auction.endTime);
  const amount = nft?.auction?.amount || DEFAULT_ASSET.auction.amount;
  const txn = nft?.auction?.txn || DEFAULT_ASSET.auction.txn;

  const isAuction = Boolean(nft?.mint?.txn && nft?.auction?.txn);

  const now = new Date();
  const hasNotStartedYet = startTime && isBefore(now, startTime);
  const hasFinished = endTime && isAfter(now, endTime);
  const isActive = startTime && endTime && isWithinInterval(now, {start: startTime, end: endTime});
  return {
    startTime,
    endTime,
    amount,
    txn,
    isAuction,
    hasNotStartedYet,
    hasFinished,
    isActive,
  };
}

export function normaliseMetadata(nft) {
  if (nft.metadata && typeof nft.metadata === 'string') {
    try {
      return JSON.parse(nft.metadata);
    } catch (_e) {
      // nothing
    }
  }
  return DEFAULT_ASSET.metadata;
}

export function select(nft = {}) {
  return {
    id: nft.id || DEFAULT_ASSET.id,
    kind: nft.kind || DEFAULT_ASSET.kind,
    deleted: nft.deleted || DEFAULT_ASSET.deleted,
    assetId: nft.assetId || DEFAULT_ASSET.assetId,
    name: nft.name || DEFAULT_ASSET.name,
    description: nft.description || DEFAULT_ASSET.description,
    cover: nft.cover || nft.ipfsPath || DEFAULT_ASSET.cover,
    duration: nft.duration || DEFAULT_ASSET.duration,
    filePath: nft.filePath || DEFAULT_ASSET.filePath,
    ipfsPath: nft.ipfsPath || DEFAULT_ASSET.ipfsPath,
    createdAt: new Date(nft.createdAt),
    updatedAt: new Date(nft.updatedAt),
    price: nft.price || DEFAULT_ASSET.price,
    currency: nft.currency || DEFAULT_ASSET.currency,
    rating: nft.rating || DEFAULT_ASSET.rating,
    views: nft.views || DEFAULT_ASSET.views,
    owner: nft.owner || DEFAULT_ASSET.owner,
    minter: nft.minter || DEFAULT_ASSET.minter,
    categories: nft.categories || DEFAULT_ASSET.categories,
    ratingTotals: {
      ratingCount: nft?.ratingTotals?.ratingCount || DEFAULT_ASSET.ratingTotals.ratingCount,
      averageRating: nft?.ratingTotals?.averageRating || DEFAULT_ASSET.ratingTotals.averageRating,
    },
    totalComments: nft.totalComments || DEFAULT_ASSET.totalComments,
    myRating: nft.myRating || DEFAULT_ASSET.myRating,
    metadata: normaliseMetadata(nft),

    app: {
      appId: nft?.app?.appId || DEFAULT_ASSET.app.appId,
      appAddress: nft?.app?.appAddress || DEFAULT_ASSET.app.appAddress,
      royaltyFee: nft?.app?.royaltyFee || DEFAULT_ASSET.app.royaltyFee,
      txn: nft?.app?.txn || DEFAULT_ASSET.app.txn,
      createdAt: nft?.app?.createdAt ? new Date(nft.app.createdAt) : DEFAULT_ASSET.app.createdAt,
    },
    optin: {
      txn: nft?.optin?.txn || DEFAULT_ASSET.optin.txn,
      createdAt: nft?.optin?.createdAt ? new Date(nft.optin.createdAt) : DEFAULT_ASSET.optin.createdAt,
    },
    mint: {
      txn: nft?.mint?.txn || DEFAULT_ASSET.mint.txn,
      createdAt: nft?.mint?.createdAt ? new Date(nft.mint.createdAt) : DEFAULT_ASSET.mint.createdAt,
    },
    list: {
      txn: nft?.list?.txn || DEFAULT_ASSET.list.txn,
      createdAt: nft?.list?.createdAt ? new Date(nft.list.createdAt) : DEFAULT_ASSET.list.createdAt,
    },
    delist: {
      txn: nft?.delist?.txn || DEFAULT_ASSET.delist.txn,
      createdAt: nft?.delist?.createdAt ? new Date(nft.delist.createdAt) : DEFAULT_ASSET.delist.createdAt,
    },
    buy: {
      txn: nft?.buy?.txn || DEFAULT_ASSET.buy.txn,
      createdAt: nft?.buy?.createdAt ? new Date(nft.buy.createdAt) : DEFAULT_ASSET.buy.createdAt,
    },
    winningBid: {
      txn: nft?.winningBid?.txn || DEFAULT_ASSET.winningBid.txn,
      amount: nft?.winningBid?.amount || DEFAULT_ASSET.winningBid.amount,
      createdAt: nft?.winningBid?.createdAt ? new Date(nft.winningBid.createdAt) : DEFAULT_ASSET.winningBid.createdAt,
      owner: {
        walletAddress: nft?.winningBid?.owner?.walletAddress || DEFAULT_ASSET.winningBid.owner.walletAddress,
      },
    },

    auction: normaliseAuction(nft),

    listingType: normaliseListingType(nft),
  };
}
