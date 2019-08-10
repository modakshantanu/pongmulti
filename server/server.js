let Game = require('./Game');
let constants = require('./utils/constants');

var io = require('socket.io')();
const port = process.env.PORT|| 8000;



var queue = [];
var games = {};


var nextGameId = 0;

io.on('connection', (client) => {
	console.log(client.id+" has connected");

	client.on('disconnect' , () => {
		console.log(client.id+ " has disconnected");

		for (let key in games) {
			if (games.hasOwnProperty(key)) {
				if (games[key].redId === client.id || games[key].blueId === client.id) {
					console.log("Game "+key+ " ended due to disconnect");
					if (games[key].redId === client.id) io.to(`${games[key].blueId}`).emit('gameOver');
					else io.to(`${games[key].redId}`).emit('gameOver');
					delete games[key];
					break;
				}
			}
		}
		for (let i = 0; i < queue.length; i++)  {
			if (queue[i].id === client.id) {
				queue.splice(i,1);
				break;
			}
		}

	})

	client.on('queueing' , (data) => {

		console.log(client.id+ " queueing, data = " + data);
		let playerObj = {
			id:client.id,
			handle:data
		}
		queue.push(playerObj);
		io.to(`${client.id}`).emit('queueingAck');
	});

	client.on('input', (data) => {
		if (games.hasOwnProperty(data.gameId)) {
			games[data.gameId].newInput(data);
		}
		
	})
})


setInterval(() => {
	if (queue.length >= 2) {
		let redPlayer = queue.shift();
		let bluePlayer = queue.shift();
		console.log("New game: "+ redPlayer.handle + " vs "+bluePlayer.handle);
		


		io.to(`${redPlayer.id}`).emit('match',{redHandle:redPlayer.handle, blueHandle:bluePlayer.handle,gameId:nextGameId,ourPlayer:0});
		io.to(`${bluePlayer.id}`).emit('match',{redHandle:redPlayer.handle, blueHandle:bluePlayer.handle,gameId:nextGameId,ourPlayer:1});

		games[nextGameId++] = new Game({redId:redPlayer.id,blueId:bluePlayer.id,sendPacket:sendPacket,gameMode:1});
	}
},500);


function sendPacket(packet,id) {
	io.to(`${id}`).emit('gameUpdate',packet);
}
setInterval(() => {

	for (let key in games) {
		if (games.hasOwnProperty(key)) {
			games[key].update();
			if (games[key].delete) {
				delete games[key];
			}
		}
	}

},constants.updateTime)




io.listen(port);
console.log("listening on port",port);