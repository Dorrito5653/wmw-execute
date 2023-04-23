console.log("Running compilation script");
var spawn = require('child_process').spawn


// Directories to watch
const directoriesToWatch = ['./game/', './server/', './game/renderer/']

for (let i = 0; i < directoriesToWatch.length; i++) {
  const directoryToWatch = directoriesToWatch[i];
  watchDir(directoryToWatch);
  console.log(`Watching directory '${directoryToWatch}'`);
}

function watchDir (dir) {
  chokidar.watch(`${dir}/**/*.ts`, { ignored: /node_modules/ }).on('change', (path) => {
    console.log(`File changed: ${path}`);
    // Execute tsc -w command with the changed file as an argument
    exec(`tsc -w ${path}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      if (stdout) {
        console.log(`Stdout: ${stdout}`);
      }
    });
  });
}