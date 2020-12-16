const client = require('axios');
const { html } = require('cheerio');
const cheerio = require('cheerio');
const { stat } = require('fs');


async function loadMatchup(gameId) {
  try {
    const { data } = await client.get('https://www.espn.com/college-football/matchup?gameId=' + gameId, {
      timeout: 30000
    });
    const matchupHtml = getHtml(data, '#teamstats-wrap');
    return matchupHtml;
  } catch (err) {
    console.log('ERROR RETRIEVING SCOREBOARD FOR ' + gameId + '\n' + err);
    return null;
  }

}

function getHtml(htmlString, selector) {
  if (htmlString) {
    const $ = cheerio.load(htmlString);
    return $(selector).html();
  }
  return '';
}

function getValue(htmlString, selector, iteration) {
  if (htmlString) {
    if (!iteration) {
      iteration = 0;
    }

    const $ = cheerio.load(htmlString, {
      normalizeWhitespace: true,
      xmlMode: true
    });
    var value = $(selector).eq(iteration);
    return value.text();
  }
  return '';
}

async function getThirdDownEfficiency(gameId) {
  var stats = [];
  try {
    var matchup = await loadMatchup(gameId);

    var thirdDown = getHtml(matchup, 'tr[data-stat-attr="thirdDownEff"]');
    var away_stat = {};

    away_stat.team = 'away';
    away_stat.thirdDownEfficiency = getValue(thirdDown, 'td', 1);
    stats.push(away_stat);

    var home_stat = {};
    home_stat.team = 'home';
    home_stat.thirdDownEfficiency = getValue(thirdDown, 'td', 2);
    stats.push(home_stat);

  } catch (err) {
    console.log('FAILED TO LOAD THIRD DOWN EFFICIENCY FOR ' + gameId);
  }
  return stats;
}

async function getTotalPlays(gameId) {
  var stats = [];
  try {
    var matchup = await loadMatchup(gameId);

    var totalPlays = getHtml(matchup, 'tr[data-stat-attr="totalOffensivePlays"]');

    var away_stat = {};
    away_stat.team = 'away';
    away_stat.totalPlays = getValue(totalPlays, 'td', 1);
    stats.push(away_stat);

    var home_stat = {};
    home_stat.team = 'home';
    home_stat.totalPlays = getValue(totalPlays, 'td', 2);
    stats.push(home_stat);
  } catch (err) {
    console.log('FAILED TO LOAD TOTAL PLAYS FOR ' + gameId);
  }
  return stats;
}

async function getPassingStats(gameId) {
  var stats = [];

  try {
    var matchup = await loadMatchup(gameId);

    var totalPassing = getHtml(matchup, 'tr[data-stat-attr="netPassingYards"]');
    var attempts = getHtml(matchup, 'tr[data-stat-attr="completionAttempts"]');
    var yrdsPass = getHtml(matchup, 'tr[data-stat-attr="yardsPerPass"]');

    var away_stat = {};
    away_stat.team = 'away';
    away_stat.totalPassingYards = getValue(totalPassing, 'td', 1);
    away_stat.passingAttempts = getValue(attempts, 'td', 1);
    away_stat.yardsPerPass = getValue(yrdsPass, 'td', 1);
    stats.push(away_stat);

    var home_stat = {};

    home_stat.team = 'home';
    home_stat.totalPassingYards = getValue(totalPassing, 'td', 2);
    home_stat.passingAttempts = getValue(attempts, 'td', 2);
    home_stat.yardsPerPass = getValue(yrdsPass, 'td', 2);
    stats.push(home_stat);
  } catch (err) {
    console.log('FAILED TO LOAD PASSING STATS FOR ' + gameId);
  }
  return stats;
}

async function getRushingStats(gameId) {
  var stats = [];

  try {
    var matchup = await loadMatchup(gameId);

    var totalRushing = getHtml(matchup, 'tr[data-stat-attr="rushingYards"]');
    var attempts = getHtml(matchup, 'tr[data-stat-attr="rushingAttempts"]');
    var yrdsRush = getHtml(matchup, 'tr[data-stat-attr="yardsPerRushAttempt"]');

    var away_stat = {};
    away_stat.team = 'away';
    away_stat.totalRushingYards = getValue(totalRushing, 'td', 1);
    away_stat.totalAttempts = getValue(attempts, 'td', 1);
    away_stat.yardsPerRush = getValue(yrdsRush, 'td', 1);
    stats.push(away_stat);


    var home_stat = {};
    home_stat.team = 'home';
    home_stat.totalRushingYards = getValue(totalRushing, 'td', 2);
    home_stat.totalAttempts = getValue(attempts, 'td', 2);
    home_stat.yardsPerRush = getValue(yrdsRush, 'td', 2);
    stats.push(home_stat);
  } catch (err) {
    console.log('FAILED TO LOAD RUSHING STATS FOR ' + gameId);
  }
  return stats;
}

