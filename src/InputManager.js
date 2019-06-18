const KEY = {
	
	A: 65,
	S: 83,
	K: 75,
	L: 76
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
		 this.pressedKeys = {r1:0,l1:0,r2:0,l2:0}
	}

	handleKeys(value, e){
		let keys = this.pressedKeys;
		switch (e.keyCode) {
			case KEY.A:
				keys.l1  = value;
				break;
			case KEY.S:
				keys.r1  = value;
				break;
			case KEY.K:
				keys.l2 = value;
				break;
			case KEY.L:
				keys.r2  = value;
				break;
				default:
		 }
		 this.pressedKeys = keys;
	 }
 }