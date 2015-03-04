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
		game.data.win = true;
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