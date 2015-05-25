// Written by Matthew Wren
// Based on the code of Realtime Multiplayer in HTML 5 
// gamePlayer.js 

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
		window.requestAnimationFrame 	= window[vendors[i] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame 	= window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
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

	var game_Player = function( game_inmstance, player_instance)
	{

		this.instance 	= player_instance;
		this.game 		= game_inmstance;

		this.pos		= { x : 0, y : 0};
		this.size		= { x : 16, y : 16. hx : 8, hy : 8};
		this.state		= 'not-connected';
		this.color 		= 'rgba(0,255,0,0.3)';
		this.info_color = 'rgba(0,255,0,0.3)';
		this.id 		= '';

		this.old_state	= { pos : {x : 0, y : 0}};
		this.cur_state 	= { pos : {x : 0, y : 0}};
        this.state_time = new Date().getTime();

        this.inputs 	= [];

        this.pos_limits = 
        {
            x_min : this.size.hx,
            x_max : this.game.world.width - this.size.hx,
            y_min : this.size.hy,
            y_max : this.game.world.height - this.size.hy
        };

        if(player_instance)
        {
        	this.pos = {x : 20, y : 20};
        }
        else
        {
        	this.pos = {x : 700, y : 300};
        }
	};