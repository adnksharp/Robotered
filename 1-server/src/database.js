const mongoose = require('mongoose'),
	dotenv = require('dotenv'),
	{MONGO_URI} = require('./config.js'),
	{print} = require('./models/print.js')

dotenv.config()

async function connect() {
	try {
		const db = await mongoose.connect(MONGO_URI)
		print('mongo', 'connected to \x1b[33m' + db.connection.name + '\x1b[0m')
	} catch (e) {
		print('error', 'connecting to mongo: ' + e)
	}
}

module.exports = { connect }
