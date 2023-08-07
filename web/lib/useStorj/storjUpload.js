import {ensureUrl} from '@niftgen/ensureUrl';
import {xshPut} from '@niftgen/xshPut';
import {storjGet} from './storjGet';
import {storjPut} from './storjPut';

export async function storjUpload({txn, token, walletAddress, file, onProgress}) {
  const uploadUrl = await storjPut({txn, token, walletAddress, type: file.type});
  await xshPut({file: file, url: uploadUrl, onProgress});
  const filePath = new URL(uploadUrl).pathname.substring(1);
  const downloadUrl = await storjGet({txn, token, walletAddress, key: filePath});
  await ensureUrl(downloadUrl);

  return {
    filePath,
    downloadUrl,
  };
}
