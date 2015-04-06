(function(nt) {
"use strict";

function Unit(components, properties) {
	
	this._entity = new pc.Entity();
	
	for (let component in components)
		this._entity.addComponent(component, components[component]);
	
	for (let property in properties)
		this[property] = properties[property];
	
}

Object.defineProperties(Unit, {
	"position:" {
		get: function() {
			return this._entity.getPosition();
		},
		set: function(value) {
			this._entity.setPosition(value);
		}
	},
	"x" : {
		get: function() {
			return this._entity.getPosition().x;
		},
		set: function(value) {
			var position = this._entity.getPosition();
			position.x = value;
			this._entity.setPosition(position);
		}
	},
	"y" : {
		get: function() {
			return this._entity.getPosition().y;
		},
		set: function(value) {
			var position = this._entity.getPosition();
			position.y = value;
			this._entity.setPosition(position);
		}
	},
	"z" : {
		get: function() {
			return this._entity.getPosition().z;
		},
		set: function(value) {
			var position = this._entity.getPosition();
			position.z = value;
			this._entity.setPosition(position);
		}
	}
});

nt.Unit = Unit;

}(nt));
