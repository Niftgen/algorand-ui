export const USD = 'USD';
export const ALGO = 'ALGO';
export const NIFTGEN = 'NIFTGEN';

export const PRECISION = {
  [USD]: 2,
  [ALGO]: 6,
  [NIFTGEN]: 6,
};

const ID = {
  [USD]: 666,
  [ALGO]: 0,
  [NIFTGEN]: 1,
};

const LABEL = {
  [USD]: 'USD',
  [ALGO]: 'ALGO',
  [NIFTGEN]: 'NIFTGEN',
};

export class NoPriceError extends Error {
  constructor() {
    super('Must have price specified');
  }
}

export class NoCurrencyError extends Error {
  constructor() {
    super('Must have currency specified');
  }
}

export class UnknownCurrencyError extends Error {
  constructor(currency) {
    super(`Unknown currency "${currency}" specified`);
  }
}

export function renderPrice(price, currency) {
  if (price === undefined) {
    throw new NoPriceError();
  }
  if (currency === undefined) {
    throw new NoCurrencyError();
  }
  if (!(currency in PRECISION)) {
    throw new UnknownCurrencyError(currency);
  }
  return (price / Math.pow(10, PRECISION[currency])).toFixed(PRECISION[currency]);
}
