class WordNotFoundException extends Error {
	constructor(message, code, httpCode = 404) {
		super();
		this.httpCode = httpCode;
		this.code = code;
		this.message = message;
	}
}

module.exports = WordNotFoundException;