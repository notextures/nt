(function(window) {
"use strict";

window.nt = {
	SERVER_ADDRESS: "wss://notextures.io:8082"
};

}(window));

pc.script.create('nt', function (context) {
	
	function _nt(entity) {
		this.entity = entity;
	}
	
	_nt.prototype = {
		
		initialize: function() {
			
			nt.socket = new nt.Socket();
			
		}
		
	};
	
	return _nt;
	
});
