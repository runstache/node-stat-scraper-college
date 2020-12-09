const client = require('axios');
const cheerio = require('cheerio');

async function loadGamePlays(gameId) {
  const { data } = await client.get('https://www.espn.com/nfl/playbyplay?gameId=' + gameId);
  
  const gameplaysHtml = getHtml(data, '#gamepackage-drives-wrap');
  return gameplaysHtml;
}


function getHtml(htmlString, selector) {
  const $ = cheerio.load(htmlString);
  return $(selector).html();
}

function getValue(htmlString, selector) {
  const $ = cheerio.load(htmlString, {
    normalizeWhitespace: true,
    xmlMode: true
  });
  var value = $(selector);
  return value.text();
}

function getAttributeValue(htmlString, selector, attribute) {
  const $ = cheerio.load(htmlString, {
    normalizeWhitespace: true,
    xmlMode: true
  });

  var value = $(selector).attr(attribute);
  return value;
}

async function getBigPlays(gameId) {
  var gamePlayHtml = await loadGamePlays(gameId);
  var allPlays = getHtml(gamePlayHtml, 'ul.css-accordion');

  const $ = cheerio.load(allPlays, {
    normalizeWhitespace: true,
    xmlMode: true
  });

  var drives = [];

  $('li.accordion-item').each(function (i, el) {
    // Get the Accordion Header
    try {
      var header = getHtml(el, 'div.accordion-header');
      var imageValue = getAttributeValue(header, 'img.team-logo', 'src');

      var runs = 0;
      var pass = 0;
      var turnovers = 0;


      var drive = {};
      drive.logo = getImageName(imageValue);

      var driveTitle = getValue(header, 'span.headline');
      if (driveTitle && (driveTitle.toLowerCase().includes('blocked') || driveTitle.toLowerCase().includes('downs') || driveTitle.toLowerCase().includes('missed'))) {
        turnovers++;
      }

      var content = getHtml(el, 'div.accordion-content');
      var driveList = getHtml(content, 'ul.drive-list');

      const plays = cheerio.load(driveList, {
        normalizeWhitespace: true,
        xmlMode: true
      });

      plays('li').each(function (idx, element) {
        var play = getValue(element, 'span.post-play');
        var yards = parseInt(getYardage(play));
        if (yards > 0) {          
          if (play.toLowerCase().includes('pass') && yards >= 15) {
            pass++;
          } else {
            if (!play.toLowerCase().includes('pass') && yards >= 10) {
              runs++;
            }
          }
        }
      });
      drive.passes = pass;
      drive.runs = runs;
      drive.turnovers = turnovers;
      drives.push(drive);
    } catch (err) {
      console.log("REQUESTED SECTION NOT FOUND ON PAGE");
    }
  });
  return drives;
}

function getImageName(url) {
  var parts = url.split('/');
  if (parts && parts.length > 0) {
    var length = parts.length;
    var lastPiece = parts[length - 1];
    var pieces = lastPiece.split('&');
    if (pieces && pieces.length > 0) {
      return pieces[0];
    } else {
      return url;
    }
  } else {
    return url;
  }
}

function getYardage(playText) {
  if (playText.toLowerCase().includes('no play') || playText.toLowerCase().includes('penalty') || playText.toLowerCase().includes('kick') || playText.toLowerCase().includes('punt')) {
    return 0;
  } else {

    var regex = /for \d+ yards/g;
    var regex2 = /for \d+ yds/g;
    var matches = playText.match(regex);
    var yardage = 0;
    if (matches && matches != null && matches.length > 0) {
      yardage = matches[0].replace('yards', '').replace('for', '');
    } else {
      matches = playText.match(regex2);
      if (matches && matches != null && matches.length > 0) {
        yardage = matches[0].replace('yds', '').replace('for', '');
      } else {
        return 0;
      }
    }
    return parseInt(yardage);
  }
}

exports.loadGamePlays = loadGamePlays;
exports.getBigPlays = getBigPlays;