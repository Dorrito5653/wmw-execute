console.log("Running compilation script");
import * as chokidar from 'chokidar';
import { exec } from 'child_process';

// Directories to watch
const directoriesToWatch = ['./game', './server', './game/renderer'];

// Store a dictionary to keep track of the last compilation timestamp for each file
const lastCompilationTimestamps = {};

for (let i = 0; i < directoriesToWatch.length; i++) {
  const directoryToWatch = directoriesToWatch[i];
  watchDir(directoryToWatch);
  console.log(`Watching directory '${directoryToWatch}'`);
}

function watchDir(dir) {
  chokidar
    .watch(`${dir}/**/*.ts`, { ignored: /node_modules/ })
    .on('change', (path) => {
      console.log(`File changed: ${path}`);
      // Get the current timestamp
      const currentTimestamp = Date.now();
      // Get the last compilation timestamp for the file, if it exists
      const lastTimestamp = lastCompilationTimestamps[path] || 0;
      // Calculate the time elapsed since the last compilation
      const timeElapsed = currentTimestamp - lastTimestamp;

      // Use a debounce delay of 1 second (1000 milliseconds)
      const debounceDelay = 1000;

      // If the time elapsed since the last compilation is greater than the debounce delay
      if (timeElapsed > debounceDelay) {
        // Update the last compilation timestamp for the file
        lastCompilationTimestamps[path] = currentTimestamp;

        // Execute tsc -w command with the changed file as an argument
        exec(`tsc ./game/renderer/scripts/actors/types.d.ts`, (error, stdout, stderr) => {
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
        exec(`tsc ${path}`, (error, stdout, stderr) => {
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
      }
    });
}