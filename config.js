module.exports = {
	domain: process.env.TERINOU_DOMAIN || '',
	port: process.env.TERINOU_PORT || '8888',
	db: process.env.TERINOU_DB || 'TERinou',
	db_test: process.env.TERINOU_DB_TEST || 'TERinouTest'
}