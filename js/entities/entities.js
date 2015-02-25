game.PlayerEntity = me.Entity.extend({
init: function(x, y, settings) {
		this.setSuper();
		this.setPlayerTimers();
		this.type = "PlayerEntity";//the type of player 
		this.setFlags();

		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		this.addAnimation();

		this.renderable.setCurrentAnimation("idle");//helps cause the player to face the screen
},
setSuper: function(){
	init: function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "player",//the img of thev player
			width: 64,//how wide the plyaer is 
			height: 64,//the height of the player 
			spritewidth: "64",//the players width on the sprite
			spriteheight: "64",//the sprites height 
			getShape: function(){
				return(new me.Rect(0, 0, 64, 64)).toPolygon();
			}
		}]);
},
setPlayerTimers: function(){
	this.now = new Date().getTime();
		this.lastHit = this.now;
		this.lastAttack = new Date().getTime();
},
setAttributes: function(){
	this.health = game.data.playerHealth;//how much health the player has 
	this.attack = game.data.playerAttack;
	this.body.setVelocity(game.data.playerMoveSpeed, 20);//changed to make player walk on solid floor
},
setFlags: function(){
	//Keeps track of which direction your chacrter is going 
	this.facing = "right";
	this.dead = false;
},
addAnimation: function(){
	this.renderable.addAnimation("idle", [78]);//makes the player orc to face the screen 
	this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
	this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
},
	update: function(delta) {
		this.now = new Date().getTime();

		if (this.health <= 0) {
			this.dead = true;
		}

		if(me.input.isKeyPressed("right")){
 			//set the position of my x by adding the velocity defined above in
 			//setVelocity() and multiplying it by me.timer.tick.
 			//me.timer.tick makes the movement look smooth

			this.body.vel.x += this.body.accel.x * me.timer.tick;
			this.facing = "right";
			this.now = new Date() .getTime();
			this.lastHit = this.now;
			this.lastAttack = new Date() .getTime();
			this.flipX(true); 
		}else if(me.input.isKeyPressed("left")){
			this.facing = "left";
			this.body.vel.x -= this.body.accel.x * me.timer.tick;	
			this.flipX(false); 
 		}else{
 			this.body.vel.x = 0;
 		}

		if(me.input.isKeyPressed("jump")){
			if(!this.body.jumping && !this.body.falling){
				this.body.jumping = true;
				this.body.vel.y -= this.body.accel.y * me.timer.tick;
			}
		}

	if (me.input.isKeyPressed("attack")) {//the key the attack
			if (!this.renderable.isCurrentAnimation("attack")) {
				//sets the current animation to attack and once that is over
				//gone back to the idle animation
				this.renderable.setCurrentAnimation("attack", "idle");
				//Makes it so that the next time we start this sequence
				//form the first animation, not whereverwe left off
				//switched to another animation		
				this.renderable.setAnimationFrame();	
			}
		}
	else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {//makes player attack
		if(!this.renderable.isCurrentAnimation("walk")){//causes the player walk
				this.renderable.setCurrentAnimation("walk");		
		}
	}else if(!this.renderable.isCurrentAnimation("attack")) {//helps show player attack
		this.renderable.setCurrentAnimation("idle");//makes the character stay still 
		}

		me.collision.check(this, true, this.collideHandler.bind(this), true);
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);//updating our animation
		return true;
	},

	loseHealth: function(damage){
		this.health = this.health - damage;//add the player taking damage
		console.log("Player Health: " + this.health);//make health show up in the console
},

	collideHandler: function(response) {//all the 
		if(response.b.type==='EnemyBaseEntity'){
			var ydif = this.pos.y - response.b.pos.y;
			var xdif = this.pos.x - response.b.pos.x;

			if(ydif<-40 && xdif< 70 && xdif>-35){
				this.body.falling = 	false;
				this.body.vel.y = -1;
			}
			else if(xdif>-35 && this.facing==='right' && xdif<0){//
				this.body.vel.x = 0;
				//this.pos.x = this.pos.x -1;
			}else if(xdif<70 && this.facing==='left' && xdif>0){//
				this.body.vel.x = 0;
				//this.pos.x = this.pos.x +1;
			}

			if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer) {//makes the enemy tower destroyed with health 
				console.log("tower Hit");
				this.lastHit = this.now;
				response.b.loseHealth(game.data.playerAttack);
			}
		}else if (response.b.type==='EnemyCreep') {
			 var xdif = this.pos.x - response.b.pos.x;
			 var ydif = this.pos.y - response.b.pos.y;

			 if(xdif>0){
			 	//this.pos.x = this.pos.x + 1;
			 	if(this.facing==="left"){
			 		this.body.vel.x = 0;
			 	}
			 }else{
			 	//this.pos.x = this.pos.x - 1; 
			 	if(this.facing==="right"){
			 		this.body.vel.x = 0;
			 	}
			 }
			if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
				&& (Math.abs(ydif) <=40) && 
				(((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))
				){//makes the enemy deleted from the screen
				this.lastHit = this.now;
			//if the creeps health is less than our attack execute code in if statement 
				if(response.b.health <= game.data.playerAttack){
					//adds one gold for & creep kill
					game.data.gold += 1;
					console.log("Current gold: " + game.data.gold);
				}

				response.b.loseHealth(game.data.playerAttack);
			}
		}
	}
});

