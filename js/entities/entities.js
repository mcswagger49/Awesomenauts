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
	this.attacking = false;
	this.dead = false;
},
addAnimation: function(){
	this.renderable.addAnimation("idle", [78]);//makes the player orc to face the screen 
	this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
	this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
},
update: function(delta) {
		this.now = new Date().getTime();
		this.dead = checkIfDead();
		this.checkKeyPressesAndMove();
		this.setAnimation();
		me.collision.check(this, true, this.collideHandler.bind(this), true);
		this.body.update(delta);
		this._super(me.Entity, "update", [delta]);//updating our animation
		return true;
},
checkIfDead: function(){
		if (this.health <= 0) {
		 return true;
		}
		return false;
},
checkKeyPressesAndMove: function(){
		if(me.input.isKeyPressed("right")){
 			this.moveRight();
		}else if(me.input.isKeyPressed("left")){
			this.moveLeft();
 		}else{
 			this.body.vel.x = 0;
 		}

		if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling){
				this.jump();
			}
			this.attacking = me.input.isKeyPressed("attack");
		}
},
moveRight: function(){
  		//set the position of my x by adding the velocity defined above in
 		//setVelocity() and multiplying it by me.timer.tick.
 		//me.timer.tick makes the movement look smooth
		this.body.vel.x += this.body.accel.x * me.timer.tick;
		this.facing = "right";
		this.now = new Date() .getTime();
		this.lastHit = this.now;
		this.lastAttack = new Date() .getTime();
		this.flipX(true); 
},
moveLeft: function(){
		this.facing = "left";
		this.body.vel.x -= this.body.accel.x * me.timer.tick;	
		this.flipX(false); 
},
setAnimation: function(){
	if (this.attacking) {//the key the attack
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
	},

	loseHealth: function(damage){
		this.health = this.health - damage;//add the player taking damage
		console.log("Player Health: " + this.health);//make health show up in the console
},
jump: function(){
	this.body.jumping = true;
	this.body.vel.y -= this.body.accel.y * me.timer.tick;
},
collideHandler: function(response) {//all the 
		if(response.b.type==='EnemyBaseEntity'){
			this.collideWithEnemyBase(response);
		}else if (response.b.type==='EnemyCreep') {
			this.collideWithEnemyCreep(response);
		}
},
collideWithEnemyBase: function(response){
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
},
collideWithEnemyCreep: function(response){
		 var xdif = this.pos.x - response.b.pos.x;
		 var ydif = this.pos.y - response.b.pos.y;

		this.stopMovement(xdif);

	if(this.checkAttack(xdif, ydif)){
	   this.hitCreep(response);
};
},
stopMovement: function(xdif){
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
},
checkAttack: function(xdif, ydif){
		 if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
			&& (Math.abs(ydif) <=40) && 
			(((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))
			){//makes the enemy deleted from the screen
			this.lastHit = this.now;
			//if the creeps health is less than our attack execute code in if statement 
			return true;
		}
		return false;
	}

hitCreep: function(response){
		if(response.b.health <= game.data.playerAttack){
				//adds one gold for & creep kill
				game.data.gold += 1;
				console.log("Current gold: " + game.data.gold);
			}
			response.b.loseHealth(game.data.playerAttack);
},
});
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
},
});
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
},
})
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
},
});