export async function ensureUrl(url) {
  let count = 0;
  do {
    const response = await window.fetch(url, {method: 'GET'});
    if (response.status === 404) {
      await new Promise(ok => setTimeout(ok, count * 3000));
    } else {
      return url;
    }
    count++;
  } while (count < 10);
}
