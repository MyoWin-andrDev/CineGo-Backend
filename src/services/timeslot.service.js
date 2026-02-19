const TimeSlot = require('../models/timeSlot.model');
const Hall = require('../models/hall.model');
const { addDays, setTime } = require('../utils/time.utils');

const TIME_SLOTS = [
    { hour: 10, price: 7.5 },
    { hour: 16, price: 7.5 }
];

const generateTimeSlots = async (movies) => {
    const halls = await Hall.find(); // IMAX hall
    const today = new Date();

    for (const movie of movies) {
        for (const hall of halls) {
            for (let day = 0; day < 7; day++) {
                const showDate = addDays(today, day);

                for (const slot of TIME_SLOTS) {
                    const startTime = setTime(showDate, slot.hour);
                    const endTime = setTime(showDate, slot.hour + 2);

                    await TimeSlot.updateOne(
                        {
                            movie: movie._id,
                            hall: hall._id,
                            show_date: showDate,
                            start_time: startTime
                        },
                        {
                            $setOnInsert: {
                                movie: movie._id,
                                hall: hall._id,
                                show_date: showDate,
                                start_time: startTime,
                                end_time: endTime,
                                base_price: slot.price
                            }
                        },
                        { upsert: true }
                    );
                }
            }
        }
    }
};

module.exports = { generateTimeSlots };
