const CONFIG = require('./config')
const fs = require('fs')
const { execFile } = require('child_process')
const DistributionTool = require('stream-deck-distribution-tool')

fs.unlinkSync('./build/' + CONFIG.appName + '.streamDeckPlugin')
execFile(
  DistributionTool,
  ['-b', '-i', './build/' + CONFIG.appName + '.sdPlugin', '-o', './build/'],
  (err, stdout) => {
    console.log(stdout)
    if (err) throw err
  }
)
