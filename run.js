'use strict';

var fs   = require('fs')
  , exec = require('exec')
  , gulp = require('gulp')

module.exports = function (jinn, cb) {
  jinn.log('installing env')

  function setup() {
    var indexjs = process.cwd() + '/' + jinn.appname + '/index.js'
    fs.readFile(indexjs, 'utf8', function (err, content) {
      if (err) throw err
      content = content.replace('\'use strict\';', '\'use strict\';\n\nrequire(\'envoodoo\')()')
      fs.writeFile(indexjs, content, cb)
    })
  }

  function install() {
    var cd = 'cd ' + process.cwd() + '/' + jinn.appname
    var cmd = 'npm install --save envoodoo'
    exec(cd + ' && ' + cmd, setup)
  }

  function copy() {
    var source = __dirname + '/templates/**/*'

    gulp.src([source], {dot: true})
      .pipe(gulp.dest(process.cwd() + '/' + jinn.appname))
      .on('end', install)
  }

  copy()
}

module.exports.command = {
  flags: '-E, --env',
  description: 'Add env support via the envoodoo module'
}
