
game.PlayerEntity = me.Entity.extend({
	init: function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "player",
			width: 64,
			height: 64,
			spritewidth: "64",
			spriteheight: "64",
			getShape: function(){
				return(new me.Rect(0, 0, 64, 64)).toPolygon();
			}
		}]);

		this.body.setVelocity(5, 20);//changed to make player walk on solid floor
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		this.renderable.addAnimation("idle", [78]);//makes the player orc to face the screen 
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);

		this.renderable.setCurrentAnimation("idle");//helps cause the player to face the screen
},

	update: function(delta){
		if (me.input.isKeyPressed("right")) {
			//sets the position of my x by the velocity defined above in 
			//setVelocity() and multiplying it by me.timer.tick.
			//me.timer.tick makes the movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			this.flipX(true);
			this.facing = "right";
		}else if(me.input.isKeyPressed("left")){
				this.facing = "left";
				this.body.vel.x -= this.body.accel.x * me.timer.tick;
				this.flipX(false);
		
		}else{
			this.body.vel.x = 0;
		}
		if (me.input.isKeyPressed("jump") && !this.jumping &&  !this.falling) {
		this.jumping = true;
		this.body.vel.y -= this.body.accel.y * me.timer.tick;	

		}



	if (me.input.isKeyPressed("attack")) {
			if (!this.renderable.isCurrentAnimation("attack")) {
				console.log()
				//sets the current animation to attack and once that is over
				//gone back to the idle animation
				this.renderable.setCurrentAnimation("attack", "idle");
				//Makes it so that the next time we start this sequence
				//form the first animation, not whereverwe left off
				//switched to another animation		
				this.renderable.setAnimationFrame();	
			}
		}
	else if (this.body.vel.x !== 0) {
			if(!this.renderable.isCurrentAnimation("walk")){
				this.renderable.setCurrentAnimation("walk");		
		}
	}else{
		this.renderable.setCurrentAnimation("idle");//makes the character stay still 
		}

		if (me.input.isKeyPressed("attack")) {
			if (!this.renderable.isCurrentAnimation("attack")) {
				console.log()
				//sets the current animation to attack and once that is over
				//gone back to the idle animation
				this.renderable.setCurrentAnimation("attack", "idle");
				//Makes it so that the next time we start this sequence
				//form the first animation, not whereverwe left off
				//switched to another animation		
				this.renderable.setAnimationFrame();	
			}
		}

		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);//updating our animation
		return true;
	}
});

game.PlayerBaseEntity = me.Entity.extend({
	init: function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height: 100,
			spritewidth: "100",
			spriteheight: "100",
			getShape: function(){
				return (new me.Rect(0, 0, 100, 70)).toPolygon();
			}
		}]);
		this.broken = false;
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);
		console.log("init");
		this.type = "PlayerBaseEntity";

		this.renderable.addAnimation("idle", [0]);//makes the player orc to face the screen 
		this.renderable.addAnimation("broken", [1]);	
		this.renderable.setCurrentAnimation("idle")
},

update:function(delta) {
	if(this.health<=0) {
		this.broken = true;
		this.renderable.setCurrentAnimation("broken");
	}
	this.body.update(delta);

	this._super(me.Entity, "update", [delta]);
	return true;
},

onCollision: function(){

}

});

game.EnemyBaseEntity = me.Entity.extend({
	init: function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height: 100,
			spritewidth: "100",
			spriteheight: "100",
			getShape: function(){
				return (new me.Rect(0, 0, 100, 70)).toPolygon();
			}
		}]);
		this.broken = false;
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);
		console.log("init");
		this.type = "EnemyBaseEntity";

		this.renderable.addAnimation("idle", [0]);//makes the player orc to face the screen 
		this.renderable.addAnimation("broken", [1]);	
		this.renderable.setCurrentAnimation("idle")
},
update:function(delta) {
	if(this.health<=0) {
		this.broken = true;
		this.renderable.setCurrentAnimation("broken");
	}
	this.body.update(delta);

	this._super(me.Entity, "update", [delta]);
	return true;
},

onCollision: function(){
	
}
});