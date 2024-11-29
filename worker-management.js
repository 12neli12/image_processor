const { Worker } = require('worker_threads')
const path = require('path')
const fs = require('fs')

const MAX_THREADS = 5

const processImg = (imgUrls, progress) => {
  const outDir = path.resolve(__dirname, 'output')

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)
  
  const results = []
  let activeThreads = 0
  const queue = [...imgUrls]

  return new Promise((resolve, reject) => {
    const startNextTask = () => {
      // Checks if all tasks completed
      if(queue.length === 0 && activeThreads === 0) {
        resolve(results);
        return;
      }

      // Starts a new task if threads available
      if (activeThreads < MAX_THREADS && queue.length > 0) {
        const url = queue.shift();
        activeThreads++;

        const worker = new Worker(path.resolve(__dirname, './worker.js'));
        worker.postMessage({ url, outDir });

        worker.on('error', (err) => {
          results.push({ success: false, error: err.message });

          console.error(`Error processing image: ${err.message}`);

          if(progress) {
            progress.errors++;
          }

          activeThreads--;
          startNextTask();
        });

        worker.on('message', (result) => {
          results.push(result);

          if(progress) {
            progress.completed++;
            console.log(`Completed: ${progress.completed}`);
          }

          activeThreads--;
          worker.terminate();
          startNextTask();
        });

      }
    };

    for(let i = 0; i < MAX_THREADS; i++) {
      startNextTask();
    }
  });
};

module.exports = { processImg }