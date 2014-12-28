var dateFormat = require('dateformat');
var fs = require('fs');

var separator = '==--==';
exports.generateArgs = function(afterDate, beforeDate, filePath) {
  // format:"%B%n"
  // format:%s#%b
  var logFormat = '%s=%b' + separator;

  var gitArgs = ['--pretty=format:' + logFormat, '--date-order', '--no-merges', '> ' + filePath];

  //  var afterDate = new Date(Date.now() - (1000 * 60 * 60 * 24));
  //  var beforeDate = new Date();

  gitArgs.push('--after="' + dateFormat(afterDate, "isoDateTime") + '"');

  gitArgs.push('--before="' + dateFormat(beforeDate, "isoDateTime") + '"');

  return gitArgs;
};

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

  // Remove enters and trim the string
  mainStr = mainStr.replace(/\n/g, ' ').trim();

  if (mainStr) {
    return mainStr + '\t' + (timeStr || 0);
  } else {
    return null;
  }
};

var handleRes = function(logFilePath, done, err, result) {
  if (err) {
    return done(err);
  }


  var listOfBodyOfCommit = result.toString().split(separator);
  var listOfTabBody = listOfBodyOfCommit.map(handleEachCommit);
  // todo remove empty records

  fs.writeFile(logFilePath, listOfTabBody.join('\n'), done);
};

/**
 * Create log
 * /
exports.createLog = function(tmpFilePath, logFilePath, done) {
  fs.readFile(tmpFilePath, handleRes.bind(null, logFilePath, done));
};

module.exports = exports;