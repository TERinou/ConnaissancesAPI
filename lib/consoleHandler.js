/**
 * This file provides function to handle console output. Mostly useful to use with
 * jest while running test by removing or restoring them at any time.
 * 
 */

module.exports.defaultValues = {
	log: console.log,
	info: console.info,
	warn: console.warn,
	error: console.error
}

module.exports.removeConsoleOutput = function () {
	console.log = jest.fn();
	console.info = jest.fn();
	console.warn = jest.fn();
	console.error = jest.fn();
}

module.exports.resetConsoleOutput = function () {
	console.log = this.defaultValues.log;
	console.info = this.defaultValues.info;
	console.warn = this.defaultValues.warn;
	console.error = this.defaultValues.error;
}