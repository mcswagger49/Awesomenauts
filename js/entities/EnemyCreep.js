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