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
			width: 	1280
			height: 720
		};

		if(this.server)
		{
			this.player = {
				self 	: new game_player(this),
				other 	: new game_player(this)
			};
		}
	}