game.PlayerBaseEntity = me.Entity.extend({//launchs the playersbase to show
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
		this.health = game.data.playerBaseHealth;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);
		this.type = "PlayerBase";

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

loseHealth: function(damage){
	this.health = this.health - damage;
},

onCollision: function(){

}

});

game.EnemyBaseEntity = me.Entity.extend({//launches and shows the enemybase on the website
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
		this.health = game.data.enemyBaseHealth;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);
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
	
},

loseHealth: function(damage){
	this.health -= damage;
}
});

game.EnemyCreep = me.Entity.extend({//code for the enemycreep to be on webstie
	init: function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "creep1",
			width: 32,
			height: 64,
			spritewidth: "32",
			spriteheight: "64",
			getShape: function(){
				return (new me.Rect(0, 0, 32, 64)).toPolygon();
			}
	}]);
		this.health = game.data.enemyCreepHealth;
		this.alwaysUpdate = true;
		//this.attcking lets us know if the enemy is hitting the base
		this.attacking = false;
		//keeps track of when our creep last attacked the base
		this.lastAttacking = new Date().getTime();
		//keeps track of the last time our creep hit anything
		this.lastHit = new Date().getTime();
		this.now = new Date().getTime();
		this.body.setVelocity(3, 20);

		this.type ="EnemyCreep";
	
		this.renderable.addAnimation("walk", [3, 4, 5], 80);
		this.renderable.setCurrentAnimation("walk");	
	},

	loseHealth: function(damage){
		this.health = this.health - damage;
		console.log("EnemyCreep Health: " + this.health);
	},

	update:function(delta){//function to make creep move 
		if (this.health <= 0) {
			me.game.world.removeChild(this);
		}


		this.now = new Date().getTime();

		this.body.vel.x -= this.body.accel.x * me.timer.tick;//makes creep spawn and move

		me.collision.check(this, true, this.collideHandler.bind(this), true);//checking for collisions

		this.body.update(delta);//updates constantly

		this._super(me.Entity, "update", [delta]);//updates movement
		return true;
	},

	collideHandler: function(response){//checking for collisions
		if(response.b.type==='PlayerBase') {
			this.attacking=true;
			//this.lastAttacking=this.now;
			this.body.vel.x = 0;
			//keeps moving the creep to the right to main tain its position
			this.pos.x = this.pos.x + 1;
			//checks that it has been at least 1 second since this creep hit a base
			if((this.now-this.lastHit >= 1000)) {
				//updates the lastHit timer
				this.lastHit = this.now;
				//makes the player base call its loseHealth function
				//damage of 1
				response.b.loseHealth(game.data.enemyCreepAttack);
			}
		}else if (response.b.type==='PlayerEntity'){
			var xdif = this.pos.x - response.b.pos.x;

			this.attacking=true;
			//this.lastAttacking=this.now;
			this.body.vel.x = 0;
			//keeps moving the creep to the right to main tain its position
			if (xdif>0){
				this.pos.x = this.pos.x + 1;
				this.body.vel.x = 0;
			}
			//checks that it has been at least 1 second since this creep hit a base
			if((this.now-this.lastHit >= 1000) && xdif>0) {
			//updates the lastHit timer
			this.lastHit = this.now;
			//makes the player call its loseHealth function
			//damage of 1
			response.b.loseHealth(game.data.enemyCreepAttack);
			}
		}else if (response.b.type==='Gloop'){
			var xdif = this.pos.x - response.b.pos.x;

			this.attacking=true;
			//this.lastAttacking=this.now;
			this.body.vel.x = 0;
			//keeps moving the creep to the right to main tain its position
			if (xdif>0){
				this.pos.x = this.pos.x + 1;
				this.body.vel.x = 0;
			}
			//checks that it has been at least 1 second since this creep hit a base
			if((this.now-this.lastHit >= 1000) && xdif>0) {
			//updates the lastHit timer
			this.lastHit = this.now;
			//makes the player call its loseHealth function
			//damage of 1
			response.b.loseHealth(game.data.enemyCreepAttack);
			}
		}
	}
});
//first try on intermidiate 
game.Gloop = me.Entity.extend({//code for the enemycreep to be on webstie
	init: function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "gloop",
			width: 100,
			height: 85,
			spritewidth: "100",
			spriteheight: "85",
			getShape: function(){
				return (new me.Rect(0, 0, 85, 100)).toPolygon();
			}
	}]);
		this.health = game.data.playerHealth;
		this.alwaysUpdate = true;
		//this.attcking lets us know if the enemy is hitting the base
		this.attacking = false;
		//keeps track of when our creep last attacked the base
		this.lastAttacking = new Date().getTime();
		//keeps track of the last time our creep hit anything
		this.lastHit = new Date().getTime();
		this.now = new Date().getTime();
		this.body.setVelocity(3, 20);

		this.type ="gloop";
	
		this.renderable.addAnimation("walk", [3, 4, 5], 80);
		this.renderable.setCurrentAnimation("walk");	
	},

	loseHealth: function(damage){
		this.health = this.health - damage;
		console.log("enemyCreepHealth: " + this.health);
	},

	update:function(delta){//function to make creep move 
		if (this.health <= 0) {
			me.game.world.removeChild(this);
		}


		this.now = new Date().getTime();

		this.body.vel.x += this.body.accel.x * me.timer.tick;//makes creep spawn and move
		this.flipX(true);

		me.collision.check(this, true, this.collideHandler.bind(this), true);//checking for collisions

		this.body.update(delta);//updates constantly

		this._super(me.Entity, "update", [delta]);//updates movement
		return true;
	},

	collideHandler: function(response){//checking for collisions
		if(response.b.type==='EnemyBaseEntity') {
			this.attacking=true;
			//this.lastAttacking=this.now;
			this.body.vel.x = 0;
			//keeps moving the creep to the right to main tain its position
			this.pos.x = this.pos.x + 1;
			//checks that it has been at least 1 second since this creep hit a base
			if((this.now-this.lastHit >= 1000)) {
				//updates the lastHit timer
				this.lastHit = this.now;
				//makes the player base call its loseHealth function
				//damage of 1
				response.b.loseHealth(game.data.playerAttack);
			}
		}else if (response.b.type==='EnemyCreep'){
			var xdif = this.pos.x - response.b.pos.x;

			this.attacking=true;
			//this.lastAttacking=this.now;
			this.body.vel.x = 0;
			//keeps moving the creep to the right to main tain its position
			if (xdif>0){
				this.pos.x = this.pos.x + 1;
				this.body.vel.x = 0;
			}
			//checks that it has been at least 1 second since this creep hit a base
			if((this.now-this.lastHit >= 1000) && xdif>0) {
			//updates the lastHit timer
			this.lastHit = this.now;
			//makes the player call its loseHealth function
			//damage of 1
			response.b.loseHealth(game.data.playerAttack);
			}
		}
	}
});

game.GameManager = Object.extend({
	init: function(x, y, settings) {
		this.now = new Date().getTime();
		this.lastCreep = new Date().getTime();
		this.paused = false; 
		this.alwaysUpdate = true;
	},

	update: function(){
		this.now = new Date().getTime();

		if(game.data.player.dead){
			me.game.world.removeChild(game.data.player);
			me.state.current().resetPlayer(10, 0);
		}

		if(Math.round(this.now/1000)%20 ===0 && (this.now - this.lastCreep >= 1000)) {
			game.data.gold += 1;
			console.log("Current gold: " + game.data.gold);
			}

		if(Math.round(this.now/1000)%10 ===0 && (this.now - this.lastCreep >= 1000)) {
			this.lastCreep = this.now;
			var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
			me.game.world.addChild(creepe, 5);
			var gloop = me.pool.pull("Gloop", 200, 0, {});
			me.game.world.addChild(gloop, 5);
		}
		return true;
	}
});