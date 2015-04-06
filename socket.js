(function(nt) {
"use strict";

var socket,

	requestId = 0,
	callbacks = [],

	queue = [],

	credentials = {},
	bcrypt = new BCrypt(),

	loadSocket,

	loggedIn = false;

//Returns a promise for when Nova reponds
function send(message, deferred) {

	//Create a promise if required and attach it
	deferred = deferred || $q.defer();
	callbacks[requestId] = deferred;

	//Append requestId to the packet (for when it comes back)
	message.requestId = requestId;

	//Convert message to JSON
	message = JSON.stringify(message);

	//Send it
	if (socket.readyState === 1) {
		socket.send(message);

	//Not connected, push it onto a queue that we"ll send when we connect
	} else {
		queue.push(message);
	}

	//Inc requestId for next
	requestId += 1;

	return deferred.promise;
}

function onMessage(e) {
	var data = JSON.parse(e.data),
		callback = callbacks[data.requestId];

	//Handle it first
	if (data.id === "onLogin") {
		loggedIn = true;
		credentials.actualName = data.account;
	}

	//Resolve the message
	if (typeof callback !== "undefined") {
		delete callbacks[data.requestId];

		if (data.id.indexOf("Fail") > 0) {
			callback.reject(data);
		} else {
			callback.resolve(data);
		}
	}

	//Now emit the event
	$rootScope.$broadcast(data.id, data);

}

function onOpen() {
	var i;

	//Send our queue
	for (i = 0; i < queue.length; i += 1) {
		socket.send(queue[i]);
	}

	//Clear the queue
	queue = [];
}

function onClose() {
	loggedIn = false;
	loadSocket();
	if (typeof credentials.name === "string") {
		send({id: "login", account: credentials.name, password: credentials.password});
	}
}

function onError() {
}

//Declared above, so we just set it
loadSocket = function () {
	socket = new WebSocket(nt.SERVER_ADDRESS);
	socket.onmessage = onMessage;
	socket.onopen = onOpen;
	socket.onclose = onClose;
	socket.onerror = onError;
};

loadSocket();

nt.Socket = {

/**********************************************************
*   Getters/setters
*/
	get loggedIn() {
		return loggedIn;
	},
	get name() {
		return credentials.actualName;
	},

/**********************************************************
*   Account
*/
	login: function (name, password) {
		var deferred = $q.defer();

		if (password === "blah") {
			send({id: "login", account: name, password: "$2a$10$Nov4t3n7weNTeE51KstHuuu1yr9SafCLnFNtUVkZVTE6Mv3A7aueu"}, deferred);

		} else if (password === "") {
			credentials.name = name;
			credentials.password = password;

			send({id: "login", account: name, password: password}, deferred);
		} else {
			bcrypt.hashpw(password + "nova10262013", "$2a$10$Nov4t3n7weNTeE51KstHu4", function (hash) {
				credentials.name = name;
				credentials.password = hash;

				send({id: "login", account: name, password: hash}, deferred);
			});
		}

		return deferred.promise;
	},

/**********************************************************
*   Misc
*/
	whisper: function(account, message) {
		return send({id: "whisper", account: account, message: message});
	},
	
	broadcast: function(data) {

		if (typeof data === "undefined") {
			data = {id: "broadcast"};

		} else if (typeof data === "object") {
			data.id = "broadcast";

		} else {
			data = {id: "broadcast", data: data};
		}

		return send(data);
	},

/**********************************************************
*   Groups
*/
	join: function(group) {
		return send({id: "join", group: group});
	},

/**********************************************************
*   Friends
*/
	friendList: function(tag) {
		return send({id: "friendList", tag: tag});
	}

};

}(nt));
