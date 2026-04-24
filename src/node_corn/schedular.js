const cron = require('node-cron');
const { syncWeeklyNowPlaying } = require('../services/weeklySync.service');
const { removeYesterdaySlots } = require('../services/timeslot.cleanup');

const WEEKLY_SYNC_CRON = process.env.WEEKLY_SYNC_CRON || '0 0 * * 0';
const TIMESLOT_CLEANUP_CRON = process.env.TIMESLOT_CLEANUP_CRON || '5 0 * * *';
const CRON_TIMEZONE = process.env.CRON_TIMEZONE || 'UTC';

if (!cron.validate(WEEKLY_SYNC_CRON)) {
    throw new Error(`Invalid WEEKLY_SYNC_CRON value: ${WEEKLY_SYNC_CRON}`);
}

if (!cron.validate(TIMESLOT_CLEANUP_CRON)) {
    throw new Error(`Invalid TIMESLOT_CLEANUP_CRON value: ${TIMESLOT_CLEANUP_CRON}`);
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

const timeslotCleanupTask = cron.schedule(
    TIMESLOT_CLEANUP_CRON,
    async () => {
        try {
            const result = await removeYesterdaySlots();
            console.log(
                `[Timeslot Cleanup] Success. Deleted timeslots=${result.deletedTimeSlots}, bookings=${result.deletedBookings}, seatReservations=${result.deletedSeatReservations}.`
            );
        } catch (error) {
            console.error('[Timeslot Cleanup] Failed:', error.message);
        }
    },
    { timezone: CRON_TIMEZONE }
);

console.log(`[Weekly Sync] Scheduled with cron="${WEEKLY_SYNC_CRON}" timezone="${CRON_TIMEZONE}"`);
console.log(`[Timeslot Cleanup] Scheduled with cron="${TIMESLOT_CLEANUP_CRON}" timezone="${CRON_TIMEZONE}"`);

module.exports = { weeklySyncTask, timeslotCleanupTask };
