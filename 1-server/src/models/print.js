const N = '\x1b[0m',
	O = '\x1b[34m',
	S = '\x1b[36m',
	M = '\x1b[32m',
	E = '\x1b[31m',
	P = '\x1b[33m'

module.exports = {
	print: function (type, msg) {
		if (msg.includes('http://')) {
			let index = msg.indexOf('http://')
			let url = msg.slice(index, msg.indexOf(' ', index))
			msg = msg.replace(url, '\x1b[33m' + url + N)
		}
		if (type === 'onion')
			console.log(O + '[onion]' + N + ' ' + msg)
		else if (type === 'server') 
			console.log(S + '[server]' + N + ' ' + msg)
		else if (type === 'serial')
			console.log(P + '[serial]' + N + ' ' + msg)
		else if (type === 'mongo')
			console.log(M + '[mongo]' + N + ' ' + msg)
		else
			console.log(E + '[error]' + N + ' ' + msg)
	}
}
