// const lookahead = 25.0; // how frequently to call scheduling function (in milliseconds)
// const scheduleAheadTime = 0.1; // how far ahead to schedule audio (sec)
//
//
// // inital time line 1px every 10 msecs
//
// let current_note = 0;
//
//
// // so what yu wanna o is have the scheduler checking every 25/50/100 msecs/pixels if anythng new has been drawn in front of it, - so check all the drawn shapes for an x reading, afor any in that block of time, schedule them using the one vairbale input for osc.start()
//
// let schedule_time = 0;


setInterval(()=>{
  debug('bar')
  // clear debug
  setTimeout(()=>{if(document.querySelector('#debug').textContent === 'bar'){debug('')}}, 200)
}, 60000 * 4 / tempo)
