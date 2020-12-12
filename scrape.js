const { default: Axios } = require('axios');
const client = require('axios');
const driveHelper = require('./drivehelper.js');
const scoreboardHelper = require('./scoreboardhelper.js');

var weekNumber = 12;

async function loadScoreData (callback) {
    const { data } = await client.get('https://www.espn.com/college-football/scoreboard/_/group/15/year/2020/seasontype/2/week/16');
    callback(data);    
}

let games = [];

loadScoreData(function(result) {
  const fs = require('fs');
  var filename = 'scoreboard.html';
  console.log('WRITING TO FILE: ' + filename);
  fs.writeFile(filename, result, function(err) {
    if (err) {
      console.log(err);
    }
  });
  
});

scoreboardHelper.getConferences().then((x) => console.log(x));



/*
var stringValue = '(15:00 - 1st) M.Davis up the middle to CAR 35 for 10 yards (I.Odenigbo; A.Harris).';
var regex = /for \d+ yards/g;
var matches = stringValue.match(regex);
var yardage = matches[0].replace('yards', '').replace('for', '');

if (yardage >= 10) {
  console.log(1);

} else {
  console.log(0);
}
*/