const {connect} = require('./database.js'),
	{SERVER_PORT, SERVER_HOST, ONION} = require('./config.js'),
	{print} = require('./models/print.js'),
	server = require('./server.js')

connect()

server.listen(SERVER_PORT, SERVER_HOST, () => {
	print('onion', 'null')
	print('onion', 'tor address: ' + ONION)
	print('server', 'http://' + SERVER_HOST + ':' + SERVER_PORT)
})
