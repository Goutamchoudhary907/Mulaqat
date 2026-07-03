import cron from 'node-cron';

export function startKeepAlive() {
  const base = process.env.RENDER_EXTERNAL_URL || process.env.SELF_URL;
  if (!base) {
    console.log('⏰ Keep-alive disabled (no RENDER_EXTERNAL_URL / SELF_URL).');
    return;
  }

  const url = `${base.replace(/\/+$/, '')}/api/health`;

  // Every 14 min, but only during active hours (8:00am–1:59am IST). We let the
  // free instance sleep through the dead ~2am–8am window to save instance-hours.
  // Hours 8-23 = 8am–11:59pm, 0-1 = 12am–1:59am. Timezone pinned to IST because
  // the server clock is UTC.
  cron.schedule(
    '*/14 8-23,0-1 * * *',
    async () => {
      try {
        const res = await fetch(url, { headers: { 'x-keep-alive': '1' } });
        console.log(`⏰ keep-alive ping → ${res.status}`);
      } catch (err) {
        console.warn(`⏰ keep-alive ping failed: ${err.message}`);
      }
    },
    { timezone: 'Asia/Kolkata' }
  );

  console.log(`⏰ Keep-alive scheduled every 14 min, 8am–2am IST → ${url}`);
}
