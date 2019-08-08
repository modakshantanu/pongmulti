
var io = require('socket.io')();
const port = 8000;


var gameState = {
	paddles : [50,50],
	// ball = {
	// 	x:250,
	// 	y:250,
	// 	dx:2,dy:2
	// }
}

var idMap = {};
var idMapLength = 0;

io.on('connection', (client) => {
	console.log(client.id);

	if (idMapLength < 2) {
		idMap[client.id] = idMapLength;
		console.log("Player "+ idMapLength+ " Joined");
		client.emit('initialData',{id:idMapLength});
		idMapLength++;
	} else {
		console.log("Extra player ignored");
	}
	
	setInterval(() => {
		client.emit('serverUpdate',gameState);
	},20);

	client.on('clientUpdate', (data)=> {
		console.log("Received update from " + data.id);
		console.log("New position: " + data.position);
		gameState.paddles[data.id] = data.position;
	})
})



io.listen(port);
console.log("listening on port",port);