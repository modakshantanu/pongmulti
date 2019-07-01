const KEY = {
	ONE:49, // Red 1 left/up
	TWO:50, // Red 1 right/down
	S: 83, // Red 2 left 
	D: 68, // Red 2 right
	V: 86, // Red 3 left
	B: 66, // Red 3 right
	N: 78, // Blue 3 left
	M: 77, // Blue 3 right
	L: 76, // Blue 2 left
	SEMICOLON: 186, // Blue 2 right
	MINUS: 189, // Blue 1 left/down
	EQUAL: 187, // Blue 1 right
 };

 export default class InputManager {

	bindKeys() {
		window.addEventListener('keyup',   this.handleKeys.bind(this, false));
		window.addEventListener('keydown', this.handleKeys.bind(this, true));
	}
	
	unbindKeys() {
		window.removeEventListener('keyup', this.handleKeys);
		window.removeEventListener('keydown', this.handleKeys);
	}
	constructor() {
		this.pressedKeys = {};
		this.pressedKeys.red1 = {right:0,left:0};
		this.pressedKeys.red2 = {right:0,left:0};
		this.pressedKeys.red3 = {right:0,left:0};
		this.pressedKeys.blue1 = {right:0,left:0};
		this.pressedKeys.blue2 = {right:0,left:0};
		this.pressedKeys.blue3 = {right:0,left:0};
	}

	// The pressedKeys object holds either a 0 or a 1 for each key whether it is pressed or not
	// It is always updated in real time once the eventListener is added
	handleKeys(value, e){
		let keys = this.pressedKeys;
		switch (e.keyCode) {
			case KEY.ONE:
				keys.red1.left = value;
				break;
			case KEY.TWO:
				keys.red1.right = value;
				break;
			case KEY.S:
				keys.red2.left = value;
				break;
			case KEY.D:
				keys.red2.right = value;
				break;
			case KEY.V:
				keys.red3.left = value;
				break;
			case KEY.B:
				keys.red3.right = value;
				break;
			case KEY.N:
				keys.blue3.left = value;
				break;
			case KEY.M:
				keys.blue3.right = value;
				break;
			case KEY.L:
				keys.blue2.left = value;
				break;
			case KEY.SEMICOLON:
				keys.blue2.right = value;
				break;
			case KEY.MINUS:
				keys.blue1.left = value;
		
				break;
			case KEY.EQUAL:
				keys.blue1.right = value;
				break;
				default:
		 }
		 this.pressedKeys = keys;
	 }
	 
 }