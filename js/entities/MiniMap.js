game.MiniMap = me.Entity.extend({//launches and shows the minimap on the website
	init: function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "minimap",
			width: 639,
			height: 162,
			spritewidth: "639",
			spriteheight: "162",
			getShape: function(){
				return (new me.Rect(0, 0, 639, 162)).toPolygon();
			}
			}]);
			this.floating = true;

	}
});