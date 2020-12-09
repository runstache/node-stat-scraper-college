const { default: Axios } = require('axios');
const client = require('axios');
const driveHelper = require('./drivehelper.js');

var weekNumber = 12;

async function loadScoreData (callback) {
    const { data } = await client.get('https://www.espn.com/nfl/playbyplay?gameId=401220302');
    callback(data);    
}

let games = [];
/*
loadScoreData(function(result) {
  const fs = require('fs');
  var filename = 'playbyplay.html';
  console.log('WRITING TO FILE: ' + filename);
  fs.writeFile(filename, result, function(err) {
    if (err) {
      console.log(err);
    }
  });
  
});
*/

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

driveHelper.getBigPlays('401220302');