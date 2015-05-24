// Written by Romain Cerovic
// Based on the code of Realtime Multiplayer in HTML 5 
// App.js sets up all that is needed to run the server and start the gameServer. 

var gameport 	= process.env.PORT || 9001,
	fileDebug 	= false,

	io 			= require('socket.io'),
	express 	= require('express'),
	UUID 		= require('node-uuid'),
	http		= require('http'),
	app			= express(),
	server		= http.createServer(app);


server.listen(gameport)

console.log("Server listening to port " + gameport);

//give the express server the location of the html file by default
app.get('/', function(req, res){
	console.log("Attempt to load %s", __dirname + "/index.html");
	res.sendfile("/index.html", {root:__dirname});
});

//give it the location of any other file from the root of the directory if they are needed
app.get("/*", function(req, res, next){
	var fileToLoad = req.params[0];

	if(fileDebug) console.log("File request " + fileToLoad);

	res.sendfile(__dirname + "/" + fileToLoad);
})

//create an instance of socket.io
var socket = io.listen(server);

//Socket configuration
socket.configure(function(){
	socket.set("log level",0);

	socket.set("authorisation", function(handshakeData, callback){
		callback(null, true);
	});
});

// call the gameSever file to run
// the game server handles connection, game logins, game creation, joining games
// and deleting and ending games 
game_server = require("./gameServer.js");

socket.sockets.on("connection", function(client) {
	client.userid = UUID();

	client.emit("onconnected", {id: client.userid} );

	game_server.findGame(client);

	console.log("New player " + client.userid + "has joined.");

	client.on("message", function(m) {
		game_server.onMessage(client, m);
	});

	client.on("disconnect", function(){
		console.log("Player " + client.userid + "has disconnected.");

		//end the game if the client is disconnected 
		if(client.game && client.game.id) {
			game_server.endGame(client.game.id, client.userid);
		}
	});
});