const Agenda = require('agenda');


module.exports = async function(app) {
  const agenda = new Agenda({ db: { address: app.get('mongodb') } });
 
  await agenda.start();
  
};
