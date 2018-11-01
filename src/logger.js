import winston from 'winston';

var options = {
	file: {
		level: 'info',
		filename: 'logs/fetcher.log',
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: false,
	},
	console: {
		level: 'debug',
		handleExceptions: true,
		json: false,
		colorize: true,
	},
};

export const logger = winston.createLogger({
	transports: [
		new winston.transports.File(options.file),
		new winston.transports.Console(options.console)
	],
	exitOnError: false, // do not exit on handled exceptions
});
