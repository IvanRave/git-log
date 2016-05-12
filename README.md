GIT log
===

Creates a log from git commits, using https://git-scm.com/docs/git-log

Output: one-line strings, separated by tabs (suitable for spreadsheets)

- committer date (YYYY-MM-DD)
- subject (some subject)
- body (some body)
- elapsed time (0:15)


Using
---


Add a commit:
```
git commit -m "some subject" -m "some body" -m "time: 0h15"
```


Generate a log:
```
var gulp = require('gulp');
var gitLog = require('git-log');
var exec = require('child_process').exec;

gulp.task('gitlog', function(done) {
  var tmpFilePath = 'doc/log-tmp.log';
  var logFilePath = 'doc/log-ready.log';
  var afterDate = new Date(2016, 0, 1); // 1 January
  var beforeDate = new Date(2016, 1, 1); // 1 February

  // Generate a GIT LOG command with arguments
  var shellCommand = 'git log ' + gitLog.generateArgs(afterDate, beforeDate, tmpFilePath).join(' ');

  // Execute it: write to a temp file
  exec(shellCommand, function(err) {
    if (err) { done(err); return;}

    // Parse a temp file and create a ready log file
    gitLog.createLog(tmpFilePath, logFilePath, done);
  });
});
```