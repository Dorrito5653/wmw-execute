console.log("compiling")
import * as chokidar from 'chokidar' 
import { exec } from 'child_process';

// Directory to watch
const directoryToWatch = './game';
const directoryToWatch2 = './server'

// Initialize chokidar to watch for .ts files
chokidar.watch(`${directoryToWatch}/**/*.ts`, { ignored: /node_modules/ }).on('change', (path) => {
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

chokidar.watch(`${directoryToWatch2}/**/*.ts`, { ignored: /node_modules/ }).on('change', (path) => {
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