import {useEffect, useState} from 'react';

function getNow() {
  return Math.floor(new Date().getTime() / 1000) * 1000;
}

export function useTiktok(interval = 1_000) {
  const [now, setNow] = useState(getNow());

  useEffect(() => {
    function tiktok() {
      setNow(getNow());
    }

    const timer = setInterval(tiktok, interval);
    return () => {
      clearInterval(timer);
    };
  }, [interval]);

  return now;
}
