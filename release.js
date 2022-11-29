const { execFile } = require('child_process')
const DistributionTool = require('stream-deck-distribution-tool')

execFile(
  DistributionTool,
  ['-b', '-i', 'net.reiniiriarios.harvest-billables.sdPlugin', '-o', '.'],
  (err, stdout) => {
    if (err) throw err
    console.log(stdout)
  }
)
