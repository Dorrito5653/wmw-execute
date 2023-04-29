console.log("Running compilation script");
var spawn = require('child_process').spawn


// Directories to watch
const directoriesToWatch = ['./game/', './server/', './game/renderer/', './game/renderer/scripts', './game/renderer/scripts/actors']

for (let i = 0; i < directoriesToWatch.length; i++) {
  const directoryToWatch = directoriesToWatch[i];
  watchDir(directoryToWatch);
  console.log(`Watching directory '${directoryToWatch}'`);
}

function watchDir (dir) {
  const proc = spawn('npm', ['run', 'tsc-watch'], {cwd: dir, stdio: 'pipe', shell: true});
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