// See README

var dateFormat = require('dateformat');
var fs = require('fs');

var separator = '==--==';

/**
 * {@link https://git-scm.com/docs/git-log}
 * @returns {array} Array of arguments for a GIT command (terminal)
 */
exports.generateArgs = function(afterDate, beforeDate, filePath) {
  // format:"%B%n"
  // format:%s#%b
  // %s: subject
  // %b: body
  // %cd: committer date, using --date format
  var logFormat = '%cd\t%s\t%b' + separator;

  var gitArgs = [
    '--pretty="format:' + logFormat + '"',
    // YYYY-MM-DD
    '--date=short',
    // Show no parents before all of its children are shown, but otherwise show commits in the commit timestamp order.
    '--date-order',
    // Do not print commits with more than one parent.    
    '--no-merges'
  ];

  //  var afterDate = new Date(Date.now() - (1000 * 60 * 60 * 24));
  //  var beforeDate = new Date();

  gitArgs.push('--after="' + dateFormat(afterDate, "isoDateTime") + '"');

  gitArgs.push('--before="' + dateFormat(beforeDate, "isoDateTime") + '"');
  
  // Save a result to filePath
  gitArgs.push('> ' + filePath);

  return gitArgs;
};

/**
* @returns {string|null} Parsed commit string
*/
var handleEachCommit = function(commitItem) {

  var maxTimeLength = 'time: 12h:34'.length;
  var timeIndex = commitItem.indexOf('time:');

  var timeStr;
  var mainStr;
  if (timeIndex >= 0) {
    timeStr = commitItem.substr(timeIndex, maxTimeLength);
    timeStr = timeStr.replace('time:', '').replace('h', '').trim();
    // Remove this part from the item (the time part - last part)
    mainStr = commitItem.substr(0, timeIndex);
  } else {
    mainStr = commitItem;
  }

  // Do not trim() this string - it removes necessary tabs
  mainStr = mainStr.replace(/\n/g, ' ');

  if (mainStr) {
    return mainStr + '\t' + (timeStr || 0);
  } else {
    return null;
  }
};

/**
* Write a result to a log file
*/
var handleRes = function(logFilePath, done, err, result) {
  if (err) {
    done(err);
    return;
  }


  var listOfBodyOfCommit = result.toString().split(separator);
  var listOfTabBody = listOfBodyOfCommit.map(handleEachCommit);
  // todo remove empty records

  fs.writeFile(logFilePath, listOfTabBody.join('\n'), done);
};

/**
 * Create a log file from a temporary file
 */
exports.createLog = function(tmpFilePath, logFilePath, done) {
  fs.readFile(tmpFilePath, handleRes.bind(null, logFilePath, done));
};

module.exports = exports;
