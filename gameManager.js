// Written by Matthew Wren
// Based on the code of Realtime Multiplayer in HTML 5 
// gameManager.js game logic for the game

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

	var game_Manager = function(game_instance){

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

		this.playerspeed = 120

		this._pdt = 0.0001;
		this._pdte = mew Date().getTime();

		this.local_time = 0.016;
		this._dt = new Date().getTime();
		this._dte = new Date().getTime();

		this.create_physics_simulation();

		this.create_timer();

		if(!this.server)
		{
			/*THREEx.KeyboardState.js keep the current state of the keyboard. 
			**It is possible to query it at any time. No need of an event. 
			**This is particularly convenient in loop driven case, like in 3D demos or games.*/
			this.keyboard = new THREEx.KeyboardState();

			//Creates default config settigns
			this.client_create_configuration();

			//Recent server updates
			//"this is the buffer that is the driving factor for our netowrking"
			this.server_updates = [];

			//Connect to socket.io server
			this.client_connect_to_server();

			//Pings server to determine latency
			this.client_create_ping_timer();

			//Sets colour
			this.color = localStorage.getItem('color') || '#000fff';
			localStorage.setItem('color', this.color);
			this.players.self.color = this.color;

			//DEBUG
			if(String(window.location).indexOf('debug') != -1) {
            this.client_create_debug_gui();
            }
		}
		else 
		{
			this.server_time 	= 0;
			this.laststate 		= {};
		}
	};

	//Set game_Manager to global so can be used anywhere
	if( 'undefined' != typeof global ) 
	{
    	module.exports = global.game_Manager = game_Manager;
    }

    //Returns n to 3 places
    Number.prototype.fixed = function(n) 
    {
    	n = n || 3;
    	return parseFloat(this.toFixed(n));
    };

    //Copies 2d vector from one to the other
    game_Manager.prototype.pos = function(a)
    {
    	return
    	{
    		x : a,
    		y : a.y
    	};
    };

    //Add 2d vector to another then returns the resultant vector
    game_Manager.prototype.v_add = function(a,b)
    {
    	return
    	{
    		x : (a.x + b.x).fixed(),
    		y : (a.y + b.y).fixed()
    	};
    };

    //Subtract 2d vector with another and returns the resultant vector
    game_Manager.prototype.v_seb = function(a,b)
    {
    	return
    	{
    		x : (a.x - b.x).fixed(),
    		y : (a.y - b.y).fixed()
    	};
    };

    //Multiply 2d vector with a scalar value and returns the resultant vector
    game_Manager.prototype.v_mul_scalar = function(a,b)
    {
    	return
    	{
    		x : (a.x*b).fixed(),
    		y:(a.y*b).fixed()
    	};
    };

    //Cancels setTimeoout for the server (setTimeout created in polyfill)
    game_Manager.prototype.stop_update = function() 
    {  
    	window.cancelAnimationFrame( this.updateid );  
    };

    //Linear interpolation
    game_Manager.prototype.lerp = function(p, n, t) 
    { var _t = Number(t); 
    	_t = (Math.max(0, Math.min(1, _t))).fixed(); 
    	return (p + _t * (n - p)).fixed(); 
    };

    //Linear interpolation between 2 vectors
    game_Manager.prototype.v_lerp = function(v,tv,t) 
    { 
    	return 
    	{ 
    		x : this.lerp(v.x, tv.x, t), 
    		y : this.lerp(v.y, tv.y, t) 
    	}; 
    };