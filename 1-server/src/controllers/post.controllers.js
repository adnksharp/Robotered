const Post = require('../models/Post.js'),
	{print} = require('../models/print.js'),
	{exec} = require('child_process'),
	{SerialPort} = require('serialport')

var robot = undefined,
	readlines = undefined

function delay(n) {
  return new Promise(function(resolve) {
    setTimeout(resolve, n)
  })
}

async function newRobot(port, baudrate, res) {
	let ret = 200
	robot = new SerialPort({
		path: port,
		baudRate: parseInt(baudrate),
	}, (err) => {
		if (err) {
			print('error', err.toString())
			ret = 500
		}
		else
			print('serial', port + ' to ' + baudrate + ' opened')
	})

	robot.on('close', () => {
		print('serial', 'port closed')
		robot = undefined
	})

	robot.on('error', (err) => {
		print('error', err.toString())
		print('error', 'error with ' + port)
		if (robot !== undefined)
			robot.close()
		else {
			//call newRobot next to delay 2s
			delay(1000).then(() => {
				newRobot(port, baudrate, res)
			})
		}
	})
	return ret
}

module.exports = {
	Available: async function(req, res) {
		//exec shell script
		exec('sh /home/akey/Documentos/ROMEX-PJT/1-server/list.sh', (err, stdout, stderr) => {
			if (err) {
				print('error', err.toString())
				res.json({ zero: 0 })
				return
			}
			if (stderr) {
				print('server', stderr.toString())
				res.json({ zero: 0 })
				return
			}
			print('server', 'serial config available')
			res.json({ stdout })
		})
	},
	Config: async function(req, res) {
		const { port, baudrate } = req.body
		if (robot !== undefined) {
			print('serial', 'port ' + robot.path + ' already opened')
			res.sendStatus(200)
			return
		}
		res.sendStatus(await newRobot(port, baudrate, res))
	},
	Close: function(req, res) {
		if (robot === undefined) {
			print('serial', 'port closed')
			res.sendStatus(200)
			return
		}
		robot.close((err) => {
			if (err) {
				print('error', err.toString())
				res.sendStatus(500)
				return
			}
			print('serial', 'port closed')
			res.sendStatus(200)
		})
		robot = undefined
	},
	New: async function(req, res) {
		await Post.deleteMany()
		const newControl = new Post({
			myId: 0,
			base: 0,
			shoulder: 0,
			elbow: 0,
			wristx: 0,
			wristy: 0,
			gripper: 70
		})
		await newControl.save()
		print('mongo', 'database has been reset')
		res.sendStatus(200)
	},
	Ping: async function(req, res) {
		if (robot !== undefined) {
			robot.write('180,90,90,90,90,120,', (err) => {
				if (err) {
					print('error', err.toString())
					res.sendStatus(500)
					return
				}
				print('serial', 'all')
			})
			delay(4000).then(() => {
				robot.write('90,0,0,0,0,70,', (err) => {
					if (err) {
						print('error', err.toString())
						res.sendStatus(500)
						return
					}
					print('serial', 'zero')
				})
			})
			res.sendStatus(200)
		}
		else
		{
			print('serial', 'port closed')
			res.sendStatus(200)
		}
	},
	Update: async function(req, res) {
		const { A, B, C, D, E, F } = req.body
		const control = await Post.findOneAndUpdate(
			{ myId: 0 },
			{ base: A, shoulder: B, elbow: C, wristx: D, wristy: E, gripper: F },
			{ new: true }
		)
		if (robot !== undefined) {
			robot.write(A + ',' + B + ',' + C + ',' + D + ',' + E + ',' + F + ',\n', (err) => {
				if (err) {
					print('error', err.toString())	
					res.sendStatus(200)
					return
				}
				res.sendStatus(200)
			})
		}
		else
			res.sendStatus(200)
	},
	Upgrade: async function(req, res) {
		const control = await Post.findOne({ myId: 0 }),
			{ base, shoulder, elbow, wristx, wristy, gripper } = control
		res.json({ 
			A: base, 
			B: shoulder, 
			C: elbow, 
			D: wristx, 
			E: wristy, 
			F: gripper 
		})
	}
}
