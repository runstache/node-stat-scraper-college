const boxscoreHelper = require('./boxscorehelper.js');
const matchupHelper = require('./matchuphelper.js');
const scoreboardHelper = require('./scoreboardhelper.js');
const driveHelper = require('./drivehelper.js');

const weekNumber = '12';
const outputDirectory = '/mnt/c/data/json/';

console.log('Building Stats for Week ' + weekNumber);
scoreboardHelper.loadScoreData(weekNumber, processScoreBoard);

async function processScoreBoard(scoreboard) {
  var i;
  for (i = 0; i < scoreboard.length; i++) {
    
    var item = scoreboard[i];    
    await buildItem(item);
  }
}

async function buildItem(item) {
  console.log('Building Stats for: ' + item.id);
  var gamestats = {};
  var boxscore = {};
  var matchup = {};
  
  var gameId = item.id;
  gamestats.id = item.id;
  gamestats.game = item;

  const pass = boxscoreHelper.getPassingTotals(gameId);
  pass.then(v => boxscore.passing = v).catch((error) => console.log(gameId + '-PASSING TOTALS: ' + error))
  .then(() => boxscoreHelper.getDefenseTotals(gameId).then(v => boxscore.defense = v)).catch((error) => console.log(gameId + '-DEFENSE TOTALS: ' + error))
  .then(() => boxscoreHelper.getFumbles(gameId).then(v => boxscore.fumbles = v)).catch((error) => console.log(gameId + '-FUMBLES TOTALS: ' + error))
  .then(() => boxscoreHelper.getInterceptions(gameId).then(v => boxscore.interceptions = v)).catch((error) => console.log(gameId + '-INTERCEPTION TOTALS: ' + error))
  .then(() => boxscoreHelper.getKickReturns(gameId).then(v => boxscore.kickReturns = v)).catch((error) => console.log(gameId + '-KICK RETURNS TOTALS: ' + error))
  .then(() => boxscoreHelper.getKicking(gameId).then(v => boxscore.kicking = v)).catch((error) => console.log(gameId + '-KICKING TOTALS: ' + error))
  .then(() => boxscoreHelper.getPuntReturns(gameId).then(v => boxscore.puntReturns = v)).catch((error) => console.log(gameId + '-PUNT RETURN TOTALS: ' + error))
  .then(() => boxscoreHelper.getPunting(gameId).then(v => boxscore.punting = v)).catch((error) => console.log(gameId + '-PUNTING TOTALS: ' + error))
  .then(() => boxscoreHelper.getReceivingTotals(gameId).then(v => boxscore.receiving = v)).catch((error) => console.log(gameId + '-RECEIVING TOTALS: ' + error))
  .then(() => boxscoreHelper.getRushingTotals(gameId).then(v => boxscore.rushing = v)).catch((error) => console.log(gameId + '-RUSHING TOTALS: ' + error))
  .then(() => gamestats.boxscore = boxscore)
  .then(() => matchupHelper.getDefenseTouchdowns(gameId).then(v => matchup.defenseTouchdowns = v)).catch((error) => console.log(gameId + '-DEFENSE TOUCHDOWN TOTALS: ' + error))
  .then(() => matchupHelper.getPassingStats(gameId).then(v => matchup.passingStats = v)).catch((error) => console.log(gameId + '-TEAM PASSING TOTALS: ' + error))
  .then(() => matchupHelper.getPenalties(gameId).then(v => matchup.penalties = v)).catch((error) => console.log(gameId + '-PENALTY TOTALS: ' + error))
  .then(() => matchupHelper.getPossessionTime(gameId).then(v => matchup.possessionTime = v)).catch((error) => console.log(gameId + '-POSSESSION TOTALS: ' + error))
  .then(() => matchupHelper.getRedZone(gameId).then(v => matchup.redzone = v)).catch((error) => console.log(gameId + '-REDZONE TOTALS: ' + error))
  .then(() => matchupHelper.getRushingStats(gameId).then(v => matchup.rushing = v)).catch((error) => console.log(gameId + '-TEAM RUSHING TOTALS: ' + error))
  .then(() => matchupHelper.getThirdDownEfficiency(gameId).then(v => matchup.thirdDown = v)).catch((error) => console.log(gameId + '-THRID DOWN TOTALS: ' + error))
  .then(() => matchupHelper.getTotalPlays(gameId).then(v => matchup.totalPlays = v)).catch((error) => console.log(gameId + '-PLAY TOTALS: ' + error))
  .then(() => matchupHelper.getTurnovers(gameId).then(v => matchup.turnovers = v)).catch((error) => console.log(gameId + '-TURNOVER TOTALS: ' + error))
  .then(() => gamestats.matchup = matchup)
  .then(() => driveHelper.getBigPlays(gameId).then(v => gamestats.drives = v)).catch((error) => console.log(gameId + '-DRIVE SUMMARY: ' + error))
  .then(() => writeToFile(gamestats))
  .then(() => console.log('FINISHED'));
}

function writeToFile(stats) {
  const fs = require('fs');
  var filename = outputDirectory + stats.id + '.json';
  console.log('WRITING TO FILE: ' + filename);
  fs.writeFile(filename, JSON.stringify(stats), function(err) {
    if (err) {
      console.log(err);
    }
  });
  

  

}
