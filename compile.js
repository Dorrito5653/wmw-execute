console.log("Running compilation script, please wait a few seconds for all of the js files to load");
const spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path');

// Directories to watch
const directoriesToWatch = ['./game/', './server/'];

// Find all directories containing .ts files
const subDirectories = [];
for (let i = 0; i < directoriesToWatch.length; i++) {
  const directoryToWatch = directoriesToWatch[i];
  const subDirectoriesWithTSFiles = getDirectoriesWithTSFiles(directoryToWatch);
  subDirectories.push(...subDirectoriesWithTSFiles);
}

// Watch all directories
for (let i = 0; i < subDirectories.length; i++) {
  const directoryToWatch = subDirectories[i];
  watchDir(directoryToWatch);
  console.log(`Watching directory '${directoryToWatch}'`);
}

function watchDir (dir) {
  const proc = spawn('npx', ['tsc', '-w', '--preserveWatchOutput'], {cwd: dir, stdio: 'pipe', shell: true});
  proc.stdout.on('data', function(data) {
    console.log(`${dir}${data}`);
  });
  proc.stderr.on('data', function(data) {
    console.error(`${dir}${data}`);
  });
  proc.on('close', function(code, signal) {
    console.log(`${dir} compiler has closed`);
  });
  proc.on('error', (err) => {
    console.error(err.message)
  })
}

function getDirectoriesWithTSFiles(dir) {
  const subDirectories = [];
  const files = fs.readdirSync(dir);
  const tsFiles = files.filter(file => file.endsWith('.ts'));
  if (tsFiles.length > 0) {
    subDirectories.push(dir);
  }
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dir, files[i]);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      const nestedDirectories = getDirectoriesWithTSFiles(filePath);
      subDirectories.push(...nestedDirectories);
    }
  }
  return subDirectories;
}

