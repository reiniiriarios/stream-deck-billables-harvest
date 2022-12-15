const CONFIG = require('config')
const { execFile } = require('child_process')
const DistributionTool = require('stream-deck-distribution-tool')

execFile(
  DistributionTool,
  ['-b', '-i', CONFIG.appName + '.sdPlugin', '-o', '.'],
  (err, stdout) => {
    if (err) throw err
    console.log(stdout)
  }
)
