const Post = require('../models/Post.js'),
	{print} = require('../models/print.js'),
	{exec} = require('child_process'),
	{SerialPort} = require('serialport')

var robot = undefined,
	readlines = undefined

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
				return
			}
			print('server', 'serial config available')
			res.json({ stdout })
		})
	},
	Config: function(req, res) {
		const { port, baudrate } = req.body
		robot = new SerialPort({
			path: port,
			baudRate: parseInt(baudrate),
		}, (err) => {
			if (err) {
				print('error', err.toString())
				res.sendStatus(500)
				return
			}
			print('serial', port + ' to ' + baudrate + ' opened')
			res.sendStatus(200)
		})
	},
	Close: function(req, res) {
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
	Moves: async function(req, res) {
		for (let i = 0; i < 59; i++) {
			const control = await Post.findOne({ myId: i + 1 }),
				{ base, shoulder, elbow, wristx, wristy, gripper } = control
			await Post.findOneAndUpdate(
				{ myId: i },
				{ base, shoulder, elbow, wristx, wristy, gripper },
				{ new: true }
			)
		}
		print('mongo', 'database has been changed')
		res.sendStatus(200)
	},
	New: async function(req, res) {
		await Post.deleteMany()
		for (let i = 0; i < 60; i++) {
			const newControl = new Post({
				myId: i,
				base: 0,
				shoulder: 0,
				elbow: 0,
				wristx: 0,
				wristy: 0,
				gripper: 70
			})
			await newControl.save()
		}
		print('mongo', 'database has been reset')
		res.sendStatus(200)
	},
	Update: async function(req, res) {
		const { A, B, C, D, E, F } = req.body
		
		const control = await Post.findOneAndUpdate(
			{ myId: 59 },
			{ base: A, shoulder: B, elbow: C, wristx: D, wristy: E, gripper: F },
			{ new: true }
		)

		//print('mongo', 'control updated')
		if (robot !== undefined) {
			robot.write(A + ',' + B + ',' + C + ',' + D + ',' + E + ',' + F + '\n', (err) => {
				if (err) {
					print('error', err.toString())
					res.sendStatus(500)
					return
				}
				print('serial', A + ',' + B + ',' + C + ',' + D + ',' + E + ',' + F)
				res.sendStatus(200)
			})
		}
		else
			res.sendStatus(200)
	},
	Upgrade: async function(req, res) {
		const control = await Post.findOne({ myId: 59 }),
			{ base, shoulder, elbow, wristx, wristy, gripper } = control
		res.json({ 
			A: base, 
			B: shoulder, 
			C: elbow, 
			D: wristx, 
			E: wristy, 
			F: gripper 
		})
	},
	Views: async function(req, res) {
		const control = await Post.find()
		res.json(control)
	}
}
