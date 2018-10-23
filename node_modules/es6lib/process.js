/*eslint strict: ["error", "global"], no-implicit-globals: "off", no-unused-expressions: "off"*/ 'use strict'; /* global exports, */ // license: MPL-2.0

const child_process = require('child_process');

/**
 * returns a Promise of the completion of a new child_process
 * @augments {...}           Either those of a call to child_process.exec or child_process.execFile (if 2nd arg is Array)
 * @return {Promise(string)} Promise that will be fulfilled with the child_processes accumulated stdout
 *                           or be rejected with the error which has stdout and stderr attached
 */
exports.execute = execute; function execute(...args) {
	return new Promise((resolve, reject) => {
		args.push((error, stdout, stderr) => error ? reject(Object.assign(error, { stderr, stdout, })) : resolve(stdout));
		child_process[
			(args[1] instanceof Array) ? 'execFile' : 'exec'
		].apply(child_process, args);
	});
}
