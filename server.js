const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const ansi = require('./ansi');
const app = express();
const config = require('./config.json');
const readline = require('readline');

let selectedRootFolderIndex = 0;
let selectedPortIndex = 0;

function SelectPort()
{
	console.log("")
	console.log("Select port:")
	for (let ix = 0; ix < config.ports.length; ix++)
	{
		const port = config.ports[ix];
		console.log(`[${Bright}${FgYellow}${ix+1}${Reset}] ${Bright}${port}${Reset}`);
	}

	console.log(`[${Bright}${FgYellow}0${Reset}] ${Bright}QUIT${Reset}`);
	console.log("")

	readline.emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);

	process.stdin.on('keypress', (key, data) => {
		if (data.ctrl && data.name === 't') {
			console.log("")
			process.exit();
		} 
		else 
		{
			if (key >= "0" && key <= "9")
			{
				const ix = parseInt(key);
				if (ix == 0)
				{
					process.exit();
				}
				else if (ix <= config.ports.length)
				{
					selectedPortIndex = ix - 1;
					startServer();
				}
			}
			// console.log('key', key);
			// console.log('data', data);
		}
	});
}

function SelectFolder()
{
	console.log("")
	console.log("Select root folder:")
	for (let ix = 0; ix < config.rootFolders.length; ix++)
	{
		const rootFolder = config.rootFolders[ix];
		console.log(`[${Bright}${FgYellow}${ix+1}${Reset}] ${Bright}${rootFolder}${Reset}`);
	}

	console.log(`[${Bright}${FgYellow}0${Reset}] ${Bright}QUIT${Reset}`);
	console.log("")

	readline.emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);

	process.stdin.once('keypress', (key, data) => {
		if (data.ctrl && data.name === 't') {
			console.log("")
			process.exit();
		} 
		else 
		{
			if (key >= "0" && key <= "9")
			{
				const ix = parseInt(key);
				if (ix == 0)
				{
					process.exit();
				}
				else if (ix <= config.rootFolders.length)
				{
					selectedRootFolderIndex = ix - 1;
					SelectPort();
				}
			}
			// console.log('key', key);
			// console.log('data', data);
		}
	});
}

function startServer()
{
	// console.log(__dirname);

	var compression = require('compression');
	app.use(compression());

	var static = require('serve-static');

	// app.use(static(__dirname + "/httpdocs"));

	// app.use(static("C:\\TFSProjects\\GitHub\\Stone"));

	console.log("");
	console.log(`Press ${FgCyan}Ctrl-T${Reset} to exit`);
	console.log("");
	console.log(`Serving ${Bright}folder ${FgGreen}${config.rootFolders[selectedRootFolderIndex]}${Reset}`);
	app.use(static(config.rootFolders[selectedRootFolderIndex]));

	// app.use(static(__dirname));

	// console.log(__dirname);

	app.use(function (req, res, next) {
		res.status(404).send("Sorry can't find that!");
	});

	// app.put('/user', function (req, res) {
	//   res.send('Got a PUT request at /user');
	// });

	// console.log("App Path: " + app.path());

	var server = http.createServer(app);

	// WebSocket Support
	// var wss = new WebSocket.Server({ server });

	// wss.on('connection', function connection(ws) {
	//   ws.on('message', function incoming(message) {
	//     console.log('received: %s', message);
	//   });

	//   ws.send('something');
	// });

	port = config.ports[selectedPortIndex];
	server.listen(port, () => console.log(`Listening on ${Bright}port ${FgMagenta}${port}${FgWhite}!` + Reset));
}

console.log("")
console.log(FgYellow + Bright + "Node JS WebServer" + Reset)
console.log(FgYellow + Bright + "=================" + Reset)
console.log("")

SelectFolder();
