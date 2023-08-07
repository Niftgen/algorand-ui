import {ALGO, NIFTGEN, PRECISION, renderPrice, USD} from '@niftgen/currency';
import {useAlgoPrice} from '@niftgen/useAlgoPrice';
import PropTypes from 'prop-types';

export function Algo(props) {
  return (
    <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="currentColor"
        d="M0 12h2l5.5-9.5.694 2.637L4 12h2.5l2.375-4.275L10 12h2l-1.707-6.828L11.5 3H9.75L9 0H7L0 12Z"
      />
    </svg>
  );
}

export function Niftgen(props) {
  return (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="#313FFF"
        fillRule="evenodd"
        d="M8 15.143A7.143 7.143 0 1 0 8 .857a7.143 7.143 0 0 0 0 14.286ZM8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Z"
        clipRule="evenodd"
      />
      <path
        fill="#313FFF"
        d="M9.94 8.356a.484.484 0 0 1-.696 0L5.519 4.544c-.198-.202-.535-.059-.535.227v6.38c0 .29.346.43.54.22l.515-.556a.484.484 0 0 1 .696-.02c.197.192.206.51.019.712l-.515.557C5.432 12.935 4 12.35 4 11.15V4.77c0-1.182 1.397-1.774 2.215-.938L9.94 7.644a.512.512 0 0 1 0 .712Z" /* eslint-disable-line max-len */
      />
      <path
        fill="#313FFF"
        d="M6.023 7.644a.484.484 0 0 1 .696 0l3.725 3.812c.197.202.535.059.535-.227V4.85c0-.29-.346-.43-.54-.22l-.516.556a.484.484 0 0 1-.695.02.512.512 0 0 1-.019-.712l.515-.557c.807-.871 2.239-.286 2.239.914v6.38c0 1.182-1.397 1.774-2.215.938L6.023 8.356a.512.512 0 0 1 0-.712Z" /* eslint-disable-line max-len */
      />
    </svg>
  );
}

function getSymbol(currency) {
  switch (currency) {
    case NIFTGEN:
      return (
        <>
          <Niftgen style={{width: '1.1em', height: '1.1em', marginBottom: '-3px'}} />{' '}
        </>
      );
    case ALGO:
      return (
        <>
          <Algo style={{width: '0.7em', height: '0.7em'}} />{' '}
        </>
      );
    case USD:
      return <>$ </>;
    default:
      return null;
  }
}

export function Price({currency, price}) {
  return typeof price === 'number' ? (
    <span style={{whiteSpace: 'nowrap'}}>
      {getSymbol(currency)}
      {renderPrice(price, currency)}
    </span>
  ) : null;
}

Price.propTypes = {
  currency: PropTypes.string,
  price: PropTypes.number,
};

export function PriceInUSD({currency, price}) {
  const {data} = useAlgoPrice();

  if (!price || currency !== ALGO || !data?.price) {
    return null;
  }

  const usdPrice = (price / Math.pow(10, PRECISION[currency])) * data.price * Math.pow(10, PRECISION[USD]);
  return (
    <span style={{whiteSpace: 'nowrap'}}>
      {getSymbol(USD)}
      {renderPrice(usdPrice, USD)}
    </span>
  );
}

PriceInUSD.propTypes = {
  currency: PropTypes.string,
  price: PropTypes.number,
};
