import openSocket from 'socket.io-client';
// Replace with server IP 
const socket = openSocket('http://172.104.176.106:8000');
// const socket = openSocket('http://localhost:8000');

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


export function subscribe(matchCb,stateUpdate,posUpdate,overCb,serverStatus) {


	socket.on('match',(data) => {
		matchCb(data)
	})

	socket.on('gameUpdate', (data) => {

		if (data.type === PacketType.STATE) {
			stateUpdate(data);
		} else if (data.type === PacketType.POSITION) {
			posUpdate(data);
		}
	})

	socket.on('gameOver', () => {
		overCb();
	})
	socket.on("serverStatus", (data) => {
		serverStatus(data);
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


