const client = require('axios');
const cheerio = require('cheerio');

async function loadScoreData(weekNumber, groupId, callback) {
  try {
    const { data } = await client.get('https://www.espn.com/college-football/scoreboard/_/group/' + groupId + '/year/2020/seasontype/2/week/' + weekNumber, {
      timeout: 30000
    });

    if (!data || data == null) {
      console.log('EMPTY SCOREBOARD');
    }
    const { JSDOM, VirtualConsole } = require('jsdom');
    const virtualConsole = new VirtualConsole();

    const dom = new JSDOM(data, {
      virtualConsole,
      runScripts: "dangerously"
    });

    dom.window.onload = () => {
      var scoredata = dom.window.espn.scoreboardData;
      var events = scoredata.events;
      var i;
      var games = [];
      
      for (i = 0; i < events.length; i++) {
        var item = events[i];
        var competition = item.competitions[0];
        var competitors = competition.competitors;
        var game = {};
        game.id = item.id;
        var j;
        var teams = [];
        for (j = 0; j < competitors.length; j++) {
          var competitor = competitors[j];
          var competitorTeam = competitor.team;
          var team = {};        
          team.score = competitor.score;
          team.name = competitorTeam.displayName;
          team.code = competitorTeam.abbreviation;
          team.image = getFileName(competitorTeam.logo);
          if (competitor.homeAway == 'home') {
            team.type = 'home';
          } else {
            team.type = 'away';
          }
          teams.push(team);
        }
        game.teams = teams;
        game.weekNumber = weekNumber;
        games.push(game);
      }
      callback(games);
    };
  } catch (err) {
    console.log('FAILED TO LOAD SCOREBOARD INFO FOR GROUP ' + groupId);
    console.log(err);
  }
}

async function getConferences() {
  const { data } = await client.get('https://www.espn.com/college-football/scoreboard');

  try {
    var conferenceList = getHtml(data, 'div.desktop-dropdown.dropdown-type-group');
  } catch (err) {
    console.log(err);
  }
  var conferences = [];

  var listing = getHtml(conferenceList, 'ul.dropdown-menu');
  const $ = cheerio.load(listing, {
    normalizeWhitespace: true,
    xmlMode: true
  });

  $('li').each(function (i, el) {
    try {
      var conferenceId = getAttributeValue(el, 'a', 'data-group');
      if (conferenceId) {
        conferences.push(conferenceId);
      }
    } catch (err) {
      console.log('Could not Find Conference Group Id');
    }
  });
  return conferences;
}


function getFileName(url) {

  var strings = url.split('/');
  var length = strings.length;

  var lastItem = strings[length - 1];
  var names = lastItem.split('&');
  return names[0];
}

function getHtml(htmlString, selector) {
  if (htmlString) {
    const $ = cheerio.load(htmlString);
    return $(selector).html();
  }
  return '';
}

function getAttributeValue(htmlString, selector, attribute) {
  if (htmlString) {
    const $ = cheerio.load(htmlString, {
      normalizeWhitespace: true,
      xmlMode: true
    });

    var value = $(selector).attr(attribute);
    return value;
  }
  return '';
}


exports.loadScoreData = loadScoreData;
exports.getConferences = getConferences;