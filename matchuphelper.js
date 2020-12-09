const client = require('axios');
const cheerio = require('cheerio');
const { stat } = require('fs');


async function loadMatchup(gameId) {
  const { data } = await client.get('https://www.espn.com/nfl/matchup?gameId=' + gameId);
  const matchupHtml = getHtml(data, '#teamstats-wrap');
  return matchupHtml;
  
}

function getHtml(htmlString, selector) {
  const $ = cheerio.load(htmlString);
  return $(selector).html();
}

function getValue(htmlString, selector, iteration) {

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

async function getThirdDownEfficiency(gameId) {
  var matchup = await loadMatchup(gameId);

  var thirdDown = getHtml(matchup, 'tr[data-stat-attr="thirdDownEff"]');
  var stats = [];
  var away_stat = {};

  away_stat.team = 'away';
  away_stat.thirdDownEfficiency = getValue(thirdDown, 'td', 1);
  stats.push(away_stat);
  
  var home_stat = {};
  home_stat.team = 'home';
  home_stat.thirdDownEfficiency = getValue(thirdDown, 'td', 2);
  stats.push(home_stat);
  return stats;  
}

async function getTotalPlays(gameId) {
  var matchup = await loadMatchup(gameId);

  var totalPlays = getHtml(matchup, 'tr[data-stat-attr="totalOffensivePlays"]');
  var stats = [];

  var away_stat = {};
  away_stat.team = 'away';
  away_stat.totalPlays = getValue(totalPlays, 'td', 1);
  stats.push(away_stat);

  var home_stat = {};
  home_stat.team = 'home';
  home_stat.totalPlays = getValue(totalPlays, 'td', 2);
  stats.push(home_stat);

  return stats;
}

async function getPassingStats(gameId) {
  var matchup = await loadMatchup(gameId);

  var totalPassing = getHtml(matchup, 'tr[data-stat-attr="netPassingYards"]');
  var attempts = getHtml(matchup, 'tr[data-stat-attr="completionAttempts"]');
  var yrdsPass = getHtml(matchup, 'tr[data-stat-attr="yardsPerPass"]');
  var stats = [];

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
  return stats;
}

async function getRushingStats(gameId) {
  var matchup = await loadMatchup(gameId);

  var totalRushing = getHtml(matchup, 'tr[data-stat-attr="rushingYards"]');
  var attempts = getHtml(matchup, 'tr[data-stat-attr="rushingAttempts"]');
  var yrdsRush = getHtml(matchup, 'tr[data-stat-attr="yardsPerRushAttempt"]');

  var stats = [];

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

  return stats;
}

async function getRedZone(gameId) {
  var matchup = await loadMatchup(gameId);

  var redzone = getHtml(matchup, 'tr[data-stat-attr="redZoneAttempts"]');
  var stats = [];

  var away_stat = {};

  away_stat.team = 'away';
  away_stat.redzone = getValue(redzone, 'td', 1);
  stats.push(away_stat);

  var home_stat = {};

  home_stat.team = 'home';
  home_stat.redzone = getValue(redzone, 'td', 2);
  stats.push(home_stat);

  return stats;

}

async function getPenalties(gameId) {
  var matchup = await loadMatchup(gameId);

  var penalty = getHtml(matchup, 'tr[data-stat-attr="totalPenaltiesYards"]');
  var stats = [];

  var away_stat = {};

  away_stat.team = 'away';
  away_stat.penalties = getValue(penalty, 'td', 1);
  stats.push(away_stat);

  var home_stat = {};

  home_stat.team = 'home';
  home_stat.penalties = getValue(penalty, 'td', 2);
  stats.push(home_stat);

  return stats;

}

async function getTurnovers(gameId) {
  var matchup = await loadMatchup(gameId);

  var turnover = getHtml(matchup, 'tr[data-stat-attr="turnovers"]');
  var stats = [];

  var away_stat = {};
  away_stat.team = 'away';
  away_stat.turnovers = getValue(turnover, 'td', 1);
  stats.push(away_stat);

  var home_stat = {};
  home_stat.team = 'home';
  home_stat.turnovers = getValue(turnover, 'td', 2);
  stats.push(home_stat);

  return stats;

}

async function getDefenseTouchdowns(gameId) {
  var matchup = await loadMatchup(gameId);

  var deftd = getHtml(matchup, 'tr[data-stat-attr="defensiveTouchdowns"]');
  var stats = [];

  var away_stat = {};
  away_stat.team = 'away';
  away_stat.defensiveTouchdowns = getValue(deftd, 'td', 1);
  stats.push(away_stat);

  var home_stat = {};
  home_stat.team = 'home';
  home_stat.defensiveTouchdowns = getValue(deftd, 'td', 2);
  stats.push(home_stat);

  return stats;
} 

async function getPossessionTime(gameId) {
  var matchup = await loadMatchup(gameId);

  var possession = getHtml(matchup, 'tr[data-stat-attr="possessionTime"]');

  var stats = [];

  var away_stat = {};
  away_stat.team = 'away';
  away_stat.possessionTime = getValue(possession, 'td', 1);
  stats.push(away_stat);

  var home_stat = {};
  home_stat.team = 'home';
  home_stat.possessionTime = getValue(possession, 'td', 2);
  stats.push(home_stat);

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







