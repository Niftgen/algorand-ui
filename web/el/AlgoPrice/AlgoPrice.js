import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {USD} from '@niftgen/currency';
import {Price} from '@niftgen/Price';
import {useAlgoPrice} from '@niftgen/useAlgoPrice';

export function AlgoPrice() {
  const {data} = useAlgoPrice();

  return data ? (
    <Tooltip title="Price provided by CoinGecko" arrow>
      <Typography whiteSpace="nowrap">
        Current ALGO price: <Price currency={USD} price={data.price * 100} />
      </Typography>
    </Tooltip>
  ) : null;
}
