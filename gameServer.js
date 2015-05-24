// Written by Romain Cerovic 

var gameServer 	= module.explorts = { games : {}, game_count:0},
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

 };

gameServer.onInput = function(client, msgs){

};

gameServer.createGame = function(player){

};

gameServer.endGame = function(gameID, userID){

};

gameServer.startGame = function(game){

};

gameServer.findGame = function(player){

};