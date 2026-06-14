import cron from 'node-cron';

export function startKeepAlive() {
  const base = process.env.RENDER_EXTERNAL_URL || process.env.SELF_URL;
  if (!base) {
    console.log('⏰ Keep-alive disabled (no RENDER_EXTERNAL_URL / SELF_URL).');
    return;
  }

  const url = `${base.replace(/\/+$/, '')}/api/health`;

  // Every 14 minutes
  cron.schedule('*/14 * * * *', async () => {
    try {
      const res = await fetch(url, { headers: { 'x-keep-alive': '1' } });
      console.log(`⏰ keep-alive ping → ${res.status}`);
    } catch (err) {
      console.warn(`⏰ keep-alive ping failed: ${err.message}`);
    }
  });

  console.log(`⏰ Keep-alive scheduled every 14 min → ${url}`);
}
