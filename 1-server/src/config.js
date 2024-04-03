const dotenv = require('dotenv')
dotenv.config()

module.exports = {
	MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/tmp',
	SERVER_PORT: process.env.SERVER_PORT || 3000,
	SERVER_HOST: process.env.SERVER_HOST || 'localhost',
	SECRET: process.env.SECRET || 'secret',
	ONION: process.env.ONION || 'http://null.onion',
	API_KEY: process.env.API_KEY || 'api_key',
	API_SECRET: process.env.API_SECRET || 'api_secret',
	API_URL: process.env.API_URL || 'http://localhost:3000',
	TOR: process.env.TOR || 'http://localhost:3000',
	VPN: process.env.VPN || 'http://localhost:3000',
	PROXY: process.env.PROXY || 'http://localhost:3000',
	PROXY_PORT: process.env.PROXY_PORT || 3000,
	DNS: process.env.DNS || 'http://localhost:3000',
	DNS_PORT: process.env.DNS_PORT || 3000
}
