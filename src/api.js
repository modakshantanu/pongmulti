import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');


export function subscribe(updateCallback,initialCallback) {
	socket.on('serverUpdate', (data) => {
		updateCallback(data);
	})

	socket.on('initialData', (data) => {
		initialCallback(data);
	})
}


export function sendUpdate(data) {
	socket.emit('clientUpdate', data);
}