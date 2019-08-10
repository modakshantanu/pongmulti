

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
		this.pressedKeys = {left:false,right:false};
	}


	// The pressedKeys object holds either a 0 or a 1 for each key whether it is pressed or not
	// It is always updated in real time once the eventListener is added
	handleKeys(value, e){
		let keys = this.pressedKeys;
		
		switch (e.key) {
		
			case 'a':case 'A':
				keys.left = value?true:false;
				break;
			case 'd':case 'D':
				keys.right = value?true:false;
				break;
				default:
		 }
		 this.pressedKeys = keys;
	 }
	 
 }