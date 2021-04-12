import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// In ES6 import for import local files (not node_modules) - must mention the suffix file name, like .js
import app from './app.js';

// example how to import json file (await will sync the import!, in general import is async/promise)
const { default: jsonObj } = await import('./test.json');
console.log('import json file\n', JSON.stringify(jsonObj, null, 4));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = path.basename(fileURLToPath(import.meta.url));
console.log('__dirname = ', __dirname);
console.log('__filename = ', __filename);


const server = http.createServer(app);

const PORT = 4000;
server.listen(PORT, async () => {
	console.log(`Listening to http://localhost:${PORT}/`);
});

server.on('uncaughtException', (req, res, next, err) => {
	console.log(`UncaughtException : ${err.stack || err}`);
	return res.status(500).send(err.message);
});

server.on('error', (err) => {
	console.error(`server.on Error : ${err.stack || err}'`);
	process.exit(1);
});

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (reason, p) => {
	console.error(`=== UNHANDLED REJECTION === \nUnhandled Rejection at: Promise '${JSON.stringify(p, null, 4)}' \nreason: '${reason}'`);
	throw reason;
});

// Stop process killing on exceptions
process.on('uncaughtException', (error) => {
	console.error(`uncaughtException error: ${error}`);
});
