// Written by Romain Cerovic 

var gameServer 	= module.explorts = { games : {}, gameCount:0},
	UUID 		= require("node-uuid"),
	verbose		= true;


global.window = global.document = global;

require("./gameManager.js");

gameServer.log = function() {
	if(verbose) console.log.apply(this, arguments);
};

gameServer.presetPing = 0;
gameServer.messages = [];

gameServer.lTime = 0;
gameServer.dT = new Date().getTime();
gameServer.dTE = new Date().getTime();

//This function runs as long as the game runs at the interval given. 
//It updates the local time constantly.
setInterval(function(){
	gameServer.dT = new Date().getTime() - gameServer.dTE;
	gameServer.dTE = new Date().getTime();
	gameServer.lTime += gameServer.dT/1000.0;
}, 4);

//
gameServer.delayMessage = function(client, message) {
	if(this.presetPing && message.split(".")[0].substr(0,1) == "i"){

		gameServer.messages.push({client:client, message:message});

		setTimeout(function() {
			if(gameServer.messages.length){
				gameServer.onMessage(gameServer.messages[0].client, gameServer.messages[0].message);
				gameServer.messages.splice(0,1);
			}
		}.bind(this), this.presetPing);
	}
	else {
		gameServer.onMessage(client,message);
	}
};

gameServer.onMessage = function(client, message){
	var messageSplit = message.split(".");
	var messageType = messageSplit[0];

	var otherClient =
            (client.game.playerHost.userID == client.userID) ?
                client.game.playerClient : client.game.playerHost;

    switch(messageType) {
    	case "i":
    		this.onInput(client,messageSplit);
    		break;
    	case "p":
    		client.send("s.p" + messageSplit[1]);
    		break;
    	case "c":
    		if(otherClient)
    			otherClient.send("s.c" + messageSplit[1]);
    		break;
    	case "l":
    		this.presetPing = parseFloat(messageSplit[1]);
    		break;
    	default:
    		this.log("No message received.");
    }

 };

gameServer.onInput = function(client, msgs){
	var commands = msgs[1].split("-");

	var iTime = msgs[2].replace("-",".");

	var sequence = msgs[3];

	if(client && client.game && client.game.gameMg){
		client.game.gameMg.handle_server_input(client, commands, iTime, sequence);
	}
};

gameServer.createGame = function(player){
	var aGame = {
		ID = UUID(),
		playerHost:player,
		playerClient:null,
		playerCount:1
	};
	this.games [ aGame.ID ] = aGame;

	this.gameCount++;

	aGame.gameMg = new game_Manager(aGame);

	aGame.gameMg.update(new Date().getTime());

	player.send("s.h" + String(aGame.gameMg.lTime).replace(".","-"));
	player.game = aGame;
	player.hosting = true;

	this.log("Game created with ID of " + player.game.ID + "by player " + player.ID);

	return aGame;
};

gameServer.endGame = function(gameID, userID){
	var eGame = this.games[gameID];

	if(eGame){
		eGame.gameMg.stop_update();

		if(eGame.playerCount > 1) {
			if(userID == eGame.playerHost.userID){
				if(eGame.playerClient){
					eGame.playerClient.send("s.e");
					this.findGame(eGame.playerClient);
				}
			}
			else{
				if(eGame.playerHost){
					eGame.playerHost.send("s.e");

					eGame.playerHost.hosting = false;

					this.findGame(eGame.playerHost);
				}
			}
		}

		delete this.games[gameID];
		this.gameCount--;
	}

	else{
		this.log("Game does not exist.");
	}
};

gameServer.startGame = function(game){
	//Sends the player the ID of the host
	game.playerClient.send("s.j" + game.playerHost.userID);
	//Sets the game of the client to be the current game
	game.playerClient.game = game;

	//send both the client and the host of the game that the game is ready
	game.playerClient.send("s.r" + String(game.gameMg.lTime).replace(".","-"));
	game.playerHost.send("s.r" + String(game.gameMg.lTime).replace(".","-"));

	//boolean used to start updates 
	gameStarted = true;
};

gameServer.findGame = function(player){
	if(this.gameCount){
		var joinGame = false;

		for(var gameId in this.games) {
			if(!this.games.hasOwnProperty(gameId)) continue;

			var gameInst = this.games[gameId];

			if(gameInst.playerCount < 2) {
				joinGame = true;

				gameInst.playerClient = player;
				gameInst.gameMg.players.other.instance = player;
				gameInst.playerCount++;

				this.startGame(gameInst);
			}
		}
		if(!joinGame){
			this.createGame(player);
		}
		else {
			this.createGame(player);
		}
	}
};