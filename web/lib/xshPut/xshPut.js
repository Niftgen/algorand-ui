export async function xshPut({url, file, onProgress}) {
  const reader = new FileReader();
  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener('progress', function (e) {
      const loaded = e.loaded;
      const total = e.total;
      const percentage = Math.round((loaded / total) * 100);
      onProgress({loaded, total, percentage});
    });
    xhr.upload.addEventListener('load', resolve);
    xhr.upload.addEventListener('error', reject);
    xhr.open('PUT', url, true);
    reader.onload = function (evt) {
      xhr.send(evt.target.result);
    };

    reader.readAsArrayBuffer(file);
  });
}
