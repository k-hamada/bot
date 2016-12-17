const holiday = require('holiday-jp');

const isHoliday = date => [1, 6].includes(date.getDay());
const emptyAction = () => {};

module.exports = (action) => {
  const today = new Date();

  if (isHoliday(today) || holiday.isHoliday(today)) {
    return emptyAction;
  }

  return action;
};
