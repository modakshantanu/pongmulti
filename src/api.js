import openSocket from 'socket.io-client';
const socket = openSocket('http://139.162.22.70:8000');
//const socket = openSocket('http://localhost:8000');

const PacketType = {
	POSITION:0,
	STATE:1
}

const GameState = {
	NOT_QUEUEING:0,
	QUEUEING:1,
	PRE_MATCH:2,
	RUNNING:3,
	GOAL_SCORED:4,
	POST_MATCH:5,
}


export function subscribe(matchCb,stateUpdate,posUpdate,overCb) {


	socket.on('match',(data) => {
		matchCb(data)
		console.log("match started",data);
	})

	socket.on('gameUpdate', (data) => {

		if (data.type === PacketType.STATE) {
			stateUpdate(data);
		} else if (data.type === PacketType.POSITION) {
			posUpdate(data);
		}
	})

	socket.on('gameOver', (data) => {
		overCb(data);
	})

	

}

let time = Date.now();

export function sendInput(data) {
	// console.log("Sending FPS", 1000/(Date.now() - time));
	// time = Date.now();
	socket.emit('input',data);

}	

export function queue(handle,cb) {
	socket.emit('queueing', handle);
	socket.on("queueingAck",cb);
}


