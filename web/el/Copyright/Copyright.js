import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {useConfig} from '@niftgen/useConfig';
import format from 'date-fns/format';
import {useMemo} from 'react';

function Version() {
  const {version} = useConfig();

  const {date, utc} = useMemo(() => {
    const date = new Date(version.time);
    const iso = date.toISOString();
    const utcDate = iso.slice(0, 10).replaceAll('-', '');
    const utcTime = iso.slice(11, 19).replaceAll(':', '');
    return {
      date,
      utc: `${utcDate}-${utcTime}`,
    };
  }, [version.time]);
  return (
    <Typography component="span" whiteSpace="nowrap">
      Version {version.sha}{' '}
      <Tooltip title={format(date, 'yyMMdd-HHmmss')} arrow>
        <span>{utc}</span>
      </Tooltip>
    </Typography>
  );
}

export function Copyright() {
  return (
    <>
      <Typography component="span" whiteSpace="nowrap">
        &copy; {new Date().getFullYear()} Niftgen, Inc.
      </Typography>{' '}
      <Version />
    </>
  );
}