async function getRedZone(gameId) {
  var stats = [];
  try {
    var matchup = await loadMatchup(gameId);

    var redzone = getHtml(matchup, 'tr[data-stat-attr="redZoneAttempts"]');

    var away_stat = {};

    away_stat.team = 'away';
    away_stat.redzone = getValue(redzone, 'td', 1);
    stats.push(away_stat);

    var home_stat = {};

    home_stat.team = 'home';
    home_stat.redzone = getValue(redzone, 'td', 2);
    stats.push(home_stat);
  } catch (err) {
    console.log('FAILED TO LOAD REDZONE STATS FOR ' + gameId);
  }
  return stats;

}

async function getPenalties(gameId) {
  var stats = [];

  try {
    var matchup = await loadMatchup(gameId);

    var penalty = getHtml(matchup, 'tr[data-stat-attr="totalPenaltiesYards"]');
    var away_stat = {};

    away_stat.team = 'away';
    away_stat.penalties = getValue(penalty, 'td', 1);
    stats.push(away_stat);

    var home_stat = {};

    home_stat.team = 'home';
    home_stat.penalties = getValue(penalty, 'td', 2);
    stats.push(home_stat);
  } catch (err) {
    console.log('FAILED TO LOAD PENALTIES FOR ' + gameId);
  }
  return stats;

}

async function getTurnovers(gameId) {
  var stats = [];
  try {
    var matchup = await loadMatchup(gameId);

    var turnover = getHtml(matchup, 'tr[data-stat-attr="turnovers"]');

    var away_stat = {};
    away_stat.team = 'away';
    away_stat.turnovers = getValue(turnover, 'td', 1);
    stats.push(away_stat);

    var home_stat = {};
    home_stat.team = 'home';
    home_stat.turnovers = getValue(turnover, 'td', 2);
    stats.push(home_stat);
  } catch (err) {
    console.log('FAILED TO LOAD TURNOVERS FOR ' + gameId);
  }
  return stats;

}

async function getDefenseTouchdowns(gameId) {
  var stats = [];
  try {
    var matchup = await loadMatchup(gameId);

    var deftd = getHtml(matchup, 'tr[data-stat-attr="defensiveTouchdowns"]');
    var away_stat = {};
    away_stat.team = 'away';
    away_stat.defensiveTouchdowns = getValue(deftd, 'td', 1);
    stats.push(away_stat);

    var home_stat = {};
    home_stat.team = 'home';
    home_stat.defensiveTouchdowns = getValue(deftd, 'td', 2);
    stats.push(home_stat);
  } catch (err) {
    console.log('FAILED TO LOAD DEFENSE TOUCHDOWNS FOR ' + gameId);
  }
  return stats;
}

async function getPossessionTime(gameId) {
  var stats = [];
  try {
    var matchup = await loadMatchup(gameId);

    var possession = getHtml(matchup, 'tr[data-stat-attr="possessionTime"]');

    var away_stat = {};
    away_stat.team = 'away';
    away_stat.possessionTime = getValue(possession, 'td', 1);
    stats.push(away_stat);

    var home_stat = {};
    home_stat.team = 'home';
    home_stat.possessionTime = getValue(possession, 'td', 2);
    stats.push(home_stat);
  } catch (err) {
    console.log('FAILED TO LOAD POSSESSION TIME FOR ' + gameId);
  }
  return stats;
}

exports.loadMatchup = loadMatchup;
exports.getThirdDownEfficiency = getThirdDownEfficiency;
exports.getTotalPlays = getTotalPlays;
exports.getPassingStats = getPassingStats;
exports.getRushingStats = getRushingStats;
exports.getRedZone = getRedZone;
exports.getPenalties = getPenalties;
exports.getTurnovers = getTurnovers;
exports.getDefenseTouchdowns = getDefenseTouchdowns;
exports.getPossessionTime = getPossessionTime;







