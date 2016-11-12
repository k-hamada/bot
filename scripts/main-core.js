// Commands:
//   hubot train <route>
//   hubot weather <area>
const CronJob = require('cron').CronJob;
const Forecast = require('./lib/forecast');
const Train = require('./lib/train');
const Say = require('./say');

module.exports = (robot) => {
  const sendTo = room => answer => robot.send({ room }, answer);
  const reply = msg => answer => msg.reply(answer);
  const sendAttachmentTo = room => (answer, attachments) => {
    robot.adapter.client.web.chat.postMessage(
      room, answer, { as_user: true, link_names: 1, attachments }
    );
  };

  const crontab = [
    ['00 00 08 * * *', Forecast, '東京', sendTo('#time')],
    ['00 55 08 * * *', Train, '京王線', sendAttachmentTo('#time')],
    ['00 00 19 * * *', Train, '京王線', sendAttachmentTo('#time')],
  ];
  crontab.forEach(([field, action, opt, cb]) => {
    new CronJob(field, Say, () => action(opt, cb)).start();
  });

  const defaultTrainRoute = '京王線';
  robot.respond(
    /train(\s*.*)/i,
    msg => Train((msg.match[1] || defaultTrainRoute).trim(), Say, reply(msg))
  );

  const defaultWeatherCity = '東京';
  robot.respond(
    /weather(\s*.*)/i,
    msg => Forecast((msg.match[1] || defaultWeatherCity).trim(), Say, reply(msg))
  );
};
