const fs = require('fs');

const newVersion = process.argv.pop();
if (!newVersion || !/^\d\.\d\.\d$/.test(newVersion)) {
  console.error('Invalid new version. Usage: npm run newver 1.2.3');
  process.exit();
}

const packageFile = './package.json';
const packageLockFile = './package-lock.json';
const manifestFile = './src/manifest.json';

const package = require(packageFile);
const packageLock = require(packageLockFile);
const manifest = require(manifestFile);

package.version = newVersion;
packageLock.version = newVersion;
packageLock.packages[''].version = newVersion;
manifest.Version = newVersion;

[
  { file: packageFile, data: package },
  { file: packageLockFile, data: packageLock },
  { file: manifestFile, data: manifest },
].forEach(({ file, data }) => {
  fs.writeFile(file, JSON.stringify(data, null, 2) + "\n", (err) => {
    if (err) return console.error(err);
    console.log('Updated ' + file);
  });
});
