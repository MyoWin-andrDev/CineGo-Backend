
const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const setTime = (date, hour, minute = 0) => {
    const d = new Date(date);
    d.setHours(hour, minute, 0, 0);
    return d;
};

module.exports = { addDays, setTime };
