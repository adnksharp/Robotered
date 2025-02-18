const { Router } = require('express'),
	router = Router(),
	{
		Available,
		Config,
		Close,
		New,
		Ping,
		Update, 
		Upgrade, 
	} = require('../controllers/post.controllers.js')

router.get('/status', (req, res) => res.sendStatus(200)) // check if server is running

router.post('/control', Update) // get updates from controller
router.get('/robot', Upgrade) // send last update to app
router.get('/available', Available) // get list of available robots
router.post('/config', Config) // set serial port configuration
router.get('/close', Close) // close serial port
router.get('/ping', Ping)
router.get('/clear', New) // reset all updates

module.exports = router
