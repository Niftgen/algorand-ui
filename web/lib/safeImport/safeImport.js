const RETRY_DELAY = 2000;
const RETRY_LIMIT = 10;

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function safeImport(importer) {
  for (let step = 0; step < RETRY_LIMIT; step++) {
    try {
      return await importer();
    } catch (error) {
      console.error(error);
      await timeout(RETRY_DELAY);
    }
  }

  // We went over the limit, did not return the import result successfully so need a full reload
  document.location.reload();
}
