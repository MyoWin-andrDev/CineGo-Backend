const cron = require('node-cron');
const { syncNowPlaying } = require('../controllers/timeslot.controller');

cron.schedule('0 0 */7 * *', async () => {
    await syncNowPlaying({}, { json: () => {} });
});
