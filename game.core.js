// Written by Matthew Wren
// Based on the code of Realtime Multiplayer in HTML 5 
// game.core.js game logic for the game

var frame_time = 60/1000;
if('undefined' != typeof(global))
{
	frame_time = 45;
}

( function () 
{
	var lastTime = 0;
	var vandors = ['ms', 'moz', 'webkit', 'o'];

	for(var i = 0; i < vendors.length && !window.requestAnimationFrame; i++)
	{
		window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
    }
	 if ( !window.requestAnimationFrame ) 
	 {
        window.requestAnimationFrame = function ( callback, element ) 
        {
            var currTime 	= Date.now(), timeToCall = Math.max( 0, frame_time - ( currTime - lastTime ) );
            var id 			= window.setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );
            lastTime 		= currTime + timeToCall;
            return id;
        };
    }
    if ( !window.cancelAnimationFrame ) 
    {
        window.cancelAnimationFrame = function ( id ) { clearTimeout( id ); };
    }

}() );

	var game_core = function(game_instance){

		this.instance 	= game_instance;

		this.server 	= this.instance !== undefined;

		this.world=
		{
			width	: 1280
			height	: 720
		};

		if(this.server)
		{
			this.player = {
				self 	: new game_player(this),
				other 	: new game_player(this)
			};
			this.players.self.pos = 
			{
				x	: 20,
				y	: 20
			};
		}
		else
		{
			this.players =
			{
				self	: new game_player(this),
				other	: new game_player(this)
			};

			this.ghost = {
				server_pos_self		: new game_player(this),
				server_pos_other	: new game_player(this),
				pos_other 			: new game_player(this)
			};
			this.ghost.pos_other.state = 'dest_pos'

			this.ghost.pos_other.info_color = 'rgba(0,255,0,0.3)';

			this.ghost.server_pos_self.info_color 	= 'rgba(0,255,0,0.3)';
			this.ghost.server_pos_other.info_color	= 'rgba(0,255,0,0.3)';

			this.ghost.server_pos_self.state 	= 'server_pos';
			this.ghost.server_pos_other.state 	= 'server_pos';

			this.ghost.server_pos_self.pos = 
			{
				x : 20,
				y : 20
			};
			this.ghost.pos_other.pos =
			{
				x : 700,
				y : 300
			};
			this.ghost.server_pos_other.pos =
			{
				x : 700,
				y : 300
			};
		}
	}