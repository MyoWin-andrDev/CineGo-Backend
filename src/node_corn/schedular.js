const cron = require('node-cron');
const { syncWeeklyNowPlaying } = require('../services/weeklySync.service');

const WEEKLY_SYNC_CRON = process.env.WEEKLY_SYNC_CRON || '0 0 * * 0';
const CRON_TIMEZONE = process.env.CRON_TIMEZONE || 'UTC';

if (!cron.validate(WEEKLY_SYNC_CRON)) {
    throw new Error(`Invalid WEEKLY_SYNC_CRON value: ${WEEKLY_SYNC_CRON}`);
}

const weeklySyncTask = cron.schedule(
    WEEKLY_SYNC_CRON,
    async () => {
        try {
            const result = await syncWeeklyNowPlaying();
            console.log(`[Weekly Sync] Success. Assigned ${result.assignment.length} cinemas.`);
        } catch (error) {
            console.error('[Weekly Sync] Failed:', error.message);
        }
    },
    { timezone: CRON_TIMEZONE }
);

console.log(`[Weekly Sync] Scheduled with cron="${WEEKLY_SYNC_CRON}" timezone="${CRON_TIMEZONE}"`);

module.exports = { weeklySyncTask };
