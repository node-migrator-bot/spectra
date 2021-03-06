var runforcover = require('runforcover');

function setupCoverage(path){
  var coverage = runforcover.cover(path);
  return function (next){
    coverage(function (coverageData){
      coverage.release();
      Object.keys(coverageData).forEach(function(filename) {
        var cover = coverageData[filename],
            stats = cover.stats(),
            max = (stats.lines.slice(-1)[0] || {lineno:0}).lineno.toString().length,
            pad = function(n) {
              n = n.toString();
              while(n.length < max)
                n = ' '+n;
              return n;
            };

        if(stats.lines.length) {
          process.stdout.write('\n'+filename+'\n----------------------------------------------------\n');
          stats.lines.forEach(function(line) {
            process.stdout.write(pad(line.lineno)+' : '+line.source()+'\n')
          });
          process.stdout.flush();
        }

      });
      if (next) next();
    }
  }
}

exports.setupCoverage = setupCoverage;
