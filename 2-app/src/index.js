const { app, BrowserWindow } = require('electron'),
	path = require('node:path'),
	url = require('url')

if (require('electron-squirrel-startup')) {
	app.quit()
}

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 1100,
		height: 600,
		minWidth: 950,
		minHeight: 600,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			defaultEncoding: 'UTF-8',
			devTools: false,
			preload: path.join(__dirname, 'preload.js'),
		},
	})

	mainWindow.setMenu(null)

	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'index.html'),
			protocol: 'file:',
			slashes: true
		})
	)
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
})
