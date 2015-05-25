// Written by Matthew Wren
// Based on the code of Realtime Multiplayer in HTML 5 
// gamePlayer.js 

var frame_time = 60/1000;
if('undefined' != typeof(global))
{
	frame_time = 45;
}

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

	game_Player.prototype.draw = function()
	{
		game.ctx.fillStyle = this.color;

		game.ctx.fillRect(this.pos.x - this.size.hx, this.pos.y - this.size.gy, this.size.x, this.size.y);

		game.ctx.fillStyle = this.info_color;
		game.ctx.fillText(this.state, this.pos.x + 10, this.pos.y + 4);
	};